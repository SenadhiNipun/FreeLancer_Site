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
        # Import entities here to avoid circular imports during registration
        from app.entity.user_entity import UserEntity
        from app.entity.role_entity import RoleEntity
        from app.entity.user_role_entity import UserRoleEntity
        from app.entity.user_profile_entity import UserProfileEntity
        from app.entity.writer_profile_entity import WriterProfileEntity
        from app.entity.writer_qualification_entity import WriterQualificationEntity
        from app.entity.field_entity import FieldEntity
        from app.entity.writer_field_entity import WriterFieldEntity
        
        logger.info("Initializing database schema...")
        Base.metadata.create_all(bind=engine)
        logger.info("Database synchronized successfully.")
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
