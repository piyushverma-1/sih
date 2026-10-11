from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from app.config import settings
from app.database import engine, Base
from app.api import resumes
from app.models import Resume, ParsedData, ATSScore
from sqlalchemy.orm import Session


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Resume Parser API",
    description="Parse resumes and extract ATS score and skills",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")

app.include_router(resumes.router)


@app.get("/")
async def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/results/{resume_id}")
async def results_page(request: Request, resume_id: int):
    from app.database import SessionLocal
    db = SessionLocal()
    try:
        resume = db.query(Resume).filter(Resume.id == resume_id).first()
        if not resume:
            return templates.TemplateResponse("results.html", {
                "request": request,
                "error": "Resume not found"
            })

        parsed_data = db.query(ParsedData).filter(ParsedData.resume_id == resume_id).first()
        ats_score = db.query(ATSScore).filter(ATSScore.resume_id == resume_id).first()

        keywords = []
        if parsed_data and parsed_data.skills:
            keywords = [skill.strip() for skill in parsed_data.skills.split(',') if skill.strip()]
        if parsed_data and parsed_data.raw_text:
            import re
            text_lower = parsed_data.raw_text.lower()
            common_keywords = [
                "python", "java", "javascript", "sql", "aws", "docker", "git",
                "agile", "project management", "communication", "leadership",
                "team", "collaboration", "problem solving", "analysis", "design",
                "development", "testing", "deployment", "management", "react",
                "angular", "node.js", "django", "flask", "fastapi", "mongodb",
                "azure", "gcp", "kubernetes", "machine learning", "data analysis"
            ]
            for keyword in common_keywords:
                if keyword in text_lower and keyword not in keywords:
                    keywords.append(keyword)

        error = None
        if resume.error_message:
            error = resume.error_message

        return templates.TemplateResponse("results.html", {
            "request": request,
            "resume": resume,
            "parsed_data": parsed_data,
            "ats_score": ats_score,
            "keywords": keywords[:20],
            "error": error
        })
    finally:
        db.close()


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
