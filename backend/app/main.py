import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Database & Model registry
from app.core.database import engine, Base

# Developer 1: Models & Routers
from app.modules_dev1.auth.models import User
from app.modules_dev1.learner_model.models import UserMastery, MisconceptionLog
from app.modules_dev1.auth.router import router as auth_router
from app.modules_dev1.scheduler.router import router as scheduler_router
from app.modules_dev1.assessment.router import router as assessment_router
from app.modules_dev1.planner.router import router as planner_router
from app.modules_dev1.progress.router import router as progress_router

# Create database tables for registered SQLAlchemy models
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Synapse Academic Studio API",
    version="1.0.0",
    description="Deterministic Intelligence & Learner State Engine"
)

# Shared CORS Middleware (permits frontend on port 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Developer 1 Endpoints
app.include_router(auth_router)
app.include_router(scheduler_router)
app.include_router(assessment_router)
app.include_router(planner_router)
app.include_router(progress_router)

# Mount Developer 2 Endpoints (Safe mount to avoid crashes if Dev 2 is still drafting)
logger = logging.getLogger("uvicorn")
try:
    from app.modules_dev2.method_router.router import router as diagnosis_router
    from app.modules_dev2.method_modules.router import router as method_modules_router
    from app.modules_dev2.llm_layer.router import router as llm_router

    app.include_router(diagnosis_router)
    app.include_router(method_modules_router)
    app.include_router(llm_router)
    logger.info("Developer 2 modules successfully loaded.")
except (ImportError, ModuleNotFoundError) as e:
    logger.warning(f"Developer 2 modules pending implementation: {e}")


@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "synapse-backend",
        "dev1_engines": "operational"
    }