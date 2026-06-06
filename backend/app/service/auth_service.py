from sqlalchemy.orm import Session
import uuid
from typing import List

from app.entity.user_entity import UserEntity
from app.entity.user_role_entity import UserRoleEntity
from app.entity.user_profile_entity import UserProfileEntity
from app.entity.writer_profile_entity import WriterProfileEntity
from app.entity.writer_qualification_entity import WriterQualificationEntity
from app.entity.writer_field_entity import WriterFieldEntity
from datetime import datetime, timedelta
import random
import string
from app.enums.role_enum import RoleEnum
from app.enums.writer_approval_status_enum import WriterApprovalStatusEnum
from app.model.verify_email_request import VerifyEmailRequest
from app.util.email_util import EmailUtil
from app.enums.writer_approval_status_enum import WriterApprovalStatusEnum
from app.exceptions.exception import (
    NotFoundException,
    UnauthorizedException,
    ValidationException,
)
from app.model.current_user_response import CurrentUserResponse
from app.model.forgot_password_request import ForgotPasswordRequest
from app.model.login_request import LoginRequest
from app.model.register_user_request import RegisterUserRequest
from app.model.register_writer_request import RegisterWriterRequest
from app.model.reset_password_request import ResetPasswordRequest
from app.model.token_response import TokenResponse
from app.repository.role_repository import RoleRepository
from app.repository.user_repository import UserRepository
from app.util.jwt_util import create_access_token, decode_access_token, create_refresh_token, decode_refresh_token
from app.util.password_util import hash_password, verify_password
from app.config.logging_config import get_logger

logger = get_logger(__name__)


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

        customer_role = RoleRepository.get_role_by_name(db, RoleEnum.CUSTOMER.value)
        if customer_role is None:
            raise NotFoundException(detail="CUSTOMER role not found")

        try:
            # 1. Create Core User
            verification_code = ''.join(random.choices(string.digits, k=6))
            expiry_time = datetime.now() + timedelta(minutes=15)

            new_user = UserEntity(
                first_name=request.first_name,
                last_name=request.last_name,
                email=request.email,
                username=request.email, # Use email as default username
                password_hash=hash_password(request.password),
                mobile_number=request.mobile_number,
                whatsapp_number=request.whatsapp_number,
                role_id=customer_role.id,
                status="PENDING",
                is_email_verified=False,
                verification_code=verification_code,
                verification_code_expires_at=expiry_time
            )
            saved_user = UserRepository.save_user(db, new_user)

            # 2. Assign Role (using bridge table too for compatibility)
            user_role_link = UserRoleEntity(user_id=saved_user.id, role_id=customer_role.id)
            UserRepository.save_user_role(db, user_role_link)

            db.commit()

            # 3. Send Verification Email
            EmailUtil.send_verification_email(request.email, verification_code)

            return AuthService._build_user_response(saved_user, [customer_role.role_name])

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
                first_name=request.first_name,
                last_name=request.last_name,
                email=request.email,
                username=request.email, # Use email as default username
                password_hash=hash_password(request.password),
                mobile_number=request.mobile_number,
                whatsapp_number=request.whatsapp_number,
                role_id=writer_role.id,
                status="PENDING",
                is_email_verified=False,
                verification_code=verification_code,
                verification_code_expires_at=expiry_time
            )
            saved_user = UserRepository.save_user(db, new_user)

            # 2. Assign Role
            user_role_link = UserRoleEntity(user_id=saved_user.id, role_id=writer_role.id)
            UserRepository.save_user_role(db, user_role_link)

            # 3. Create Writer Profile
            new_writer_profile = WriterProfileEntity(
                user_id=saved_user.id,
                education_level_id=request.education_level_id,
                institution_name=request.institution_name,
                academic_status=request.academic_status,
                academic_category_id=request.academic_category_id,
                specialization_id=request.specialization_id,
                city=request.city,
                country=request.country,
                bio=request.bio,
                experience_years=request.experience_years,
                profile_status="INCOMPLETE"
            )
            UserRepository.save_writer_profile(db, new_writer_profile)
            
            db.commit()

            # 4. Send Verification Email
            EmailUtil.send_verification_email(request.email, verification_code)

            return AuthService._build_user_response(saved_user, [writer_role.role_name])

        except Exception:
            db.rollback()
            raise

    @staticmethod
    def verify_email(db: Session, request: VerifyEmailRequest) -> bool:
        user = UserRepository.get_user_by_email(db, request.email)
        if not user:
            raise NotFoundException(detail="User not found")

        if user.is_email_verified:
            return True

        if not user.verification_code or user.verification_code != request.verification_code:
            raise ValidationException(detail="Invalid verification code")

        if user.verification_code_expires_at < datetime.now():
            raise ValidationException(detail="Verification code has expired")

        try:
            user.is_email_verified = True
            user.status = "ACTIVE"
            user.verification_code = None
            user.verification_code_expires_at = None

            if user.writer_profile and user.writer_profile.profile_status == "INCOMPLETE":
                user.writer_profile.profile_status = "PENDING_APPROVAL"
                db.commit()
                from app.service.notification_service import NotificationService
                writer_name = f"{user.first_name} {user.last_name}".strip() or user.email
                NotificationService.notify_admins_new_writer(db, user.id, writer_name)
            else:
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

        if user.status == "SUSPENDED":
            raise UnauthorizedException(detail="User account is suspended")

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

        if user.reset_password_code or user.reset_password_code != request.reset_code:
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

        if existing_user.status == "SUSPENDED":
            raise UnauthorizedException(detail="User account is suspended")

        if not existing_user.is_email_verified:
            raise UnauthorizedException(detail="Email not verified. Please verify your email first.")

        if (
            existing_user.writer_profile is not None
            and existing_user.writer_profile.profile_status not in ("APPROVED",)
        ):
            status = existing_user.writer_profile.profile_status
            if status == "PENDING_APPROVAL":
                raise UnauthorizedException(detail="Your writer application is pending approval. Please wait for an admin to review it.")
            elif status == "REJECTED":
                raise UnauthorizedException(detail="Your writer application was rejected. Please contact support.")
            else:
                raise UnauthorizedException(detail="Your writer profile is not yet approved.")

        if existing_user.is_delete:
            raise UnauthorizedException(detail="User account has been deleted")

        # Get user roles
        roles = []
        if existing_user.role:
            roles.append(existing_user.role.role_name)
        
        # Also check bridge table
        roles.extend([ur.role.role_name for ur in existing_user.user_roles if ur.role.role_name not in roles])
        
        logger.info(f"Login roles for {existing_user.email}: {roles}")
        
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

        refresh_token = create_refresh_token(
            {
                "sub": existing_user.email,
                "user_id": existing_user.id,
                "uuid": existing_user.uuid,
            }
        )

        existing_user.last_login_at = datetime.now()
        db.commit()

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            roles=roles,
            user_id=existing_user.id,
            email=existing_user.email
        )

    @staticmethod
    def refresh_token(db: Session, refresh_token: str) -> TokenResponse:
        payload = decode_refresh_token(refresh_token)
        user_id = payload.get("user_id")
        if user_id is None:
            raise UnauthorizedException(detail="Invalid refresh token payload")

        existing_user = UserRepository.get_user_by_id(db, int(user_id))
        if existing_user is None or existing_user.is_delete:
            raise UnauthorizedException(detail="User not found")

        if existing_user.status == "SUSPENDED":
            raise UnauthorizedException(detail="User account is suspended")

        roles = []
        if existing_user.role:
            roles.append(existing_user.role.role_name)
        roles.extend([ur.role.role_name for ur in existing_user.user_roles if ur.role.role_name not in roles])

        new_access_token = create_access_token(
            {
                "sub": existing_user.email,
                "user_id": existing_user.id,
                "uuid": existing_user.uuid,
                "roles": roles,
            }
        )

        new_refresh_token = create_refresh_token(
            {
                "sub": existing_user.email,
                "user_id": existing_user.id,
                "uuid": existing_user.uuid,
            }
        )

        return TokenResponse(
            access_token=new_access_token,
            refresh_token=new_refresh_token,
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
        if existing_user is None or existing_user.is_delete:
            raise UnauthorizedException(detail="User not found")

        roles = []
        if existing_user.role:
            roles.append(existing_user.role.role_name)
        roles.extend([ur.role.role_name for ur in existing_user.user_roles if ur.role.role_name not in roles])

        return AuthService._build_user_response(existing_user, roles)

    @staticmethod
    def _build_user_response(user: UserEntity, roles: List[str]) -> CurrentUserResponse:
        full_name = f"{user.first_name} {user.last_name}" if user.first_name else user.email
        profile_image_url = None
        
        if user.user_profile:
            profile_image_url = user.user_profile.profile_image_url

        return CurrentUserResponse(
            id=user.id,
            uuid=user.uuid,
            username=user.username,
            email=user.email,
            full_name=full_name,
            role=roles,
            is_active=(user.status == "ACTIVE"),
            is_verified=user.is_email_verified,
            profile_image_url=profile_image_url
        )
