from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class ReviewEvent(BaseModel):
    user_id: str
    course_id: str
    concept_id: str
    question_id: str
    is_correct: bool
    rating: int  # 1: Again (forget), 2: Hard, 3: Good, 4: Easy
    score_ratio: float  # 0.0 to 1.0 (step derivation ratio)
    turnaround_seconds: int
    misconception_tag: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)