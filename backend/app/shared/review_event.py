"""
Standardized Review Event Contract
Shared interface between Developer 1 (state/scheduling) and Developer 2 (LLM/diagnostics).
"""
from datetime import datetime
from enum import IntEnum
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field


class ReviewRating(IntEnum):
    AGAIN = 1  # Complete blackout / incorrect step
    HARD = 2   # Partial recall / correct with heavy hints
    GOOD = 3   # Correct with expected effort
    EASY = 4   # Rapid, unprompted mastery


class ReviewEvent(BaseModel):
    user_id: str = Field(..., description="UUID of the student")
    course_id: str = Field(..., example="MATH-201")
    concept_id: str = Field(..., example="multivariable_chain_rule")
    question_id: str = Field(..., example="q_calc3_chain_02")
    
    # Grading & Performance
    is_correct: bool = Field(..., description="True if canonical value and derivation match")
    score_ratio: float = Field(..., ge=0.0, le=1.0, description="0.0 to 1.0 (e.g. 0.5 for partially correct)")
    rating: ReviewRating = Field(..., description="FSRS/SM-2 rating grade 1-4")
    time_taken_ms: int = Field(..., description="Response latency in milliseconds")
    
    # Pedagogical context
    step_evaluations: Optional[Dict[str, bool]] = Field(
        default=None, 
        description="Detailed sub-step statuses, e.g. {'x_partial': True, 'y_partial': False}"
    )
    misconception_tag: Optional[str] = Field(
        default=None, 
        example="omitted_intermediate_dependencies"
    )
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        frozen = True