from fastapi import APIRouter, Depends
from backend.app.config.database import db_dependency
from backend.app.model.generic_response import GenericResponse
from backend.app.repository.field_repository import FieldRepository

router = APIRouter(
    prefix="/fields",
    tags=["Fields"]
)

@router.get("/categories")
def get_categories(db: db_dependency):
    categories = FieldRepository.get_main_categories(db)
    results = [
        {"id": c.id, "name": c.name, "description": c.description} 
        for c in categories
    ]
    return GenericResponse.success(message="Categories retrieved successfully", results=results)

@router.get("/specializations/{category_id}")
def get_specializations(category_id: int, db: db_dependency):
    specializations = FieldRepository.get_specializations_by_category(db, category_id)
    results = [
        {"id": s.id, "name": s.name, "description": s.description} 
        for s in specializations
    ]
    return GenericResponse.success(message="Specializations retrieved successfully", results=results)
