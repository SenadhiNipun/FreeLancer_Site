from sqlalchemy.orm import Session

from backend.app.entity.user_entity import UserEntity
from backend.app.entity.user_profile_entity import UserProfileEntity
from backend.app.entity.writer_profile_entity import WriterProfileEntity
from backend.app.enums.role_enum import RoleEnum
from backend.app.enums.writer_approval_status_enum import WriterApprovalStatusEnum
from backend.app.exceptions.exception import (
    NotFoundException,
    UnauthorizedException,
    ValidationException,
)
from backend.app.model.current_user_response import CurrentUserResponse
from backend.app.model.login_request import LoginRequest
from backend.app.model.register_user_request import RegisterUserRequest
from backend.app.model.register_writer_request import RegisterWriterRequest
from backend.app.model.token_response import TokenResponse
from backend.app.repository.role_repository import RoleRepository
from backend.app.repository.user_repository import UserRepository
from backend.app.util.jwt_util import create_access_token, decode_access_token
from backend.app.util.password_util import hash_password, verify_password


class AuthService:

    @staticmethod
    def register_user(db: Session, request: RegisterUserRequest) -> CurrentUserResponse:
        existing_user_by_email = UserRepository.get_user_by_email(db, request.email)
        if existing_user_by_email is not None:
            raise ValidationException(detail="Email already exists")

        existing_user_by_username = UserRepository.get_user_by_username(db, request.username)
        if existing_user_by_username is not None:
            raise ValidationException(detail="Username already exists")

        user_role = RoleRepository.get_role_by_name(db, RoleEnum.USER.value)
        if user_role is None:
            raise NotFoundException(detail="USER role not found")

        try:
            new_user = UserEntity(
                username=request.username,
                email=request.email,
                password_hash=hash_password(request.password),
                full_name=request.full_name,
                phone=request.phone,
                role_id=user_role.id,
                is_active=True,
            )
            saved_user = UserRepository.save_user(db, new_user)

            new_user_profile = UserProfileEntity(
                user_id=saved_user.id,
                university=request.university,
                course=request.course,
                address=request.address,
                profile_image_url=request.profile_image_url,
            )
            UserRepository.save_user_profile(db, new_user_profile)

            db.commit()

            return CurrentUserResponse(
                id=saved_user.id,
                username=saved_user.username,
                email=saved_user.email,
                full_name=saved_user.full_name,
                phone=saved_user.phone,
                role=user_role.name,
                is_active=saved_user.is_active,
            )

        except Exception:
            db.rollback()
            raise

    @staticmethod
    def register_writer(db: Session, request: RegisterWriterRequest) -> CurrentUserResponse:
        existing_user_by_email = UserRepository.get_user_by_email(db, request.email)
        if existing_user_by_email is not None:
            raise ValidationException(detail="Email already exists")

        existing_user_by_username = UserRepository.get_user_by_username(db, request.username)
        if existing_user_by_username is not None:
            raise ValidationException(detail="Username already exists")

        writer_role = RoleRepository.get_role_by_name(db, RoleEnum.WRITER.value)
        if writer_role is None:
            raise NotFoundException(detail="WRITER role not found")

        try:
            new_user = UserEntity(
                username=request.username,
                email=request.email,
                password_hash=hash_password(request.password),
                full_name=request.full_name,
                phone=request.phone,
                role_id=writer_role.id,
                is_active=True,
            )
            saved_user = UserRepository.save_user(db, new_user)

            new_writer_profile = WriterProfileEntity(
                user_id=saved_user.id,
                qualification=request.qualification,
                experience_years=request.experience_years,
                bio=request.bio,
                profile_image_url=request.profile_image_url,
                approval_status=WriterApprovalStatusEnum.PENDING_APPROVAL,
            )
            UserRepository.save_writer_profile(db, new_writer_profile)

            db.commit()

            return CurrentUserResponse(
                id=saved_user.id,
                username=saved_user.username,
                email=saved_user.email,
                full_name=saved_user.full_name,
                phone=saved_user.phone,
                role=writer_role.name,
                is_active=saved_user.is_active,
            )

        except Exception:
            db.rollback()
            raise

    @staticmethod
    def login(db: Session, request: LoginRequest) -> TokenResponse:
        existing_user = UserRepository.get_user_by_email(db, request.email)
        if existing_user is None:
            raise UnauthorizedException(detail="Invalid email or password")

        is_password_valid = verify_password(request.password, existing_user.password_hash)
        if not is_password_valid:
            raise UnauthorizedException(detail="Invalid email or password")

        if not existing_user.is_active:
            raise UnauthorizedException(detail="User account is inactive")

        role_name = existing_user.role.name if existing_user.role is not None else None
        if role_name is None:
            raise UnauthorizedException(detail="User role not found")

        access_token = create_access_token(
            {
                "sub": existing_user.email,
                "user_id": existing_user.id,
                "role": role_name,
            }
        )

        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
        )

    @staticmethod
    def get_current_user(db: Session, token: str) -> CurrentUserResponse:
        payload = decode_access_token(token)

        user_id = payload.get("user_id")
        if user_id is None:
            raise UnauthorizedException(detail="Invalid token payload")

        existing_user = UserRepository.get_user_by_id(db, int(user_id))
        if existing_user is None:
            raise UnauthorizedException(detail="User not found")

        role_name = existing_user.role.name if existing_user.role is not None else None
        if role_name is None:
            raise UnauthorizedException(detail="User role not found")

        return CurrentUserResponse(
            id=existing_user.id,
            username=existing_user.username,
            email=existing_user.email,
            full_name=existing_user.full_name,
            phone=existing_user.phone,
            role=role_name,
            is_active=existing_user.is_active,
        )