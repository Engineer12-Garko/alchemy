import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import router as alchemy_router
from app.core.config import get_settings
from app.core.database import Base, engine
from app.models import Course, LearningEvent, Material, PlannerTask, ReviewItem, StudyModuleSession, TutorMessage, UserPreferences
from app.modules_dev1.assessment.router import router as assessment_router
from app.modules_dev1.auth.models import User
from app.modules_dev1.auth.router import router as auth_router
from app.modules_dev1.learner_model.models import MisconceptionLog, UserMastery
from app.modules_dev1.planner.router import router as planner_router
from app.modules_dev1.progress.router import router as progress_router
from app.modules_dev1.scheduler.router import router as scheduler_router

settings = get_settings()
logger = logging.getLogger("uvicorn")

app = FastAPI(
    title="Alchemy Academic Studio API",
    version="1.0.0",
    description="Learner workflows with modular assessment, planning, and diagnosis services.",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(auth_router)
app.include_router(scheduler_router)
app.include_router(assessment_router)
app.include_router(planner_router)
app.include_router(progress_router)
app.include_router(alchemy_router)

try:
    from app.modules_dev2.llm_layer.router import router as llm_router
    from app.modules_dev2.method_modules.router import router as method_modules_router
    from app.modules_dev2.method_router.router import router as method_router
    from app.modules_dev2.multimodal.router import router as multimodal_router
    from app.modules_dev2.source_ingestion.router import router as source_ingestion_router

    app.include_router(method_router)
    app.include_router(method_modules_router)
    app.include_router(llm_router)
    app.include_router(multimodal_router)
    app.include_router(source_ingestion_router)
    logger.info("Developer 2 modules successfully loaded.")
except (ImportError, ModuleNotFoundError) as error:
    logger.warning("Developer 2 modules pending implementation: %s", error)

Base.metadata.create_all(bind=engine)


@app.get("/health", tags=["Health"])
def health_check() -> dict[str, str]:
    return {"status": "healthy", "service": "alchemy", "dev1_engines": "operational"}
