from fastapi import APIRouter
from app.modules_dev2.source_ingestion.schemas import DocumentUploadRequest, IngestionResponse
from app.modules_dev2.source_ingestion.service import IngestionEngine

router = APIRouter(prefix="/api/v2/ingestion", tags=["Source Ingestion"])

@router.post("/process", response_model=IngestionResponse)
def ingest_course_material(request: DocumentUploadRequest):
    """
    Downloads, parses, chunks, and vectorizes course materials for AI context retrieval.
    """
    return IngestionEngine.process_document(request)