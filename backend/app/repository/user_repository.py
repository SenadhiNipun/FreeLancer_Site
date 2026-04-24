from sqlalchemy.orm import Session
from typing import List

from app.entity.user_entity import UserEntity
from app.entity.user_profile_entity import UserProfileEntity
from app.entity.writer_profile_entity import WriterProfileEntity
from app.entity.user_role_entity import UserRoleEntity
from app.entity.writer_field_entity import WriterFieldEntity


class UserRepository:

    @staticmethod
    def get_user_by_email(db: Session, email: str) -> UserEntity | None:
        return (
            db.query(UserEntity)
            .filter(UserEntity.email == email)
            .first()
        )

    @staticmethod
    def get_user_by_username(db: Session, username: str) -> UserEntity | None:
        return (
            db.query(UserEntity)
            .filter(UserEntity.username == username)
            .first()
        )

    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> UserEntity | None:
        return (
            db.query(UserEntity)
            .filter(UserEntity.id == user_id)
            .first()
        )

    @staticmethod
    def save_user(db: Session, user: UserEntity) -> UserEntity:
        db.add(user)
        db.flush()
        db.refresh(user)
        return user

    @staticmethod
    def save_user_role(db: Session, user_role: UserRoleEntity) -> UserRoleEntity:
        db.add(user_role)
        db.flush()
        db.refresh(user_role)
        return user_role

    @staticmethod
    def save_user_profile(db: Session, user_profile: UserProfileEntity) -> UserProfileEntity:
        db.add(user_profile)
        db.flush()
        db.refresh(user_profile)
        return user_profile

    @staticmethod
    def save_writer_profile(db: Session, writer_profile: WriterProfileEntity) -> WriterProfileEntity:
        db.add(writer_profile)
        db.flush()
        db.refresh(writer_profile)
        return writer_profile

    @staticmethod
    def save_writer_fields(db: Session, writer_fields: List[WriterFieldEntity]):
        db.add_all(writer_fields)
        db.flush()

    @staticmethod
    def save_writer_qualifications(db: Session, qualifications: List[any]):
        db.add_all(qualifications)
        db.flush()
