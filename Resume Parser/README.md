# InternShala

A simple resume analyzer where users can **upload a resume**, view the extracted **skills**, and see an **ATS score** with feedback.

## Features

- Upload resumes in **PDF**, **DOCX**, or **image** formats
- Extracted **skills** from resume content
- **ATS score** with breakdown and suggestions

## Tech Stack

### Backend
- **FastAPI** - web framework and routing
- **SQLAlchemy 2.x** - ORM and database access
- **SQLite** - default database
- **Pydantic / Pydantic Settings** - request/response validation and config
- **pdfplumber** - primary PDF text extraction
- **PyPDF2** - PDF fallback extraction
- **python-docx** - DOCX text extraction
- **pytesseract + Pillow** - OCR for image resumes
- **Uvicorn** - ASGI server

### Frontend
- **Jinja2 templates** - server-rendered pages
- **Vanilla CSS** - simple centered upload UI
- **Vanilla JavaScript** - upload interactions and API calls

## Project Structure

```
Resume Parser/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── api/
│   │   ├── __init__.py
│   │   └── resumes.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── extractor.py
│   │   ├── parser.py
│   │   └── ats_score.py
│   ├── templates/
│   │   ├── base.html
│   │   ├── index.html
│   │   └── results.html
│   └── static/
│       ├── css/
│       │   └── style.css
│       └── js/
│           └── app.js
├── requirements.txt
├── .env.example
└── README.md
```

## Getting Started

### Prerequisites
- Python 3.9+
- pip
- Optional: Tesseract OCR for image resume support

### Installation

```bash
cd "C:\Users\Codex\OneDrive\Documents\Projects\Resume Parser"
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Configure `.env` as needed. Defaults are already set for local development.

### Run

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Then open:
- `http://localhost:8000/` - upload resume
- `http://localhost:8000/results/{id}` - view ATS score and skills
- `http://localhost:8000/docs` - API docs

## How It Works

1. User uploads a resume file.
2. Backend extracts text from the file.
3. Parser extracts skills from the text.
4. ATS scorer computes an overall score with feedback.
5. Frontend shows skills and ATS score.

## API Overview

### Upload Resume
```http
POST /api/v1/upload
Content-Type: multipart/form-data

file: <upload file>
```

### Parse Uploaded Resume
```http
POST /api/v1/parse/{resume_id}
```

### Get Result
```http
GET /api/v1/resumes/{resume_id}
```

## ATS Scoring

The ATS score evaluates resumes across multiple dimensions:
- **Format** - structure, length, clarity
- **Content** - presence of key resume fields
- **Keywords** - industry-relevant keyword coverage
- **Readability** - sentence structure and length
- **Sections** - required sections presence

Each dimension contributes to an overall score with actionable feedback and suggestions.

## Database

Default database is SQLite stored locally. You can switch databases by updating `DATABASE_URL` in `.env`:

```env
DATABASE_URL=postgresql://user:password@localhost/dbname
```

Key tables:
- `resumes` - uploaded file metadata
- `parsed_data` - extracted resume fields
- `ats_scores` - ATS scoring results

## Notes

- Image OCR requires Tesseract installed on the host system.
- Parser uses regex-based extraction by default.
- If port `8000` is in use, use another port like `8001`.

## License

MIT License