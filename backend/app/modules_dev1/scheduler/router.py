from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules_dev1.auth.router import get_current_user
from app.modules_dev1.auth.models import User
from app.modules_dev1.learner_model.models import UserMastery
from app.modules_dev1.scheduler.fsrs import calculate_retention

router = APIRouter(prefix="/api/v1/scheduler", tags=["Scheduler"])


class DueReviewItem(BaseModel):
    concept_id: str
    concept_name: str
    course_id: str
    mastery_score: float
    stability: float
    difficulty: float
    predicted_recall_pct: float
    due_date: Optional[datetime]

    class Config:
        from_attributes = True


@router.get("/due", response_model=List[DueReviewItem])
def get_due_reviews(
    course_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    now = datetime.utcnow()
    query = db.query(UserMastery).filter(
        UserMastery.user_id == current_user.id,
        UserMastery.next_review_due <= now
    )
    if course_id:
        query = query.filter(UserMastery.course_id == course_id)

    items = query.order_by(UserMastery.next_review_due.asc()).all()
    
    results = []
    for item in items:
        elapsed_days = max(0.1, (now - item.last_reviewed_at).total_seconds() / 86400.0)
        recall = calculate_retention(item.stability, elapsed_days)
        results.append(
            DueReviewItem(
                concept_id=item.concept_id,
                concept_name=item.concept_name,
                course_id=item.course_id,
                mastery_score=item.mastery_score,
                stability=item.stability,
                difficulty=item.difficulty,
                predicted_recall_pct=round(recall * 100, 1),
                due_date=item.next_review_due
            )
        )
    return results