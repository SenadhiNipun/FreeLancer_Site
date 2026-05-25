"""
Super Admin Seed Script
-----------------------
Usage (run from inside the `backend/` directory):

    python scripts/create_super_admin.py \
        --email admin@projecthub.com \
        --password "StrongP@ss123" \
        --first_name "Super" \
        --last_name "Admin"

The script creates the user directly in the database — no email verification
required. The account is immediately ACTIVE.
"""
import sys
import os
import argparse

# Make sure the backend root is on the path so we can import `app.*`
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.config.database import SessionLocal, init_db
from app.entity.user_entity import UserEntity
from app.entity.role_entity import RoleEntity
from app.entity.user_role_entity import UserRoleEntity
from app.entity.task_entity import TaskEntity
from app.entity.review_entity import ReviewEntity
from app.util.password_util import hash_password
from app.enums.role_enum import RoleEnum


def create_super_admin(email: str, password: str, first_name: str, last_name: str):
    # Initialize the DB mapping by calling init_db
    init_db()
    
    db = SessionLocal()
    try:
        # 1. Ensure SUPER_ADMIN role exists
        role = db.query(RoleEntity).filter(
            RoleEntity.role_name == RoleEnum.SUPER_ADMIN.value
        ).first()

        if not role:
            role = RoleEntity(
                role_name=RoleEnum.SUPER_ADMIN.value,
                description="Super Administrator with full platform access"
            )
            db.add(role)
            db.flush()
            print(f"[+] Created SUPER_ADMIN role (id={role.id})")
        else:
            print(f"[*] SUPER_ADMIN role already exists (id={role.id})")

        # 2. Check if user already exists
        existing = db.query(UserEntity).filter(UserEntity.email == email).first()
        if existing:
            print(f"[!] User with email '{email}' already exists (id={existing.id}). Aborting.")
            return

        # 3. Create the super admin user
        new_user = UserEntity(
            first_name=first_name,
            last_name=last_name,
            email=email,
            username=email,
            password_hash=hash_password(password),
            role_id=role.id,
            status="ACTIVE",
            is_email_verified=True,
            is_mobile_verified=False,
        )
        db.add(new_user)
        db.flush()
        db.refresh(new_user)
        print(f"[+] Created user (id={new_user.id})")

        # 4. Assign role in bridge table too (for compatibility)
        user_role = UserRoleEntity(user_id=new_user.id, role_id=role.id)
        db.add(user_role)

        db.commit()
        print(f"\n✅ Super Admin created successfully!")
        print(f"   Email    : {email}")
        print(f"   Name     : {first_name} {last_name}")
        print(f"   Role     : SUPER_ADMIN")
        print(f"   Login at : /sign-in")

    except Exception as e:
        db.rollback()
        print(f"[X] Error: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Create a Super Admin user")
    parser.add_argument("--email", required=True, help="Admin email address")
    parser.add_argument("--password", required=True, help="Admin password")
    parser.add_argument("--first_name", default="Super", help="First name")
    parser.add_argument("--last_name", default="Admin", help="Last name")

    args = parser.parse_args()
    create_super_admin(
        email=args.email,
        password=args.password,
        first_name=args.first_name,
        last_name=args.last_name,
    )
