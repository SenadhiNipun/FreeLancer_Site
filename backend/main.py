from fastapi import FastAPI
from app.config.cors_config import setup_cors
from app.util.response_util import success_response, error_response
from app.config.logging_config import logger

app = FastAPI(title="Medicare Backend")

# Setup CORS
setup_cors(app)

@app.get("/")
async def root():
    logger.info("Root endpoint accessed")
    return success_response(
        message="Welcome to Medicare Backend API",
        results={"version": "1.0.0", "status": "online"}
    )

@app.get("/health")
async def health_check():
    # Example of success response
    return success_response(results={"database": "connected", "api": "healthy"})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
