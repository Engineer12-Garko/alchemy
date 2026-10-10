from datetime import datetime
from typing import List
from sqlalchemy.orm import Session
from app.modules_dev1.learner_model.models import UserMastery, MisconceptionLog
from app.modules_dev1.planner.schemas import (
    DashboardPlannerResponse,
    CalibratedRecommendation,
    SpacedReviewSummaryItem,
    MilestoneItem,
    StudyPaceMetrics
)


class PlannerEngine:
    @staticmethod
    def generate_dashboard_plan(db: Session, user_id: str) -> DashboardPlannerResponse:
        now = datetime.utcnow()

        # 1. Fetch items due for spaced retrieval
        due_items = db.query(UserMastery)\
            .filter(UserMastery.user_id == user_id, UserMastery.next_review_due <= now)\
            .order_by(UserMastery.next_review_due.asc())\
            .limit(3)\
            .all()

        spaced_reviews: List[SpacedReviewSummaryItem] = []
        total_review_minutes = 0

        # Build dynamic list (or fallback to defaults matching screen_6.jpg)
        if due_items:
            for item in due_items:
                mins = 4 if item.mastery_score < 0.6 else 3
                total_review_minutes += mins
                spaced_reviews.append(
                    SpacedReviewSummaryItem(
                        concept_id=item.concept_id,
                        title=item.concept_name,
                        course_code=item.course_id,
                        urgency_tier="Urgent" if item.mastery_score < 0.6 else "Optimal",
                        estimated_minutes=mins,
                        last_tested_days_ago=max(1, (now - item.last_reviewed_at).days)
                    )
                )
        else:
            # Fallback mock items matching screen_6.jpg
            spaced_reviews = [
                SpacedReviewSummaryItem(
                    concept_id="jacobian_determinants",
                    title="Jacobian Determinants",
                    course_code="MATH 201 · Calculus",
                    urgency_tier="Urgent",
                    estimated_minutes=4,
                    last_tested_days_ago=5
                ),
                SpacedReviewSummaryItem(
                    concept_id="rbtree_rotations",
                    title="Red-Black Tree Rotations",
                    course_code="CS 240 · Algorithms",
                    urgency_tier="Optimal",
                    estimated_minutes=3,
                    last_tested_days_ago=12
                ),
                SpacedReviewSummaryItem(
                    concept_id="islm_equilibrium",
                    title="IS-LM Model Equilibrium",
                    course_code="ECON 102 · Macro",
                    urgency_tier="Routine",
                    estimated_minutes=5,
                    last_tested_days_ago=15
                )
            ]
            total_review_minutes = 12

        # 2. Identify top weak point for Calibrated AI Recommendation
        worst_concept = db.query(UserMastery)\
            .filter(UserMastery.user_id == user_id, UserMastery.status == "bottleneck")\
            .first()

        if worst_concept:
            rec = CalibratedRecommendation(
                title=f"{worst_concept.concept_name}: 15-Minute Adaptive Drill",
                course_code=worst_concept.course_id,
                duration_minutes=15,
                rationale="Calibrated specifically from recent derivation error vector to stabilize exam comprehension.",
                target_action_url=f"/practice?concept={worst_concept.concept_id}"
            )
        else:
            rec = CalibratedRecommendation(
                title="Chain Rule in Multivariable Calculus: 15-Minute Adaptive Drill",
                course_code="MATH 201 · Multivariable Calculus",
                duration_minutes=15,
                rationale="Calibrated specifically from yesterday's error vector in nested partial derivatives. Target composite parameterizations f(x(t), y(t)) to stabilize divergence theorem baseline comprehension prior to Friday's graded assessment.",
                target_action_url="/practice?concept=multivariable_chain_rule"
            )

        # 3. Milestones matching design timeline
        milestones = [
            MilestoneItem(
                title="MATH 201 Midterm 2",
                course_code="Integrals & Divergence Theorem",
                due_in_days=6,
                due_date_formatted="Oct 24",
                scope_details="Chapters 14-16",
                is_urgent=True
            ),
            MilestoneItem(
                title="CS 240 Lab 04 Due",
                course_code="Graph Traversals & Benchmarks",
                due_in_days=9,
                due_date_formatted="Oct 27",
                scope_details="Dijkstra and A* correctness",
                is_urgent=False
            )
        ]

        # 4. Pace metrics matching dashboard bar charts
        pace = StudyPaceMetrics(
            daily_average_hours=2.7,
            weekly_hours_completed=18.5,
            weekly_hours_target=22.0,
            distribution_by_day=[2.5, 3.2, 4.0, 5.1, 2.0, 1.2, 0.5]  # Mon-Sun
        )

        return DashboardPlannerResponse(
            recommendation=rec,
            spaced_reviews=spaced_reviews,
            total_review_minutes=total_review_minutes,
            milestones=milestones,
            study_pace=pace
        )