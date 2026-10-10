from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
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
    current_user: User = Depends(get_current_user)
):
    weak_concepts = LearnerModelService.get_weak_concepts(db, current_user.id, limit=3)

    if weak_concepts:
        top_weak = weak_concepts[0]
        rec_title = f"{top_weak.concept_name} Focus"
        rec_reason = f"Current mastery at {int(top_weak.mastery_score * 100)}%. Step-derivation drill required before exam milestone."
    else:
        rec_title = "Multivariable Chain Rule & Jacobian Determinants"
        rec_reason = "Priority review: Memory stability indicates upcoming decay threshold within 48 hours."

    return PlannerOverview(
        calibrated_recommendation={
            "course": "MATH-201: Multivariable Calculus",
            "title": rec_title,
            "estimated_minutes": 45,
            "priority": "HIGH_DEFICIT",
            "reason": rec_reason
        },
        spaced_reviews=[
            {"concept": "Jacobian Determinants", "due_in_hours": 3, "retention_pct": 64},
            {"concept": "Eigenvalues & Diagonalization", "due_in_hours": 8, "retention_pct": 71},
            {"concept": "Red-Black Tree Rotations", "due_in_hours": 24, "retention_pct": 85}
        ],
        milestones=[
            {"course": "MATH-201", "name": "Midterm Examination", "days_remaining": 6, "target_mastery": 0.90},
            {"course": "CS-210", "name": "Problem Set 4 (Dynamic Trees)", "days_remaining": 9, "target_mastery": 0.85}
        ],
        today_schedule=[
            {"time": "09:00 - 10:15", "activity": "Deep Work: Multivariable Derivations", "type": "study"},
            {"time": "14:00 - 14:30", "activity": "FSRS Spaced Review: Discrete Trees", "type": "review"},
            {"time": "16:30 - 17:15", "activity": "Adaptive Diagnostic Drill", "type": "quiz"}
        ]
    )