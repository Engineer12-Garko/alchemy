from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, DateTime, UniqueConstraint
from app.core.database import Base


class UserMastery(Base):
    __tablename__ = "user_mastery"
    __table_args__ = (UniqueConstraint("user_id", "course_id", "concept_id", name="uq_mastery_user_course_concept"),)

    id = Column(String, primary_key=True)  # Format: {user_id}_{concept_id}
    user_id = Column(String, index=True, nullable=False)
    course_id = Column(String, nullable=False)
    concept_id = Column(String, nullable=False)
    concept_name = Column(String, nullable=False)
    mastery_score = Column(Float, default=0.10)  # Bayesian posterior probability [0.0 - 1.0]
    stability = Column(Float, default=1.0)       # FSRS memory stability in days
    difficulty = Column(Float, default=5.0)      # FSRS concept difficulty [1.0 - 10.0]
    lapses = Column(Integer, default=0)
    reps = Column(Integer, default=0)
    last_reviewed_at = Column(DateTime, default=datetime.utcnow)
    next_review_due = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="learning")  # learning, mastered, bottleneck


class MisconceptionLog(Base):
    __tablename__ = "misconception_logs"
    __table_args__ = (UniqueConstraint("user_id", "course_id", "concept_id", "misconception_tag", name="uq_misconception_user_course_concept_tag"),)

    id = Column(String, primary_key=True)  # Format: {user_id}_{concept_id}_{misconception_tag}
    user_id = Column(String, index=True, nullable=False)
    course_id = Column(String, nullable=False)
    concept_id = Column(String, nullable=False)
    misconception_tag = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    severity = Column(String, default="medium")  # low, medium, high
    status = Column(String, default="open")       # open, resolving, resolved
    occurrences = Column(Integer, default=1)
    last_detected_at = Column(DateTime, default=datetime.utcnow)
