import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, DateTime
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    gpa = Column(Float, default=3.92)
    streak_days = Column(Integer, default=14)
    degree = Column(String, default="B.S. Computer Science & Applied Mathematics")
    created_at = Column(DateTime, default=datetime.utcnow)