from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules_dev1.auth.router import get_current_user
from app.modules_dev1.auth.models import User
from app.modules_dev1.learner_model.models import UserMastery, MisconceptionLog

router = APIRouter(prefix="/api/v1/progress", tags=["Progress Analytics"])


class ProgressOverview(BaseModel):
    cognitive_mastery: float
    retention_index: float
    resolved_misconceptions: int
    weekly_focus_hours: float
    memory_decay_curve: List[Dict[str, Any]]
    mastery_distribution: Dict[str, int]


@router.get("/overview", response_model=ProgressOverview)
def get_progress_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    masteries = db.query(UserMastery).filter(UserMastery.user_id == current_user.id).all()
    resolved_count = db.query(MisconceptionLog).filter(
        MisconceptionLog.user_id == current_user.id,
        MisconceptionLog.status == "resolved"
    ).count()

    if masteries:
        avg_mastery = round(sum(m.mastery_score for m in masteries) / len(masteries) * 100, 1)
        mastered_count = sum(1 for m in masteries if m.status == "mastered")
        bottleneck_count = sum(1 for m in masteries if m.status == "bottleneck")
        learning_count = len(masteries) - (mastered_count + bottleneck_count)
    else:
        avg_mastery = 0.0
        mastered_count = 0
        learning_count = 0
        bottleneck_count = 0

    return ProgressOverview(
        cognitive_mastery=avg_mastery,
        retention_index=0.0,
        resolved_misconceptions=resolved_count,
        weekly_focus_hours=0.0,
        memory_decay_curve=[
            {"day": 1, "predicted_retention": 100},
            {"day": 3, "predicted_retention": 91},
            {"day": 7, "predicted_retention": 84},
            {"day": 14, "predicted_retention": 76},
            {"day": 30, "predicted_retention": 68}
        ],
        mastery_distribution={
            "mastered": mastered_count,
            "learning": learning_count,
            "bottleneck": bottleneck_count
        }
    )