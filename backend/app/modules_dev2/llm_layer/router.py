from fastapi import APIRouter, HTTPException
from app.modules_dev2.llm_layer.schemas import LLMRequest, LLMResponse
from app.modules_dev2.llm_layer.service import LLMEngine

router = APIRouter(prefix="/api/v2/llm", tags=["LLM Engine"])

@router.post("/generate", response_model=LLMResponse)
def generate_ai_response(request: LLMRequest):
    raise HTTPException(
        status_code=501,
        detail="The legacy LLM endpoint is not available. Use the authenticated /api/tutor/chat workflow.",
    )