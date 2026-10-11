from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Body
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Resume, ParsedData, ATSScore
from app.schemas import UploadResponse, ResumeResponse, ErrorResponse, ResumeTextRequest
from app.services.extractor import TextExtractor
from app.services.parser import ResumeParser
from app.services.ats_score import ATSScorer
from app.config import settings
import os
import uuid
from datetime import datetime


router = APIRouter(prefix="/api/v1", tags=["resumes"])


@router.post("/upload", response_model=UploadResponse)
async def upload_resume(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    file_extension = file.filename.split(".")[-1].lower()
    allowed_extensions = settings.allowed_extensions_list
    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"File type '{file_extension}' not allowed. Allowed: {', '.join(allowed_extensions)}"
        )

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)

    try:
        content = await file.read()
        if len(content) > settings.MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File too large. Max size: 10MB")

        with open(file_path, "wb") as f:
            f.write(content)

        resume = Resume(
            filename=unique_filename,
            original_filename=file.filename,
            file_path=file_path,
            file_size=len(content),
            file_type=file_extension,
        )
        db.add(resume)
        db.commit()
        db.refresh(resume)

        return UploadResponse(
            message="Resume uploaded successfully",
            resume_id=resume.id,
            filename=resume.filename,
            file_type=resume.file_type,
        )
    except HTTPException:
        raise
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@router.post("/parse-text", response_model=ResumeResponse)
async def parse_resume_text(request: ResumeTextRequest, db: Session = Depends(get_db)):
    text = request.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Resume text is required")

    if len(text) < 20:
        raise HTTPException(status_code=400, detail="Please provide more resume content")

    unique_filename = f"{uuid.uuid4()}.txt"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    try:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(text)

        resume = Resume(
            filename=unique_filename,
            original_filename=request.original_filename or "pasted-resume.txt",
            file_path=file_path,
            file_size=len(text.encode("utf-8")),
            file_type="txt",
        )
        db.add(resume)
        db.commit()
        db.refresh(resume)

        parsed_dict = ResumeParser.parse(text)

        parsed_data = ParsedData(
            resume_id=resume.id,
            full_name=parsed_dict.get("full_name"),
            email=parsed_dict.get("email"),
            phone=parsed_dict.get("phone"),
            linkedin=parsed_dict.get("linkedin"),
            github=parsed_dict.get("github"),
            summary=parsed_dict.get("summary"),
            skills=parsed_dict.get("skills"),
            experience=parsed_dict.get("experience"),
            education=parsed_dict.get("education"),
            certifications=parsed_dict.get("certifications"),
            raw_text=parsed_dict.get("raw_text"),
        )
        db.add(parsed_data)

        ats_scorer = ATSScorer(parsed_dict)
        ats_result = ats_scorer.calculate_score()

        ats_score = ATSScore(
            resume_id=resume.id,
            overall_score=ats_result["overall_score"],
            format_score=ats_result["format_score"],
            content_score=ats_result["content_score"],
            keyword_score=ats_result["keyword_score"],
            readability_score=ats_result["readability_score"],
            section_score=ats_result["section_score"],
            feedback=ats_result["feedback"],
            suggestions=ats_result["suggestions"],
        )
        db.add(ats_score)

        resume.is_processed = True
        resume.processed_date = datetime.utcnow()
        resume.error_message = None
        db.commit()
        db.refresh(resume)

        return ResumeResponse.model_validate(resume)

    except HTTPException:
        raise
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Parsing failed: {str(e)}")



@router.post("/parse/{resume_id}", response_model=ResumeResponse)
async def parse_resume(resume_id: int, db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    if resume.is_processed:
        return ResumeResponse.model_validate(resume)

    try:
        raw_text = TextExtractor.extract(resume.file_path, resume.file_type)

        if not raw_text or len(raw_text.strip()) < 20:
            resume.is_processed = True
            resume.error_message = "Could not extract sufficient text from file"
            db.commit()
            raise HTTPException(status_code=400, detail="Could not extract sufficient text from file")

        parsed_dict = ResumeParser.parse(raw_text)

        parsed_data = ParsedData(
            resume_id=resume.id,
            full_name=parsed_dict.get("full_name"),
            email=parsed_dict.get("email"),
            phone=parsed_dict.get("phone"),
            linkedin=parsed_dict.get("linkedin"),
            github=parsed_dict.get("github"),
            summary=parsed_dict.get("summary"),
            skills=parsed_dict.get("skills"),
            experience=parsed_dict.get("experience"),
            education=parsed_dict.get("education"),
            certifications=parsed_dict.get("certifications"),
            raw_text=parsed_dict.get("raw_text"),
        )
        db.add(parsed_data)

        ats_scorer = ATSScorer(parsed_dict)
        ats_result = ats_scorer.calculate_score()

        ats_score = ATSScore(
            resume_id=resume.id,
            overall_score=ats_result["overall_score"],
            format_score=ats_result["format_score"],
            content_score=ats_result["content_score"],
            keyword_score=ats_result["keyword_score"],
            readability_score=ats_result["readability_score"],
            section_score=ats_result["section_score"],
            feedback=ats_result["feedback"],
            suggestions=ats_result["suggestions"],
        )
        db.add(ats_score)

        resume.is_processed = True
        resume.processed_date = datetime.utcnow()
        resume.error_message = None
        db.commit()
        db.refresh(resume)

        return ResumeResponse.model_validate(resume)

    except HTTPException:
        raise
    except Exception as e:
        resume.is_processed = True
        resume.error_message = str(e)
        db.commit()
        raise HTTPException(status_code=500, detail=f"Parsing failed: {str(e)}")


@router.get("/resumes/{resume_id}", response_model=ResumeResponse)
async def get_resume(resume_id: int, db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return ResumeResponse.model_validate(resume)


@router.get("/resumes", response_model=List[ResumeResponse])
async def list_resumes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    resumes = db.query(Resume).offset(skip).limit(limit).all()
    return [ResumeResponse.model_validate(r) for r in resumes]


@router.delete("/resumes/{resume_id}")
async def delete_resume(resume_id: int, db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    file_path = resume.file_path
    db.delete(resume)
    db.commit()

    if os.path.exists(file_path):
        os.remove(file_path)

    return {"message": "Resume deleted successfully"}
