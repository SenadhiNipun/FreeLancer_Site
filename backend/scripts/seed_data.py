import sys
import os

# Add the parent directory to the path so we can import app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.config.database import SessionLocal, init_db
from app.entity.role_entity import RoleEntity
from app.entity.education_level_entity import EducationLevelEntity
from app.entity.academic_category_entity import AcademicCategoryEntity
from app.entity.specialization_entity import SpecializationEntity
from app.enums.role_enum import RoleEnum

def seed_data():
    db = SessionLocal()
    try:
        print("Cleaning up old tables...")
        from app.config.database import Base, engine
        from sqlalchemy import text
        with engine.connect() as connection:
            connection.execute(text("SET FOREIGN_KEY_CHECKS = 0;"))
            Base.metadata.drop_all(bind=engine)
            connection.execute(text("SET FOREIGN_KEY_CHECKS = 1;"))
            connection.commit()

        print("Initializing database tables...")
        init_db()

        # 1. Seed Roles
        print("Seeding roles...")
        roles = [
            RoleEnum.SUPER_ADMIN.value,
            RoleEnum.ADMIN.value,
            RoleEnum.CUSTOMER.value,
            RoleEnum.WRITER.value
        ]
        for role_name in roles:
            existing = db.query(RoleEntity).filter(RoleEntity.role_name == role_name).first()
            if not existing:
                db.add(RoleEntity(role_name=role_name))
        db.commit()

        # 2. Seed Education Levels
        print("Seeding education levels...")
        edu_levels = [
            {"name": "High School", "order": 1},
            {"name": "Undergraduate", "order": 2},
            {"name": "Master's Degree", "order": 3},
            {"name": "Doctorate (PhD)", "order": 4},
            {"name": "Professional Certificate", "order": 5}
        ]
        for edu in edu_levels:
            existing = db.query(EducationLevelEntity).filter(EducationLevelEntity.name == edu["name"]).first()
            if not existing:
                db.add(EducationLevelEntity(name=edu["name"], display_order=edu["order"]))
        db.commit()

        # 3. Seed Academic Categories & Specializations
        print("Seeding categories and specializations...")
        categories = {
            "Information Technology": ["Software Engineering", "Data Science", "Cyber Security", "Networking"],
            "Business & Management": ["Finance", "Marketing", "Human Resources", "Accounting"],
            "Engineering": ["Civil Engineering", "Mechanical Engineering", "Electrical Engineering"],
            "Health & Medicine": ["Nursing", "Pharmacy", "Public Health"],
            "Social Sciences": ["Psychology", "Sociology", "Political Science"],
            "Arts & Humanities": ["History", "Literature", "Philosophy"]
        }

        for cat_name, specializations in categories.items():
            cat = db.query(AcademicCategoryEntity).filter(AcademicCategoryEntity.name == cat_name).first()
            if not cat:
                cat = AcademicCategoryEntity(name=cat_name)
                db.add(cat)
                db.flush()
            
            for spec_name in specializations:
                existing_spec = db.query(SpecializationEntity).filter(
                    SpecializationEntity.name == spec_name,
                    SpecializationEntity.academic_category_id == cat.id
                ).first()
                if not existing_spec:
                    db.add(SpecializationEntity(name=spec_name, academic_category_id=cat.id))
        
        db.commit()
        print("Seeding completed successfully!")

    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
