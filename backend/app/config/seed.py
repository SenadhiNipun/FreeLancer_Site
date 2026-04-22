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
        
        # 2. Seed default Fields (Categories & Specializations)
        existing_fields = db.query(FieldEntity).all()
        if not existing_fields:
            print("Seeding default fields (Categories & Specializations)...")
            
            # --- Main Categories ---
            categories = {
                "Engineering": "Engineering fields",
                "Computing / IT": "CS and IT fields",
                "Business / Management": "Business administration and management",
                "Medical / Health Sciences": "Healthcare and biology",
                "Law": "Legal studies",
                "Science": "Pure and applied sciences",
                "Arts / Humanities": "Social sciences and arts",
                "Education": "Teaching and learning",
                "Other": "Miscellaneous fields"
            }
            
            cat_entities = {}
            for name, desc in categories.items():
                cat = FieldEntity(name=name, description=desc, parent_id=None)
                db.add(cat)
                db.flush() # To get IDs
                cat_entities[name] = cat.id

            # --- Specializations ---
            specializations = {
                "Engineering": [
                    "Civil Engineering", "Software Engineering", "Mechanical Engineering", 
                    "Chemical Engineering", "Electrical Engineering", "Electronic Engineering",
                    "Industrial Engineering", "Biomedical Engineering", "Environmental Engineering",
                    "Other Engineering"
                ],
                "Computing / IT": [
                    "Computer Science", "Information Technology", "Cyber Security", 
                    "Data Science", "Artificial Intelligence / Machine Learning", 
                    "Software Development", "Networking", "Information Systems"
                ]
            }

            for cat_name, specs in specializations.items():
                parent_id = cat_entities.get(cat_name)
                for spec_name in specs:
                    spec = FieldEntity(name=spec_name, description=f"{spec_name} specialization", parent_id=parent_id)
                    db.add(spec)

            db.commit()
            print("Categories and Specializations seeded successfully.")

    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
