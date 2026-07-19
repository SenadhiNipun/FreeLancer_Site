from urllib import parse
from typing import Annotated

from fastapi import Depends
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base, Session

from .config import MYSQL_USER, MYSQL_PASSWORD, MYSQL_HOST, MYSQL_PORT, MYSQL_DB
import logging
from .logging_config import get_logger

logger = get_logger(class_name=__name__)

encoded_password = parse.quote(MYSQL_PASSWORD)

DATABASE_URL = (
    f"mysql+mysqlconnector://{MYSQL_USER}:{encoded_password}"
    f"@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"
)

engine = create_engine(
    DATABASE_URL,
    pool_recycle=3600,
    pool_size=20,
    pool_pre_ping=True,
    pool_timeout=60,
    max_overflow=40,
    echo=True
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def init_db():
    try:
        # Create the database if it doesn't exist
        root_url = (
            f"mysql+mysqlconnector://{MYSQL_USER}:{encoded_password}"
            f"@{MYSQL_HOST}:{MYSQL_PORT}"
        )
        root_engine = create_engine(root_url)
        with root_engine.connect() as conn:
            conn.execute(text(f"CREATE DATABASE IF NOT EXISTS `{MYSQL_DB}`"))
        root_engine.dispose()

        # Import entities here to avoid circular imports during registration
        from app.entity.user_entity import UserEntity
        from app.entity.role_entity import RoleEntity
        from app.entity.user_role_entity import UserRoleEntity
        from app.entity.user_profile_entity import UserProfileEntity
        from app.entity.writer_profile_entity import WriterProfileEntity
        from app.entity.writer_qualification_entity import WriterQualificationEntity
        from app.entity.field_entity import FieldEntity
        from app.entity.writer_field_entity import WriterFieldEntity
        from app.entity.writer_document_entity import WriterDocumentEntity
        from app.entity.education_level_entity import EducationLevelEntity
        from app.entity.academic_category_entity import AcademicCategoryEntity
        from app.entity.specialization_entity import SpecializationEntity
        from app.entity.task_entity import TaskEntity
        from app.entity.task_file_entity import TaskFileEntity
        from app.entity.task_assignment_entity import TaskAssignmentEntity
        from app.entity.task_submission_entity import TaskSubmissionEntity
        from app.entity.submission_file_entity import SubmissionFileEntity
        from app.entity.task_bid_entity import TaskBidEntity
        from app.entity.task_revision_entity import TaskRevisionEntity
        from app.entity.revision_file_entity import RevisionFileEntity
        from app.entity.payment_entity import PaymentEntity
        from app.entity.chat_session_entity import ChatSessionEntity
        from app.entity.chat_message_entity import ChatMessageEntity
        from app.entity.chat_message_attachment_entity import ChatMessageAttachmentEntity
        from app.entity.review_entity import ReviewEntity
        
        logger.info("Initializing database schema...")
        Base.metadata.create_all(bind=engine)
        logger.info("Database synchronized successfully.")

        # Check and dynamically add bid change columns to chat_messages
        with engine.begin() as conn:
            result = conn.execute(text("SHOW COLUMNS FROM chat_messages LIKE 'message_type'"))
            if not result.fetchone():
                logger.info("Adding bid change columns to chat_messages table...")
                conn.execute(text("ALTER TABLE chat_messages ADD COLUMN message_type VARCHAR(50) NOT NULL DEFAULT 'TEXT'"))
                conn.execute(text("ALTER TABLE chat_messages ADD COLUMN proposed_amount DECIMAL(10, 2) DEFAULT NULL"))
                conn.execute(text("ALTER TABLE chat_messages ADD COLUMN bid_change_status VARCHAR(50) DEFAULT NULL"))
                logger.info("Columns added successfully.")
    except Exception as e:
        logger.error(f"Error initializing database: {e}")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]


def test_db_connection():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        logger.debug("Database connected successfully!")
    except Exception as exception:
        logger.error(f"Database connection failed: {exception}")
