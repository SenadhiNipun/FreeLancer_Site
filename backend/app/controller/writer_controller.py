from typing import List, Annotated
from fastapi import APIRouter, Depends, status, File, UploadFile
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.config.database import db_dependency
from app.service.task_service import TaskService
from app.service.auth_service import AuthService
from app.model.submit_task_request import SubmitTaskRequest
from app.model.bid_request import BidRequest
from app.model.generic_response import GenericResponse

router = APIRouter(
    prefix="/api/v1/writer",
    tags=["Writer Tasks"]
)

security = HTTPBearer()


def get_current_user_id(db: Session, auth: HTTPAuthorizationCredentials):
    token = auth.credentials
    user = AuthService.get_current_user(db, token)
    return user.id


# ── Open tasks matching the writer's field (notification feed) ──
@router.get("/tasks/open")
def get_open_tasks(
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security),
):
    writer_id = get_current_user_id(db, auth)
    results = TaskService.get_open_tasks_for_writer(db, writer_id)
    return GenericResponse.success(
        message="Open tasks fetched successfully", results=results
    )


# ── Assigned tasks (writer accepted / in-progress) ─────────────
@router.get("/tasks")
def get_assigned_tasks(
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security),
):
    writer_id = get_current_user_id(db, auth)
    results = TaskService.get_writer_tasks(db, writer_id)
    return GenericResponse.success(message="Assigned tasks fetched successfully", results=results)


# ── View task details ──────────────────────────────────────────
@router.get("/tasks/{task_id}")
def get_task_details(
    task_id: int,
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security),
):
    writer_id = get_current_user_id(db, auth)
    result = TaskService.get_task_details(db, task_id, writer_id=writer_id)
    # Optional: check if writer has permission (is assigned or has an accepted bid)
    return GenericResponse.success(message="Task details fetched successfully", results=result)


# ── Place a bid on an open task ────────────────────────────────
@router.post("/tasks/{task_id}/bids", status_code=status.HTTP_201_CREATED)
def place_bid(
    task_id: int,
    request: BidRequest,
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security),
):
    writer_id = get_current_user_id(db, auth)
    result = TaskService.place_bid(db, task_id, writer_id, request)
    return GenericResponse.success(message="Bid placed successfully", results=result)


# ── View own bids ──────────────────────────────────────────────
@router.get("/bids")
def get_my_bids(
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security),
):
    writer_id = get_current_user_id(db, auth)
    results = TaskService.get_writer_bids(db, writer_id)
    return GenericResponse.success(message="Your bids fetched successfully", results=results)


# ── Withdraw a bid ─────────────────────────────────────────────
@router.delete("/bids/{bid_id}")
def withdraw_bid(
    bid_id: int,
    db: db_dependency,
    auth: HTTPAuthorizationCredentials = Depends(security),
):
    writer_id = get_current_user_id(db, auth)
    result = TaskService.withdraw_bid(db, bid_id, writer_id)
    return GenericResponse.success(message=result["message"], results=None)


# ── Submit completed work ──────────────────────────────────────
@router.post("/tasks/{task_id}/submit")
def submit_task(
    task_id: int,
    db: db_dependency,
    request: SubmitTaskRequest,
    auth: HTTPAuthorizationCredentials = Depends(security),
):
    writer_id = get_current_user_id(db, auth)
    result = TaskService.submit_task(db, task_id, writer_id, request)
    return GenericResponse.success(message="Task submitted successfully", results=result)


# ── Upload submission files ────────────────────────────────────
@router.post("/tasks/{task_id}/files")
async def upload_task_files(
    task_id: int,
    db: db_dependency,
    files: Annotated[List[UploadFile], File(...)],
    auth: Annotated[HTTPAuthorizationCredentials, Depends(security)]
):
    writer_id = get_current_user_id(db, auth)
    result = await TaskService.save_task_files_locally(db, task_id, writer_id, files, file_type="SUBMISSION_FILE")
    return GenericResponse.success(message="Files uploaded successfully", results=result)
