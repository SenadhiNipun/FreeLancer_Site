from sqlalchemy.orm import Session
from typing import List
from backend.app.entity.field_entity import FieldEntity

class FieldRepository:
    @staticmethod
    def get_main_categories(db: Session) -> List[FieldEntity]:
        return db.query(FieldEntity).filter(FieldEntity.parent_id == None, FieldEntity.is_active == True).all()

    @staticmethod
    def get_specializations_by_category(db: Session, category_id: int) -> List[FieldEntity]:
        return db.query(FieldEntity).filter(FieldEntity.parent_id == category_id, FieldEntity.is_active == True).all()

    @staticmethod
    def get_field_by_id(db: Session, field_id: int) -> FieldEntity | None:
        return db.query(FieldEntity).filter(FieldEntity.id == field_id).first()
