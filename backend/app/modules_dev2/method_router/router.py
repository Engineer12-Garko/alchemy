from fastapi import APIRouter, HTTPException
from app.modules_dev2.method_router.schemas import GapAnalysisRequest
from app.modules_dev2.diagnosis.schemas import DiagnosticReport
from app.modules_dev2.diagnosis.service import DiagnosticEngine

router = APIRouter(prefix="/api/v2/diagnosis", tags=["Diagnostic Gaps API"])

@router.post("/analyze", response_model=DiagnosticReport)
def analyze_gaps(request: GapAnalysisRequest):
    raise HTTPException(
        status_code=501,
        detail="The legacy diagnostic endpoint is not available. Use the authenticated /api/diagnosis workflow.",
    )