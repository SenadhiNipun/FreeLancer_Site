from urllib import parse
from typing import Annotated

from fastapi import Depends
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base, Session

from .config import MYSQL_USER, MYSQL_PASSWORD, MYSQL_HOST, MYSQL_PORT, MYSQL_DB
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


test_db_connection()


# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker, declarative_base
# from .config import settings, MYSQL_USER, MYSQL_PASSWORD
#
# # Create engine
# engine = create_engine(
#     settings.DATABASE_URL,
#     pool_pre_ping=True
# )
#
# # Create SessionLocal class
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
#
# # Base class for models
# Base = declarative_base()
#
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()
