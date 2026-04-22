from backend.app.config.database import SessionLocal, Base
from backend.app.entity.user_entity import UserEntity
from backend.app.entity.role_entity import RoleEntity
from backend.app.entity.user_role_entity import UserRoleEntity
from backend.app.entity.user_profile_entity import UserProfileEntity
from backend.app.entity.writer_profile_entity import WriterProfileEntity
from backend.app.entity.writer_qualification_entity import WriterQualificationEntity
from backend.app.entity.field_entity import FieldEntity
from backend.app.entity.writer_field_entity import WriterFieldEntity

def list_users():
    db = SessionLocal()
    try:
        users = db.query(UserEntity).all()
        print(f"Total users: {len(users)}")
        for u in users:
            print(f"ID: {u.id}, Email: '{u.email}', Verified: {u.is_verified}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    list_users()
