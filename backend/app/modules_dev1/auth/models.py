from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, DateTime
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    
    # Profile & Academic Tracking (Populates Student Dashboard)
    avatar_initials = Column(String, default="EV")
    academic_program = Column(String, default="BSc Computer Science & Mathematics")
    cohort_level = Column(String, default="Junior · Semester 2")
    honor_track = Column(String, default="Honor Track")
    gpa = Column(Float, default=3.82)
    active_streak_days = Column(Integer, default=12)
    
    created_at = Column(DateTime, default=datetime.utcnow)