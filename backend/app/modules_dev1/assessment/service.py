from typing import List, Optional
from pydantic import BaseModel
from app.shared.review_event import ReviewEvent


class StepEvaluation(BaseModel):
    step_id: str
    step_name: str
    is_correct: bool
    diagnostic_message: str


class AssessmentSubmission(BaseModel):
    user_id: Optional[str] = "test-user"
    course_id: str
    concept_id: str
    question_id: str
    raw_final_answer: str
    canonical_target_value: str
    step_evaluations: List[StepEvaluation]
    turnaround_seconds: int


class AssessmentResult(BaseModel):
    question_id: str
    score_ratio: float
    verdict: str
    mastery_posterior: float
    mastery_surge_label: str
    next_review_interval_days: int
    step_evaluations: List[StepEvaluation]
    review_event: ReviewEvent


class AssessmentEngine:
    @staticmethod
    def evaluate_submission(submission: AssessmentSubmission, current_mastery: float) -> AssessmentResult:
        total_steps = len(submission.step_evaluations)
        correct_steps = sum(1 for s in submission.step_evaluations if s.is_correct)

        step_ratio = (correct_steps / total_steps) if total_steps > 0 else 1.0
        final_correct = submission.raw_final_answer.strip().lower() == submission.canonical_target_value.strip().lower()

        # Weighted aggregate score (60% step correctness, 40% final value)
        score_ratio = round((0.60 * step_ratio) + (0.40 * (1.0 if final_correct else 0.0)), 2)

        is_passed = score_ratio >= 0.70

        if score_ratio >= 0.90:
            verdict = "Mastered"
            rating = 4
            interval_days = 7
        elif score_ratio >= 0.60:
            verdict = "Partially Correct"
            rating = 3
            interval_days = 3
        elif score_ratio >= 0.35:
            verdict = "Needs Review"
            rating = 2
            interval_days = 1
        else:
            verdict = "Unsuccessful Derivation"
            rating = 1
            interval_days = 1

        # Bayesian Knowledge Tracing update
        p_transit = 0.12
        p_slip = 0.10
        p_guess = 0.20
        p_m = current_mastery

        if is_passed:
            p_obs = (p_m * (1 - p_slip)) / ((p_m * (1 - p_slip)) + ((1 - p_m) * p_guess))
        else:
            p_obs = (p_m * p_slip) / ((p_m * p_slip) + ((1 - p_m) * (1 - p_guess)))

        posterior = round(min(1.0, max(0.01, p_obs + (1 - p_obs) * p_transit)), 3)
        delta_pct = round((posterior - current_mastery) * 100, 1)
        surge_label = f"+{delta_pct}% surge" if delta_pct >= 0 else f"{delta_pct}% decay"

        # Check for first failed step misconception
        misconception_tag = None
        for step in submission.step_evaluations:
            if not step.is_correct:
                misconception_tag = step.step_name.lower().replace(" ", "_")
                break

        event = ReviewEvent(
            user_id=submission.user_id,
            course_id=submission.course_id,
            concept_id=submission.concept_id,
            question_id=submission.question_id,
            is_correct=is_passed,
            rating=rating,
            score_ratio=score_ratio,
            turnaround_seconds=submission.turnaround_seconds,
            misconception_tag=misconception_tag
        )

        return AssessmentResult(
            question_id=submission.question_id,
            score_ratio=score_ratio,
            verdict=verdict,
            mastery_posterior=posterior,
            mastery_surge_label=surge_label,
            next_review_interval_days=interval_days,
            step_evaluations=submission.step_evaluations,
            review_event=event
        )