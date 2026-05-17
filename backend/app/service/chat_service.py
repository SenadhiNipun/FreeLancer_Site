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
        
        message = ChatMessageEntity(
            session_id=session_id,
            sender_id=sender_id,
            message_text=request.message_text
        )
        
        created_message = ChatRepository.create_message(db, message)
        
        recipient_id = session.writer_id if sender_id == session.customer_id else session.customer_id
        from app.service.notification_service import NotificationService
        
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
                
            results.append(resp)
        return results
