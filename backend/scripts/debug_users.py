from app.config.database import SessionLocal, Base
from app.entity.user_entity import UserEntity
from app.entity.role_entity import RoleEntity
from app.entity.user_role_entity import UserRoleEntity
from app.entity.user_profile_entity import UserProfileEntity
from app.entity.writer_profile_entity import WriterProfileEntity
from app.entity.writer_qualification_entity import WriterQualificationEntity
from app.entity.field_entity import FieldEntity
from app.entity.writer_field_entity import WriterFieldEntity

def list_all():
    db = SessionLocal()
    try:
        users = db.query(UserEntity).all()
        print(f"--- Users ({len(users)}) ---")
        for u in users:
            roles = [ur.role.name for ur in u.user_roles]
            print(f"ID: {u.id}, Email: '{u.email}', Roles: {roles}, Verified: {u.is_verified}, Code: {u.verification_code}")
        
        writers = db.query(WriterProfileEntity).all()
        print(f"\n--- Writer Profiles ({len(writers)}) ---")
        for w in writers:
            print(f"Writer ID: {w.user_id}, Name: {w.full_name}, Status: {w.approval_status}")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    list_all()
