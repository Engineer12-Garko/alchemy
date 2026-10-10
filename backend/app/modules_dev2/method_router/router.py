from fastapi import APIRouter
from app.modules_dev2.method_router.schemas import GapAnalysisRequest
from app.modules_dev2.diagnosis.schemas import DiagnosticReport
from app.modules_dev2.diagnosis.service import DiagnosticEngine

router = APIRouter(prefix="/api/v2/diagnosis", tags=["Diagnostic Gaps API"])

@router.post("/analyze", response_model=DiagnosticReport)
def analyze_gaps(request: GapAnalysisRequest):
    """
    Receives the student data, passes it to the Diagnostic Engine for analysis, 
    and returns the structured cognitive gaps.
    """
    # The router simply acts as the messenger, handing the data to the engine
    return DiagnosticEngine.analyze_student_gaps(
        student_id=request.student_id,
        topic_id=request.topic_id,
        recent_attempts=request.recent_attempts
    )