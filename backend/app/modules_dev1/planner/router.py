from datetime import datetime, timezone
from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import PlannerTask
from app.modules_dev1.auth.router import get_current_user
from app.modules_dev1.auth.models import User
from app.modules_dev1.learner_model.service import LearnerModelService

router = APIRouter(prefix="/api/v1/planner", tags=["Planner & Schedule"])


class PlannerOverview(BaseModel):
    calibrated_recommendation: Dict[str, Any]
    spaced_reviews: List[Dict[str, Any]]
    milestones: List[Dict[str, Any]]
    today_schedule: List[Dict[str, Any]]


@router.get("/today", response_model=PlannerOverview)
def get_today_planner(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    now = datetime.now(timezone.utc)

    # Real tasks from the database for this user
    tasks = db.scalars(
        select(PlannerTask)
        .where(PlannerTask.owner_id == current_user.id)
        .order_by(PlannerTask.due_at)
    ).all()

    today_schedule = [
        {
            "time": t.due_at.strftime("%H:%M") if t.due_at.tzinfo else t.due_at.strftime("%H:%M"),
            "activity": t.title,
            "type": "study",
            "duration_minutes": t.duration_minutes,
            "completed": t.completed,
        }
        for t in tasks
    ]

    # Use weak concepts from the learner model if available
    weak_concepts = LearnerModelService.get_weak_concepts(db, current_user.id, limit=3)
    if weak_concepts:
        top_weak = weak_concepts[0]
        rec_title = f"{top_weak.concept_name} Focus"
        rec_reason = f"Current mastery at {int(top_weak.mastery_score * 100)}%. Review recommended."
    elif tasks:
        next_task = tasks[0]
        rec_title = next_task.title
        rec_reason = f"Next scheduled task due {next_task.due_at.strftime('%Y-%m-%d %H:%M')}."
    else:
        rec_title = "No tasks scheduled"
        rec_reason = "Add a study task in the planner to build your schedule."

    return PlannerOverview(
        calibrated_recommendation={
            "title": rec_title,
            "estimated_minutes": tasks[0].duration_minutes if tasks else 0,
            "priority": "HIGH_DEFICIT" if weak_concepts else "NORMAL",
            "reason": rec_reason,
        },
        spaced_reviews=[],
        milestones=[],
        today_schedule=today_schedule,
    )