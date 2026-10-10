"""
Progress & Cognitive Analytics API Router
Supplies data to the academic_progress_insights_desktop screen.
"""
from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/api/v1/progress", tags=["Progress & Analytics"])


class KPISummary(BaseModel):
    cognitive_mastery: float
    mastery_change_pct: float
    cohort_rank: str
    retention_index: float
    retention_status: str
    items_due_today: int
    resolved_misconceptions: int
    total_misconceptions: int
    active_anomalies: int
    weekly_focus_hours: float
    weekly_focus_target: float


class SpacedDecayItem(BaseModel):
    item_id: str
    concept_title: str
    course_code: str
    memory_index_pct: float
    status_badge: str
    cadence_description: str
    is_urgent: bool


class AnalyticsOverviewResponse(BaseModel):
    kpis: KPISummary
    spaced_decay_items: List[SpacedDecayItem]


@router.get("/overview", response_model=AnalyticsOverviewResponse)
def get_analytics_overview(course_id: Optional[str] = Query(None)):
    """Matches the exact card layout of screen.jpg and code.html"""
    return AnalyticsOverviewResponse(
        kpis=KPISummary(
            cognitive_mastery=78.4,
            mastery_change_pct=6.2,
            cohort_rank="Rank 14 / 182 (Top 8%)",
            retention_index=94.1,
            retention_status="Optimal",
            items_due_today=3,
            resolved_misconceptions=14,
            total_misconceptions=16,
            active_anomalies=2,
            weekly_focus_hours=18.5,
            weekly_focus_target=22.0
        ),
        spaced_decay_items=[
            SpacedDecayItem(
                item_id="math201_jacobian",
                concept_title="Jacobian Determinants & Coordinate Transformation",
                course_code="MATH 201",
                memory_index_pct=82.4,
                status_badge="Due Today · 82% Recall",
                cadence_description="3-day decay cycle · Last accessed 72h ago via practice quiz",
                is_urgent=True
            ),
            SpacedDecayItem(
                item_id="cs240_rbtree",
                concept_title="Red-Black Tree Rotations & Color Invariants",
                course_code="CS 240",
                memory_index_pct=88.1,
                status_badge="Due in 2 days · 88% Recall",
                cadence_description="7-day interval cadence · 4 successful recalls logged",
                is_urgent=False
            ),
            SpacedDecayItem(
                item_id="econ102_islm",
                concept_title="IS-LM Fiscal Policy & Monetary Transmission",
                course_code="ECON 102",
                memory_index_pct=96.7,
                status_badge="Stable · 14-day Cadence",
                cadence_description="Long-term consolidated retention buffer",
                is_urgent=False
            )
        ]
    )