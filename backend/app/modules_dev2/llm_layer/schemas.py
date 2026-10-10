from pydantic import BaseModel
from typing import Optional

class LLMRequest(BaseModel):
    prompt: str
    context: Optional[str] = None
    max_tokens: int = 500
    temperature: float = 0.7
    system_role: str = "tutor"

class LLMResponse(BaseModel):
    text: str
    model_used: str
    prompt_tokens: int
    completion_tokens: int