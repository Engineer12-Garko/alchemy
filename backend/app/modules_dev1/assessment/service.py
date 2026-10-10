"""
Assessment & Proof Scorer.
Processes submitted step derivations, calculates score deltas, and emits ReviewEvents.
"""
from typing import Dict, Any, List
from pydantic import BaseModel
from app.shared.review_event import ReviewEvent, ReviewRating


class StepEvaluation(BaseModel):
    step_id: str
    step_name: str
    is_correct: bool
    diagnostic_message: str


class AssessmentSubmission(BaseModel):
    user_id: str
    course_id: str
    concept_id: str
    question_id: str
    raw_final_answer: str
    canonical_target_value: str
    step_evaluations: List[StepEvaluation]
    turnaround_seconds: int


class AssessmentResult(BaseModel):
    verdict: str  # "Solved", "Partially Correct", "Incorrect"
    score_percentage: float
    mastery_prior: float
    mastery_posterior: float
    mastery_surge_label: str
    next_review_interval_days: int
    review_event: ReviewEvent


class AssessmentEngine:
    @staticmethod
    def evaluate_submission(sub: AssessmentSubmission, current_mastery: float) -> AssessmentResult:
        total_steps = len(sub.step_evaluations)
        passed_steps = sum(1 for step in sub.step_evaluations if step.is_correct)
        value_match = (sub.raw_final_answer.strip() == sub.canonical_target_value.strip())

        # Determine verdict
        if passed_steps == total_steps and value_match:
            verdict = "Solved"
            score_ratio = 1.0
            rating = ReviewRating.GOOD if sub.turnaround_seconds < 180 else ReviewRating.HARD
        elif passed_steps > 0 or value_match:
            verdict = "Partially Correct"
            score_ratio = passed_steps / max(1, total_steps) * 0.8  # partial penalty
            rating = ReviewRating.HARD
        else:
            verdict = "Incorrect"
            score_ratio = 0.0
            rating = ReviewRating.AGAIN

        # Bayesian Knowledge Tracing (BKT) Posterior Update
        p_transit = 0.15
        p_slip = 0.10
        p_guess = 0.20
        
        # Likelihood update
        if score_ratio >= 0.5:
            numerator = current_mastery * (1.0 - p_slip)
            denominator = numerator + (1.0 - current_mastery) * p_guess
        else:
            numerator = current_mastery * p_slip
            denominator = numerator + (1.0 - current_mastery) * (1.0 - p_guess)
            
        p_learned = numerator / max(1e-5, denominator)
        new_mastery = round(p_learned + (1.0 - p_learned) * p_transit, 2)
        
        # Surge formatting (+16% Surge)
        delta = int(round((new_mastery - current_mastery) * 100))
        surge_label = f"+{delta}% Surge" if delta >= 0 else f"{delta}% Decay"

        # Emit standard event
        event = ReviewEvent(
            user_id=sub.user_id,
            course_id=sub.course_id,
            concept_id=sub.concept_id,
            question_id=sub.question_id,
            is_correct=(verdict == "Solved"),
            score_ratio=score_ratio,
            rating=rating,
            time_taken_ms=sub.turnaround_seconds * 1000,
            step_evaluations={s.step_id: s.is_correct for s in sub.step_evaluations},
            misconception_tag="omitted_intermediate_dependencies" if verdict == "Partially Correct" else None
        )

        return AssessmentResult(
            verdict=verdict,
            score_percentage=round(score_ratio * 100, 1),
            mastery_prior=current_mastery,
            mastery_posterior=new_mastery,
            mastery_surge_label=surge_label,
            next_review_interval_days=3 if rating == ReviewRating.HARD else 7,
            review_event=event
        )