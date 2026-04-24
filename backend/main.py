from fastapi import FastAPI

from app.config.database import init_db, db_dependency
from app.config.cors_config import setup_cors
from app.config.logging_config import logger
from app.controller.auth_controller import router as auth_router
from app.controller.field_controller import router as field_router
from app.exceptions.exception_handler import register_exception_handlers
from app.util.response_util import success_response

app = FastAPI(
    title="Assignment System Backend",
    version="1.0.0"
)

init_db()
setup_cors(app)
register_exception_handlers(app)
app.include_router(auth_router)
app.include_router(field_router, prefix="/api/v1")


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
