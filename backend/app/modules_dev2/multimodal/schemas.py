from pydantic import BaseModel
from typing import List

class ImageUploadRequest(BaseModel):
    image_data: str  # Base64 string representation of the image
    student_id: str
    context: str = "general_math"

class BoundingBox(BaseModel):
    x: int
    y: int
    width: int
    height: int
    label: str

class VisionAnalysisResponse(BaseModel):
    transcribed_text: str
    detected_elements: List[BoundingBox]
    confidence_score: float
    feedback: str