from fastapi import APIRouter
from app.modules_dev2.llm_layer.schemas import LLMRequest, LLMResponse
from app.modules_dev2.llm_layer.service import LLMEngine

router = APIRouter(prefix="/api/v2/llm", tags=["LLM Engine"])

@router.post("/generate", response_model=LLMResponse)
def generate_ai_response(request: LLMRequest):
    """
    Core endpoint for sending prompts to the LLM and returning the synthesized response.
    """
    return LLMEngine.generate_completion(request)