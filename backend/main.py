from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os

from app.config.database import init_db, db_dependency
from app.config.cors_config import setup_cors
from app.config.logging_config import logger
from app.controller.auth_controller import router as auth_router
from app.controller.academic_controller import router as academic_router
from app.controller.task_controller import router as task_router
from app.controller.writer_controller import router as writer_router
from app.controller.admin_controller import router as admin_router
from app.controller.notification_controller import router as notification_router
from app.controller.chat_controller import router as chat_router
from app.controller.user_controller import router as user_router
from app.exceptions.exception_handler import register_exception_handlers
from app.util.response_util import success_response

app = FastAPI(
    title="Assignment System Backend",
    version="1.0.0"
)

init_db()
setup_cors(app)
register_exception_handlers(app)

# Ensure uploads directory exists
if not os.path.exists("uploads"):
    os.makedirs("uploads")

# Mount static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth_router)
app.include_router(academic_router)
app.include_router(task_router)
app.include_router(writer_router)
app.include_router(admin_router)
app.include_router(notification_router)
app.include_router(chat_router)
app.include_router(user_router)


@app.get("/")
async def root():
    logger.info("Root endpoint accessed")
    return success_response(
        message="Assignment System Backend API running",
        results={
            "version": "1.0.0",
            "status": "online"
        }
    )


@app.get("/health")
async def health_check():
    logger.info("Health check endpoint accessed")
    return success_response(
        message="System healthy",
        results={
            "api": "healthy"
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
