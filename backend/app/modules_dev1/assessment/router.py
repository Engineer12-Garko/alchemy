from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules_dev1.auth.router import get_current_user
from app.modules_dev1.auth.models import User
from app.modules_dev1.learner_model.models import UserMastery
from app.modules_dev1.learner_model.service import LearnerModelService
from app.modules_dev1.assessment.service import (
    AssessmentEngine,
    AssessmentSubmission,
    AssessmentResult
)

router = APIRouter(prefix="/api/v1/assessment", tags=["Assessment & Grading"])


@router.post("/submit", response_model=AssessmentResult)
def submit_assessment(
    submission: AssessmentSubmission,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    submission.user_id = current_user.id
    record_id = f"{current_user.id}_{submission.concept_id}"
    mastery = db.query(UserMastery).filter(UserMastery.id == record_id).first()
    current_mastery_score = mastery.mastery_score if mastery else 0.10

    result = AssessmentEngine.evaluate_submission(submission, current_mastery=current_mastery_score)
    LearnerModelService.sync_review_event(db, result.review_event)

    return result