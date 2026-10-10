from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, DateTime, Boolean, ForeignKey, Index
from sqlalchemy.orm import declarative_base, relationship
from app.core.database import Base


class UserMastery(Base):
    __tablename__ = "user_mastery"

    id = Column(String, primary_key=True)  # f"{user_id}_{concept_id}"
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    course_id = Column(String, nullable=False, index=True)
    concept_id = Column(String, nullable=False, index=True)
    concept_name = Column(String, nullable=False)
    
    # Cognitive metrics
    mastery_score = Column(Float, default=0.10)  # 0.00 to 1.00
    stability = Column(Float, default=1.0)       # FSRS memory stability in days
    difficulty = Column(Float, default=5.0)      # FSRS item difficulty 1.0 - 10.0
    lapses = Column(Integer, default=0)
    reps = Column(Integer, default=0)
    
    last_reviewed_at = Column(DateTime, default=datetime.utcnow)
    next_review_due = Column(DateTime, nullable=True, index=True)
    status = Column(String, default="learning")  # "prerequisite", "learning", "mastered", "bottleneck"

    __table_args__ = (
        Index("ix_user_course_mastery", "user_id", "course_id"),
    )


class MisconceptionLog(Base):
    __tablename__ = "misconception_logs"

    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    course_id = Column(String, nullable=False)
    concept_id = Column(String, nullable=False)
    misconception_tag = Column(String, nullable=False)  # e.g., "omitted_intermediate_dependencies"
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    severity = Column(String, default="medium")         # "low", "medium", "high"
    status = Column(String, default="open")             # "open", "in_remediation", "resolved"
    occurrences = Column(Integer, default=1)
    first_detected_at = Column(DateTime, default=datetime.utcnow)
    last_detected_at = Column(DateTime, default=datetime.utcnow)