from pydantic import BaseModel
from typing import Optional

class SessionState(BaseModel):
    session_id: str
    topic_id: str
    module_type: str  # 'procedural' or 'argument'
    has_attempt: bool = False
    has_reconstruction: bool = False

class ActionResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None