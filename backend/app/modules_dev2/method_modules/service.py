from fastapi import HTTPException
from app.modules_dev2.method_modules.schemas import SessionState

class MethodEnforcer:
    @staticmethod
    def enforce_solution_access(session: SessionState):
        if session.module_type == "procedural" and not session.has_attempt:
            raise HTTPException(
                status_code=403, 
                detail="Method Enforcement: You must submit a full attempt before viewing the solution."
            )
        return {"solution": "Here is the step-by-step mathematical breakdown..."}

    @staticmethod
    def enforce_objection_access(session: SessionState):
        if session.module_type == "argument" and not session.has_reconstruction:
            raise HTTPException(
                status_code=403,
                detail="Method Enforcement: You must reconstruct the argument in your own words before facing the strongest objection."
            )
        return {"objection": "Critics of this premise argue that..."}