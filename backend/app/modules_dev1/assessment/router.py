from fastapi import APIRouter, Depends, HTTPException
from app.modules_dev1.auth.router import get_current_user
from app.modules_dev1.auth.models import User
from app.modules_dev1.assessment.service import AssessmentSubmission

router = APIRouter(prefix="/api/v1/assessment", tags=["Assessment & Grading"])


@router.post("/submit")
def submit_assessment(
    submission: AssessmentSubmission,
    current_user: User = Depends(get_current_user),
):
    raise HTTPException(
        status_code=501,
        detail="Step-level grading is unavailable until questions have server-defined step rubrics. Use /api/quizzes/grade for supported grading.",
    )
