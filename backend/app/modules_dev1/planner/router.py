from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.modules_dev1.auth.router import get_current_user
from app.modules_dev1.auth.models import User
from app.modules_dev1.planner.schemas import DashboardPlannerResponse
from app.modules_dev1.planner.engine import PlannerEngine

router = APIRouter(prefix="/api/v1/planner", tags=["Planner"])


@router.get("/today", response_model=DashboardPlannerResponse)
def get_daily_agenda(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Feeds the central schedule, daily reviews, and milestones on screen_6.jpg"""
    return PlannerEngine.generate_dashboard_plan(db, current_user.id)