from typing import List, Optional
from pydantic import BaseModel


class CalibratedRecommendation(BaseModel):
    title: str
    course_code: str
    duration_minutes: int
    rationale: str
    target_action_url: str


class MilestoneItem(BaseModel):
    title: str
    course_code: str
    due_in_days: int
    due_date_formatted: str
    scope_details: str
    is_urgent: bool


class SpacedReviewSummaryItem(BaseModel):
    concept_id: str
    title: str
    course_code: str
    urgency_tier: str       # "Urgent", "Optimal", "Routine"
    estimated_minutes: int
    last_tested_days_ago: int


class StudyPaceMetrics(BaseModel):
    daily_average_hours: float
    weekly_hours_completed: float
    weekly_hours_target: float
    distribution_by_day: List[float]  # Mon to Sun hours


class DashboardPlannerResponse(BaseModel):
    recommendation: CalibratedRecommendation
    spaced_reviews: List[SpacedReviewSummaryItem]
    total_review_minutes: int
    milestones: List[MilestoneItem]
    study_pace: StudyPaceMetrics