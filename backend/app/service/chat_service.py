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
        return ChatRepository.create_message(db, message)

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
        
        return [ChatMessageResponse.model_validate(m) for m in messages]

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
            else:
                resp.other_party_name = f"{s.customer.first_name} {s.customer.last_name}" if s.customer else "Customer"
                
            results.append(resp)
        return results
