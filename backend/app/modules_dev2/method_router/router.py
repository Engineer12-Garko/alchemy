from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules_dev1.auth.router import get_current_user
from app.modules_dev1.auth.models import User
from app.modules_dev2.method_router.service import MethodRouterEngine
from app.modules_dev2.method_router.schemas import DiagnosticGapsResponse

router = APIRouter(prefix="/api/v2/diagnosis", tags=["Method Router & Diagnosis"])


@router.get("/gaps", response_model=DiagnosticGapsResponse)
def get_learning_diagnosis(
    concept_id: str = Query("multivariable_chain_rule"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Analyzes the learner model for specific cognitive frictions and routes 
    the student to the optimal intervention method.
    """
    return MethodRouterEngine.generate_diagnostic_intervention(db, current_user.id, concept_id)