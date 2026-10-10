from fastapi import APIRouter
from app.modules_dev2.multimodal.schemas import ImageUploadRequest, VisionAnalysisResponse
from app.modules_dev2.multimodal.service import VisionEngine

router = APIRouter(prefix="/api/v2/vision", tags=["Multimodal Vision Engine"])

@router.post("/analyze", response_model=VisionAnalysisResponse)
def analyze_student_diagram(request: ImageUploadRequest):
    """
    Accepts an image of a student's handwritten work or spatial canvas
    and returns structured visual analysis.
    """
    return VisionEngine.analyze_image(request)