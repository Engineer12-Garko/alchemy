from fastapi import APIRouter, HTTPException
from app.modules_dev2.method_modules.schemas import ActionResponse

router = APIRouter(prefix="/api/v2/modules", tags=["Method Modules & Enforcement"])

@router.post("/{session_id}/solution", response_model=ActionResponse)
def request_solution(session_id: str):
    raise HTTPException(
        status_code=501,
        detail="The legacy in-memory method-module endpoint is not available. Use /api/method-modules.",
    )
    
@router.post("/{session_id}/objection", response_model=ActionResponse)
def request_objection(session_id: str):
    raise HTTPException(
        status_code=501,
        detail="The legacy in-memory method-module endpoint is not available. Use /api/method-modules.",
    )