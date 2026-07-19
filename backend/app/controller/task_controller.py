from typing import List, Annotated, Optional
from fastapi import APIRouter, Depends, status, File, UploadFile, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.config.database import db_dependency
from app.service.task_service import TaskService
from app.service.auth_service import AuthService
from app.model.create_task_request import CreateTaskRequest
from app.model.generic_response import GenericResponse
from app.model.add_task_file_request import AddTaskFilesRequest
from app.model.review_model import CreateReviewRequest
from app.service.review_service import ReviewService

router = APIRouter(
    prefix="/api/v1/customer",
    tags=["Customer Tasks"]
)

security = HTTPBearer()

def get_current_user_id(db: Session, auth: HTTPAuthorizationCredentials):
    token = auth.credentials
    user = AuthService.get_current_user(db, token)
    return user.id

@router.post("/tasks", status_code=status.HTTP_201_CREATED)
def create_task(
    request: CreateTaskRequest, 
    db: db_dependency, 
    auth: HTTPAuthorizationCredentials = Depends(security)
):
    user_id = get_current_user_id(db, auth)
    result = TaskService.create_task(db, user_id, request)
    return GenericResponse.success(message="Task created successfully", results=result)

@router.get("/dashboard-stats")
def get_dashboard_stats(
    db: db_dependency, 
    auth: HTTPAuthorizationCredentials = Depends(security)
):
    user_id = get_current_user_id(db, auth)
    result = TaskService.get_customer_dashboard_stats(db, user_id)
    return GenericResponse.success(message="Dashboard stats fetched successfully", results=result)

@router.get("/tasks")
def get_my_tasks(
    db: db_dependency, 
    auth: HTTPAuthorizationCredentials = Depends(security)
):
    user_id = get_current_user_id(db, auth)
    results = TaskService.get_customer_tasks(db, user_id)
    return GenericResponse.success(message="Tasks fetched successfully", results=results)

@router.get("/tasks/{task_id}")
def get_task_details(
    task_id: int, 
    db: db_dependency, 
    auth: HTTPAuthorizationCredentials = Depends(security)
):
    # Optional: Verify task belongs to customer
    result = TaskService.get_task_details(db, task_id)
    return GenericResponse.success(message="Task details fetched successfully", results=result)

@router.get("/tasks/{task_id}/bids")
def get_task_bids(
    task_id: int,
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security)
):
    customer_id = get_current_user_id(db, auth)
    results = TaskService.get_bids_for_task(db, task_id, customer_id)
    return GenericResponse.success(message="Bids fetched successfully", results=results)

@router.post("/tasks/{task_id}/bids/{bid_id}/accept")
def accept_bid(
    task_id: int,
    bid_id: int,
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security)
):
    customer_id = get_current_user_id(db, auth)
    result = TaskService.accept_bid(db, task_id, bid_id, customer_id)
    return GenericResponse.success(message="Bid accepted successfully", results=result)

@router.post("/tasks/{task_id}/request-revision")
async def request_revision(
    task_id: int,
    db: db_dependency,
    auth: Annotated[HTTPAuthorizationCredentials, Depends(security)],
    revision_note: Annotated[str, Form(...)],
    files: Annotated[Optional[List[UploadFile]], File()] = None,
):
    customer_id = get_current_user_id(db, auth)
    result = await TaskService.request_revision(db, task_id, customer_id, revision_note, files or [])
    return GenericResponse.success(message="Revision requested successfully", results=result)

@router.post("/tasks/{task_id}/approve")
def approve_task(
    task_id: int,
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security)
):
    customer_id = get_current_user_id(db, auth)
    result = TaskService.approve_task(db, task_id, customer_id)
    return GenericResponse.success(message="Task approved and payment released successfully", results=result)

@router.post("/tasks/{task_id}/files")
async def add_task_files(
    task_id: int,
    db: db_dependency,
    files: Annotated[List[UploadFile], File(...)],
    auth: Annotated[HTTPAuthorizationCredentials, Depends(security)],
    file_type: str = "REQUIREMENT_FILE"
):
    user_id = get_current_user_id(db, auth)
    result = await TaskService.save_task_files_locally(db, task_id, user_id, files, file_type)
    return GenericResponse.success(message="Files uploaded successfully", results=result)

@router.post("/tasks/{task_id}/reviews")
def submit_review(
    task_id: int,
    request: CreateReviewRequest,
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security)
):
    customer_id = get_current_user_id(db, auth)
    result = ReviewService.submit_review(db, task_id, customer_id, request)
    return GenericResponse.success(message="Review submitted successfully", results=result)
