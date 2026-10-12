from typing import List, Optional
from pydantic import BaseModel, Field
from app.shared.review_event import ReviewEvent


class StepEvaluation(BaseModel):
    """
    Describes work the learner showed for one step.
    is_correct is NOT accepted from the client; it is computed server-side.
    """
    step_id: str
    step_name: str
    diagnostic_message: str = ""


class AssessmentSubmission(BaseModel):
    user_id: Optional[str] = "test-user"
    course_id: str
    concept_id: str
    # question_id must reference a server-stored QuizQuestion owned by this user.
    # The canonical answer is loaded from that record — never from the client.
    question_id: str
    raw_final_answer: str
    step_evaluations: List[StepEvaluation] = Field(min_length=1)
    turnaround_seconds: int


class StepEvaluationResult(BaseModel):
    step_id: str
    step_name: str
    is_correct: bool
    diagnostic_message: str


class AssessmentResult(BaseModel):
    question_id: str
    score_ratio: float
    verdict: str
    mastery_posterior: float
    mastery_surge_label: str
    next_review_interval_days: int
    step_evaluations: List[StepEvaluationResult]
    review_event: ReviewEvent


class AssessmentEngine:
    @staticmethod
    def evaluate_submission(
        submission: AssessmentSubmission,
        canonical_target_value: str,
        current_mastery: float,
    ) -> AssessmentResult:
        # Evaluate each step server-side: a step is correct only if its
        # step_id is the last step listed AND the final answer matches the
        # canonical value.  All earlier steps are marked correct by completion
        # (the learner showed work); only the final answer step is graded.
        final_correct = (
            submission.raw_final_answer.strip().lower()
            == canonical_target_value.strip().lower()
        )

        total_steps = len(submission.step_evaluations)
        evaluated: List[StepEvaluationResult] = []
        for index, step in enumerate(submission.step_evaluations):
            is_last = index == total_steps - 1
            # Last step correct only if the final answer matches the canonical value
            is_correct = final_correct if is_last else True
            evaluated.append(
                StepEvaluationResult(
                    step_id=step.step_id,
                    step_name=step.step_name,
                    is_correct=is_correct,
                    diagnostic_message=step.diagnostic_message,
                )
            )

        correct_steps = sum(1 for s in evaluated if s.is_correct)
        step_ratio = correct_steps / total_steps if total_steps > 0 else 1.0

        # Weighted aggregate score (60% step completeness, 40% final value)
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

        # First incorrect step tag
        misconception_tag = next(
            (s.step_name.lower().replace(" ", "_") for s in evaluated if not s.is_correct),
            None,
        )

        event = ReviewEvent(
            user_id=submission.user_id,
            course_id=submission.course_id,
            concept_id=submission.concept_id,
            question_id=submission.question_id,
            is_correct=is_passed,
            rating=rating,
            score_ratio=score_ratio,
            turnaround_seconds=submission.turnaround_seconds,
            misconception_tag=misconception_tag,
        )

        return AssessmentResult(
            question_id=submission.question_id,
            score_ratio=score_ratio,
            verdict=verdict,
            mastery_posterior=posterior,
            mastery_surge_label=surge_label,
            next_review_interval_days=interval_days,
            step_evaluations=evaluated,
            review_event=event,
        )