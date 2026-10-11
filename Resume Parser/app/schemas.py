from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from app.models import Resume, ParsedData, ATSScore


class ParsedDataResponse(BaseModel):
    id: int
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    summary: Optional[str] = None
    skills: Optional[str] = None
    experience: Optional[str] = None
    education: Optional[str] = None
    certifications: Optional[str] = None

    class Config:
        from_attributes = True


class ATSScoreResponse(BaseModel):
    id: int
    overall_score: float
    format_score: Optional[float] = None
    content_score: Optional[float] = None
    keyword_score: Optional[float] = None
    readability_score: Optional[float] = None
    section_score: Optional[float] = None
    feedback: Optional[str] = None
    suggestions: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ResumeResponse(BaseModel):
    id: int
    filename: str
    original_filename: str
    file_type: str
    file_size: int
    upload_date: datetime
    is_processed: bool
    processed_date: Optional[datetime] = None
    error_message: Optional[str] = None
    parsed_data: Optional[ParsedDataResponse] = None
    ats_score: Optional[ATSScoreResponse] = None

    class Config:
        from_attributes = True


class UploadResponse(BaseModel):
    message: str
    resume_id: int
    filename: str
    file_type: str


class ResumeTextRequest(BaseModel):
    text: str
    original_filename: Optional[str] = "pasted-resume.txt"


class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
