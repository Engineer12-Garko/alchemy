from fastapi import APIRouter, HTTPException
from app.modules_dev2.multimodal.schemas import ImageUploadRequest, VisionAnalysisResponse
from app.modules_dev2.multimodal.service import VisionEngine

router = APIRouter(prefix="/api/v2/vision", tags=["Multimodal Vision Engine"])

@router.post("/analyze", response_model=VisionAnalysisResponse)
def analyze_student_diagram(request: ImageUploadRequest):
    raise HTTPException(
        status_code=501,
        detail="The legacy vision endpoint is not available. Use the authenticated /api/multimodal/ocr workflow.",
    )