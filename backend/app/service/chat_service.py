from sqlalchemy.orm import Session
from app.entity.chat_session_entity import ChatSessionEntity
from app.entity.chat_message_entity import ChatMessageEntity
from app.repository.chat_repository import ChatRepository
from app.repository.task_repository import TaskRepository
from app.model.chat_model import ChatMessageCreate, ChatMessageResponse, ChatSessionResponse
from app.exceptions.exception import NotFoundException, ValidationException

class ChatService:
    @staticmethod
    def initialize_chat(db: Session, task_id: int, customer_id: int, writer_id: int):
        # Check if session already exists
        existing = ChatRepository.get_session_by_task_and_users(db, task_id, customer_id, writer_id)
        if existing:
            return existing
        
        new_session = ChatSessionEntity(
            task_id=task_id,
            customer_id=customer_id,
            writer_id=writer_id
        )
        return ChatRepository.create_session(db, new_session)

    @staticmethod
    def send_message(db: Session, session_id: int, sender_id: int, request: ChatMessageCreate):
        session = ChatRepository.get_session_by_id(db, session_id)
        if not session:
            raise NotFoundException(detail="Chat session not found")
        
        if sender_id not in [session.customer_id, session.writer_id]:
            raise ValidationException(detail="You are not a participant in this chat")
            
        message_type = request.message_type or "TEXT"
        proposed_amount = None
        bid_change_status = None
        
        if message_type == "BID_CHANGE":
            if sender_id != session.writer_id:
                raise ValidationException(detail="Only the writer can request a bid change")
            if not request.proposed_amount or request.proposed_amount <= 0:
                raise ValidationException(detail="Proposed amount must be a positive number")
            
            # Verify writer has an active/pending bid
            from app.entity.task_bid_entity import TaskBidEntity
            bid = db.query(TaskBidEntity).filter(
                TaskBidEntity.task_id == session.task_id,
                TaskBidEntity.writer_id == sender_id,
                TaskBidEntity.bid_status.in_(["PENDING", "ACCEPTED"])
            ).first()
            
            if not bid:
                raise ValidationException(detail="You must have placed a bid on this task to request a change")
            
            # Check if any bid has been accepted for this task
            accepted_bid = db.query(TaskBidEntity).filter(
                TaskBidEntity.task_id == session.task_id,
                TaskBidEntity.bid_status == "ACCEPTED"
            ).first()
            
            if accepted_bid:
                raise ValidationException(detail="Cannot change bid after a bid has been accepted for this task")
                
            proposed_amount = request.proposed_amount
            bid_change_status = "PENDING"
        
        message = ChatMessageEntity(
            session_id=session_id,
            sender_id=sender_id,
            message_text=request.message_text,
            message_type=message_type,
            proposed_amount=proposed_amount,
            bid_change_status=bid_change_status
        )
        
        created_message = ChatRepository.create_message(db, message)
        
        # Save attachments if present
        if request.attachments:
            from app.entity.chat_message_attachment_entity import ChatMessageAttachmentEntity
            for att in request.attachments:
                db_att = ChatMessageAttachmentEntity(
                    message_id=created_message.id,
                    file_name=att.file_name,
                    file_url=att.file_url,
                    mime_type=att.mime_type,
                    file_size=att.file_size
                )
                db.add(db_att)
            db.commit()
            db.refresh(created_message)
        
        recipient_id = session.writer_id if sender_id == session.customer_id else session.customer_id
        from app.service.notification_service import NotificationService
        
        if message_type == "BID_CHANGE":
            from app.entity.user_entity import UserEntity
            writer = db.query(UserEntity).filter(UserEntity.id == sender_id).first()
            writer_name = f"{writer.first_name} {writer.last_name}" if writer else "The writer"
            
            NotificationService.create_notification(
                db=db,
                user_id=recipient_id,
                title="Bid Change Requested",
                message=f"{writer_name} has requested to change the bid to ${proposed_amount:.2f} for task '{session.task.title}'" if getattr(session, 'task', None) else f"{writer_name} has requested a bid change.",
                notification_type="BID_CHANGE_REQUESTED",
                related_id=session_id
            )
        else:
            NotificationService.create_notification(
                db=db,
                user_id=recipient_id,
                title="New Message",
                message=f"You received a new message regarding task: '{session.task.title}'" if getattr(session, 'task', None) else "You received a new message",
                notification_type="NEW_MESSAGE",
                related_id=session_id
            )
        
        return created_message

    @staticmethod
    def get_messages(db: Session, session_id: int, user_id: int):
        session = ChatRepository.get_session_by_id(db, session_id)
        if not session:
            raise NotFoundException(detail="Chat session not found")
        
        if user_id not in [session.customer_id, session.writer_id]:
            raise ValidationException(detail="You are not a participant in this chat")
        
        messages = ChatRepository.get_messages_by_session(db, session_id)
        
        # Mark as read
        ChatRepository.mark_messages_as_read(db, session_id, user_id)
        
        results = []
        for m in messages:
            resp = ChatMessageResponse.model_validate(m)
            resp.sender_profile_image_url = m.sender.profile_image_url if m.sender else None
            results.append(resp)
        return results

    @staticmethod
    def get_user_chat_sessions(db: Session, user_id: int):
        sessions = ChatRepository.get_user_sessions(db, user_id)
        results = []
        for s in sessions:
            resp = ChatSessionResponse.model_validate(s)
            # Add extra info for UI
            resp.task_title = s.task.title if s.task else "Unknown Task"
            
            # Name of the other person
            if user_id == s.customer_id:
                resp.other_party_name = f"{s.writer.first_name} {s.writer.last_name}" if s.writer else "Writer"
                resp.other_party_profile_image_url = s.writer.profile_image_url if s.writer else None
            else:
                resp.other_party_name = f"{s.customer.first_name} {s.customer.last_name}" if s.customer else "Customer"
                resp.other_party_profile_image_url = s.customer.profile_image_url if s.customer else None
            
            # Check if any bid on this task has been accepted
            from app.entity.task_bid_entity import TaskBidEntity
            any_accepted = db.query(TaskBidEntity).filter(
                TaskBidEntity.task_id == s.task_id,
                TaskBidEntity.bid_status == "ACCEPTED"
            ).first() is not None
            resp.is_bid_accepted = any_accepted
                
            results.append(resp)
        return results

    @staticmethod
    def toggle_session_status(db: Session, session_id: int, user_id: int):
        session = ChatRepository.get_session_by_id(db, session_id)
        if not session:
            raise NotFoundException(detail="Chat session not found")
        
        if user_id not in [session.customer_id, session.writer_id]:
            raise ValidationException(detail="You are not a participant in this chat")
        
        session.is_active = not session.is_active
        db.commit()
        db.refresh(session)
        return session

    @staticmethod
    def delete_message(db: Session, message_id: int, user_id: int):
        message = db.query(ChatMessageEntity).filter(ChatMessageEntity.id == message_id).first()
        if not message:
            raise NotFoundException(detail="Message not found")
        
        if message.sender_id != user_id:
            raise ValidationException(detail="You can only delete your own messages")
        
        from datetime import datetime
        time_diff = (datetime.now() - message.created_at).total_seconds()
        if time_diff > 120:
            raise ValidationException(detail="Messages can only be deleted within 2 minutes of sending")
        
        db.delete(message)
        db.commit()

    @staticmethod
    def respond_to_bid_change(db: Session, message_id: int, user_id: int, action: str):
        message = db.query(ChatMessageEntity).filter(ChatMessageEntity.id == message_id).first()
        if not message:
            raise NotFoundException(detail="Message not found")
        
        session = ChatRepository.get_session_by_id(db, message.session_id)
        if not session:
            raise NotFoundException(detail="Chat session not found")
            
        if user_id != session.customer_id:
            raise ValidationException(detail="Only the client can respond to a bid change request")
            
        if message.message_type != "BID_CHANGE":
            raise ValidationException(detail="This message is not a bid change request")
            
        if message.bid_change_status != "PENDING":
            raise ValidationException(detail="This request has already been processed")
            
        if action not in ["ACCEPT", "REJECT"]:
            raise ValidationException(detail="Invalid action")
            
        if action == "ACCEPT":
            message.bid_change_status = "ACCEPTED"
            
            # Find the corresponding bid
            from app.entity.task_bid_entity import TaskBidEntity
            bid = db.query(TaskBidEntity).filter(
                TaskBidEntity.task_id == session.task_id,
                TaskBidEntity.writer_id == message.sender_id,
                TaskBidEntity.bid_status.in_(["PENDING", "ACCEPTED"])
            ).first()
            
            if not bid:
                raise NotFoundException(detail="Active bid not found")
                
            # Update the bid amount
            bid.bid_amount = message.proposed_amount
            
            # If the bid is already accepted, update the task budget
            if bid.bid_status == "ACCEPTED":
                session.task.budget = message.proposed_amount
            # If the bid is still pending, accept the bid!
            elif bid.bid_status == "PENDING":
                # Inlined from TaskService.accept_bid
                bid.bid_status = "ACCEPTED"
                session.task.budget = message.proposed_amount
                session.task.task_status = "PENDING_PAYMENT"
                
                # Reject other pending bids on the same task
                db.query(TaskBidEntity).filter(
                    TaskBidEntity.task_id == session.task_id,
                    TaskBidEntity.id != bid.id,
                    TaskBidEntity.bid_status == "PENDING",
                ).update({"bid_status": "REJECTED"})
                
                # Create assignment
                from app.entity.task_assignment_entity import TaskAssignmentEntity
                from datetime import datetime
                
                assignment = TaskAssignmentEntity(
                    task_id=session.task_id,
                    writer_id=bid.writer_id,
                    assignment_status="ACCEPTED",
                    accepted_at=datetime.now()
                )
                db.add(assignment)
                
            db.commit()
            
            # Notify writer that their request was accepted
            from app.service.notification_service import NotificationService
            NotificationService.create_notification(
                db=db,
                user_id=message.sender_id,
                title="Bid Change Approved!",
                message=f"The client has approved your bid change to ${message.proposed_amount:.2f} for task '{session.task.title}'" if getattr(session, 'task', None) else "The client has approved your bid change.",
                notification_type="BID_CHANGE_APPROVED",
                related_id=session.task_id
            )
        else:
            message.bid_change_status = "REJECTED"
            db.commit()
            
            # Notify writer that their request was rejected
            from app.service.notification_service import NotificationService
            NotificationService.create_notification(
                db=db,
                user_id=message.sender_id,
                title="Bid Change Declined",
                message=f"The client has declined your bid change request to ${message.proposed_amount:.2f} for task '{session.task.title}'" if getattr(session, 'task', None) else "The client has declined your bid change.",
                notification_type="BID_CHANGE_DECLINED",
                related_id=session.task_id
            )
            
        db.refresh(message)
        return message
