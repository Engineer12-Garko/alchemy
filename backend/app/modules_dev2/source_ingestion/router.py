from fastapi import APIRouter, HTTPException
from app.modules_dev2.source_ingestion.schemas import DocumentUploadRequest, IngestionResponse
from app.modules_dev2.source_ingestion.service import IngestionEngine

router = APIRouter(prefix="/api/v2/ingestion", tags=["Source Ingestion"])

@router.post("/process", response_model=IngestionResponse)
def ingest_course_material(request: DocumentUploadRequest):
    raise HTTPException(
        status_code=501,
        detail="The legacy ingestion endpoint is not available. Upload materials through /api/materials.",
    )