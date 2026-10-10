from pydantic import BaseModel
from typing import List

class CognitiveGap(BaseModel):
    misconception_type: str
    description: str
    severity: str

class DiagnosticReport(BaseModel):
    student_id: str
    topic_id: str
    gaps_identified: List[CognitiveGap]