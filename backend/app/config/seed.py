from sqlalchemy.orm import Session
from backend.app.config.database import SessionLocal, engine
from backend.app.entity.role_entity import RoleEntity
from backend.app.entity.field_entity import FieldEntity
from backend.app.enums.role_enum import RoleEnum

def seed_data():
    db = SessionLocal()
    try:
        # 1. Seed Roles
        existing_roles = db.query(RoleEntity).all()
        if not existing_roles:
            print("Seeding default roles...")
            roles = [
                RoleEntity(name=RoleEnum.SUPER_ADMIN.value, description="Super Administrator"),
                RoleEntity(name=RoleEnum.ADMIN.value, description="Operational Administrator"),
                RoleEntity(name=RoleEnum.USER.value, description="Standard User (Student/Customer)"),
                RoleEntity(name=RoleEnum.WRITER.value, description="Academic Writer")
            ]
            db.add_all(roles)
            db.commit()
            print(f"Added {len(roles)} roles.")
        
        # 2. Seed default Fields (Categories)
        existing_fields = db.query(FieldEntity).all()
        if not existing_fields:
            print("Seeding default fields...")
            fields = [
                FieldEntity(name="Mathematics", description="All math related tasks"),
                FieldEntity(name="Computer Science", description="Programming and CS theory"),
                FieldEntity(name="Engineering", description="Civil, Mechanical, Electrical, etc."),
                FieldEntity(name="Business", description="Economics, Management, Accounting"),
                FieldEntity(name="Literature", description="Language and literature")
            ]
            db.add_all(fields)
            db.commit()
            print(f"Added {len(fields)} fields.")

    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
