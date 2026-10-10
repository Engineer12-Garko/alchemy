from fastapi import APIRouter
from app.modules_dev2.method_modules.schemas import SessionState, ActionResponse
from app.modules_dev2.method_modules.service import MethodEnforcer

router = APIRouter(prefix="/api/v2/modules", tags=["Method Modules & Enforcement"])

# Mock database simulating active student sessions
MOCK_SESSIONS = {
    "math_123": SessionState(session_id="math_123", topic_id="chain_rule", module_type="procedural", has_attempt=False),
    "phil_456": SessionState(session_id="phil_456", topic_id="ethics", module_type="argument", has_reconstruction=False)
}

@router.post("/{session_id}/solution", response_model=ActionResponse)
def request_solution(session_id: str):
    session = MOCK_SESSIONS.get(session_id)
    if not session:
        return ActionResponse(success=False, message="Session not found")
    
    # This will throw a 403 error if they haven't submitted an attempt
    data = MethodEnforcer.enforce_solution_access(session)
    return ActionResponse(success=True, message="Solution unlocked", data=data)
    
@router.post("/{session_id}/objection", response_model=ActionResponse)
def request_objection(session_id: str):
    session = MOCK_SESSIONS.get(session_id)
    if not session:
        return ActionResponse(success=False, message="Session not found")
    
    # This will throw a 403 error if they haven't submitted a reconstruction
    data = MethodEnforcer.enforce_objection_access(session)
    return ActionResponse(success=True, message="Objection unlocked", data=data)