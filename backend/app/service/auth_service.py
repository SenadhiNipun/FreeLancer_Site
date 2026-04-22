from sqlalchemy.orm import Session
import uuid
from typing import List

from backend.app.entity.user_entity import UserEntity
from backend.app.entity.user_role_entity import UserRoleEntity
from backend.app.entity.user_profile_entity import UserProfileEntity
from backend.app.entity.writer_profile_entity import WriterProfileEntity
from backend.app.entity.writer_qualification_entity import WriterQualificationEntity
from backend.app.entity.writer_field_entity import WriterFieldEntity
from datetime import datetime, timedelta
import random
import string
from backend.app.enums.role_enum import RoleEnum
from backend.app.enums.writer_approval_status_enum import WriterApprovalStatusEnum
from backend.app.model.verify_email_request import VerifyEmailRequest
from backend.app.util.email_util import EmailUtil
from backend.app.enums.writer_approval_status_enum import WriterApprovalStatusEnum
from backend.app.exceptions.exception import (
    NotFoundException,
    UnauthorizedException,
    ValidationException,
)
from backend.app.model.current_user_response import CurrentUserResponse
from backend.app.model.forgot_password_request import ForgotPasswordRequest
from backend.app.model.login_request import LoginRequest
from backend.app.model.register_user_request import RegisterUserRequest
from backend.app.model.register_writer_request import RegisterWriterRequest
from backend.app.model.reset_password_request import ResetPasswordRequest
from backend.app.model.token_response import TokenResponse
from backend.app.repository.role_repository import RoleRepository
from backend.app.repository.user_repository import UserRepository
from backend.app.util.jwt_util import create_access_token, decode_access_token
from backend.app.util.password_util import hash_password, verify_password


class AuthService:

    @staticmethod
    def register_user(db: Session, request: RegisterUserRequest) -> CurrentUserResponse:
        # Check if email exists
        existing_user = UserRepository.get_user_by_email(db, request.email)
        if existing_user:
            if existing_user.is_verified:
                raise ValidationException(detail="Email already exists and is verified")
            else:
                # If user exists but not verified, delete them to allow fresh registration
                db.delete(existing_user)
                db.flush()

        user_role = RoleRepository.get_role_by_name(db, RoleEnum.USER.value)
        if user_role is None:
            raise NotFoundException(detail="USER role not found")

        try:
            # 1. Create Core User
            verification_code = ''.join(random.choices(string.digits, k=6))
            expiry_time = datetime.now() + timedelta(minutes=15)

            new_user = UserEntity(
                uuid=str(uuid.uuid4()),
                username=request.email, # Use email as default username
                email=request.email,
                password_hash=hash_password(request.password),
                is_active=True,
                is_verified=False,
                verification_code=verification_code,
                verification_code_expires_at=expiry_time
            )
            saved_user = UserRepository.save_user(db, new_user)

            # 2. Assign Role
            user_role_link = UserRoleEntity(user_id=saved_user.id, role_id=user_role.id)
            UserRepository.save_user_role(db, user_role_link)

            # 3. Create Profile
            full_name = f"{request.first_name} {request.last_name}"
            new_user_profile = UserProfileEntity(
                user_id=saved_user.id,
                full_name=full_name,
                phone_number=request.phone_number
            )
            UserRepository.save_user_profile(db, new_user_profile)

            db.commit()

            # 4. Send Verification Email
            EmailUtil.send_verification_email(request.email, verification_code)

            return AuthService._build_user_response(saved_user, [user_role.name])

        except Exception:
            db.rollback()
            raise

    @staticmethod
    def register_writer(db: Session, request: RegisterWriterRequest) -> CurrentUserResponse:
        # Check unique constraint
        existing_user = UserRepository.get_user_by_email(db, request.email)
        if existing_user:
            if existing_user.is_verified:
                raise ValidationException(detail="Email already exists and is verified")
            else:
                # If user exists but not verified, delete them to allow fresh registration
                db.delete(existing_user)
                db.flush()

        writer_role = RoleRepository.get_role_by_name(db, RoleEnum.WRITER.value)
        if writer_role is None:
            raise NotFoundException(detail="WRITER role not found")

        try:
            # 0. Generate Verification Code
            verification_code = str(random.randint(100000, 999999))
            expiry_time = datetime.now() + timedelta(minutes=15)

            # 1. Create Core User
            new_user = UserEntity(
                uuid=str(uuid.uuid4()),
                username=request.email, # Use email as default username
                email=request.email,
                password_hash=hash_password(request.password),
                is_active=True,
                is_verified=False,
                verification_code=verification_code,
                verification_code_expires_at=expiry_time
            )
            saved_user = UserRepository.save_user(db, new_user)

            # 2. Assign Role
            user_role_link = UserRoleEntity(user_id=saved_user.id, role_id=writer_role.id)
            UserRepository.save_user_role(db, user_role_link)

            # 3. Create Writer Profile
            full_name = f"{request.first_name} {request.last_name}"
            new_writer_profile = WriterProfileEntity(
                user_id=saved_user.id,
                full_name=full_name,
                phone_number=request.phone_number,
                whatsapp_number=request.whatsapp_number,
                city=request.city,
                country=request.country,
                institution_name=request.institution_name,
                education_level=request.education_level,
                academic_status=request.academic_status,
                graduation_year=request.graduation_year,
                national_id_number=request.national_id_number,
                experience_years=request.experience_years,
                bio=request.bio,
                approval_status=WriterApprovalStatusEnum.PENDING_APPROVAL,
            )
            saved_writer_profile = UserRepository.save_writer_profile(db, new_writer_profile)
            
            # 4. Assign Expertise (Specialization)
            writer_fields = [
                WriterFieldEntity(writer_user_id=saved_user.id, field_id=request.specialization_id)
            ]
            UserRepository.save_writer_fields(db, writer_fields)

            db.commit()

            # 5. Send Verification Email
            EmailUtil.send_verification_email(request.email, verification_code)

            return AuthService._build_user_response(saved_user, [writer_role.name])

        except Exception:
            db.rollback()
            raise

    @staticmethod
    def verify_email(db: Session, request: VerifyEmailRequest) -> bool:
        user = UserRepository.get_user_by_email(db, request.email)
        if not user:
            raise NotFoundException(detail="User not found")

        if user.is_verified:
            return True

        if not user.verification_code or user.verification_code != request.verification_code:
            raise ValidationException(detail="Invalid verification code")

        if user.verification_code_expires_at < datetime.now():
            raise ValidationException(detail="Verification code has expired")

        try:
            user.is_verified = True
            user.verification_code = None
            user.verification_code_expires_at = None
            db.commit()
            return True
        except Exception:
            db.rollback()
            raise

    @staticmethod
    def forgot_password(db: Session, request: ForgotPasswordRequest) -> bool:
        user = UserRepository.get_user_by_email(db, request.email)
        if not user:
            raise NotFoundException(detail="Email not found")

        if not user.is_active:
            raise UnauthorizedException(detail="User account is inactive")

        try:
            reset_code = ''.join(random.choices(string.digits, k=6))
            expiry_time = datetime.now() + timedelta(minutes=15)

            user.reset_password_code = reset_code
            user.reset_password_expires_at = expiry_time
            db.commit()

            EmailUtil.send_password_reset_email(user.email, reset_code)
            return True
        except Exception:
            db.rollback()
            raise

    @staticmethod
    def reset_password(db: Session, request: ResetPasswordRequest) -> bool:
        user = UserRepository.get_user_by_email(db, request.email)
        if not user:
            raise NotFoundException(detail="User not found")

        if not user.reset_password_code or user.reset_password_code != request.reset_code:
            raise ValidationException(detail="Invalid reset code")

        if user.reset_password_expires_at < datetime.now():
            raise ValidationException(detail="Reset code has expired")

        try:
            user.password_hash = hash_password(request.new_password)
            user.reset_password_code = None
            user.reset_password_expires_at = None
            db.commit()
            return True
        except Exception:
            db.rollback()
            raise

    @staticmethod
    def login(db: Session, request: LoginRequest) -> TokenResponse:
        existing_user = UserRepository.get_user_by_email(db, request.email)
        if existing_user is None or not verify_password(request.password, existing_user.password_hash):
            raise UnauthorizedException(detail="Invalid email or password")

        if not existing_user.is_active:
            raise UnauthorizedException(detail="User account is inactive")

        if not existing_user.is_verified:
            raise UnauthorizedException(detail="Email not verified. Please verify your email first.")

        # Get user roles
        roles = [ur.role.name for ur in existing_user.user_roles]
        print(f"DEBUG: Login roles for {existing_user.email}: {roles}")
        
        if not roles:
            raise UnauthorizedException(detail="User has no assigned roles")

        access_token = create_access_token(
            {
                "sub": existing_user.email,
                "user_id": existing_user.id,
                "uuid": existing_user.uuid,
                "roles": roles,
            }
        )

        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            roles=roles,
            user_id=existing_user.id,
            email=existing_user.email
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

        roles = [ur.role.name for ur in existing_user.user_roles]
        return AuthService._build_user_response(existing_user, roles)

    @staticmethod
    def _validate_unique_user(db: Session, email: str, username: str):
        if UserRepository.get_user_by_email(db, email):
            raise ValidationException(detail="Email already exists")
        if UserRepository.get_user_by_username(db, username):
            raise ValidationException(detail="Username already exists")

    @staticmethod
    def _build_user_response(user: UserEntity, roles: List[str]) -> CurrentUserResponse:
        full_name = None
        profile_image_url = None
        
        if user.user_profile:
            full_name = user.user_profile.full_name
            profile_image_url = user.user_profile.profile_image_url
        elif user.writer_profile:
            full_name = user.writer_profile.full_name
            profile_image_url = user.writer_profile.profile_image_url

        return CurrentUserResponse(
            id=user.id,
            uuid=user.uuid,
            username=user.username,
            email=user.email,
            full_name=full_name,
            role=roles,
            is_active=user.is_active,
            is_verified=user.is_verified,
            profile_image_url=profile_image_url
        )