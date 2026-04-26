from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.config.database import db_dependency
from app.service.academic_service import AcademicService
from app.model.generic_response import GenericResponse

router = APIRouter(
    prefix="/api/v1",
    tags=["Academic Metadata"]
)

@router.get("/education-levels")
def get_education_levels(db: db_dependency):
    results = AcademicService.get_education_levels(db)
    return GenericResponse.success(message="Education levels fetched successfully", results=results)

@router.get("/academic-categories")
def get_academic_categories(db: db_dependency):
    results = AcademicService.get_academic_categories(db)
    return GenericResponse.success(message="Academic categories fetched successfully", results=results)

@router.get("/academic-categories/{category_id}/specializations")
def get_specializations(category_id: int, db: db_dependency):
    results = AcademicService.get_specializations(db, category_id)
    return GenericResponse.success(message="Specializations fetched successfully", results=results)
