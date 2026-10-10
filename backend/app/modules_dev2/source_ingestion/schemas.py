from pydantic import BaseModel
from typing import List

class DocumentUploadRequest(BaseModel):
    document_url: str
    course_id: str
    document_type: str = "pdf"

class IngestionResponse(BaseModel):
    status: str
    total_chunks: int
    message: str