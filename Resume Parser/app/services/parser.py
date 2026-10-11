import re
from typing import Dict, Optional, List
from app.services.extractor import TextExtractor


class ResumeParser:
    EMAIL_PATTERN = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    PHONE_PATTERN = r'(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8]{2})\)\s*|[2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8]{2})\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?'
    LINKEDIN_PATTERN = r'(?:https?://)?(?:www\.)?linkedin\.com/in/([a-zA-Z0-9-]+)'
    GITHUB_PATTERN = r'(?:https?://)?(?:www\.)?github\.com/([a-zA-Z0-9-]+)'

    @staticmethod
    def parse(text: str) -> Dict[str, Optional[str]]:
        if not text:
            raise ValueError("Empty text provided for parsing")

        email = ResumeParser._extract_email(text)
        phone = ResumeParser._extract_phone(text)
        linkedin = ResumeParser._extract_linkedin(text)
        github = ResumeParser._extract_github(text)
        name = ResumeParser._extract_name(text)
        skills = ResumeParser._extract_skills(text)
        summary = ResumeParser._extract_summary(text)
        experience = ResumeParser._extract_experience(text)
        education = ResumeParser._extract_education(text)
        certifications = ResumeParser._extract_certifications(text)

        return {
            "full_name": name,
            "email": email,
            "phone": phone,
            "linkedin": linkedin,
            "github": github,
            "summary": summary,
            "skills": skills,
            "experience": experience,
            "education": education,
            "certifications": certifications,
            "raw_text": text,
        }

    @staticmethod
    def _extract_email(text: str) -> Optional[str]:
        emails = re.findall(ResumeParser.EMAIL_PATTERN, text)
        return emails[0] if emails else None

    @staticmethod
    def _extract_phone(text: str) -> Optional[str]:
        phones = re.findall(ResumeParser.PHONE_PATTERN, text)
        if phones:
            phone = "".join(phones[0])
            return phone if len(phone) >= 10 else None
        return None

    @staticmethod
    def _extract_linkedin(text: str) -> Optional[str]:
        match = re.search(ResumeParser.LINKEDIN_PATTERN, text, re.IGNORECASE)
        if match:
            username = match.group(1)
            return f"https://www.linkedin.com/in/{username}"
        return None

    @staticmethod
    def _extract_github(text: str) -> Optional[str]:
        match = re.search(ResumeParser.GITHUB_PATTERN, text, re.IGNORECASE)
        if match:
            username = match.group(1)
            return f"https://github.com/{username}"
        return None

    @staticmethod
    def _extract_name(text: str) -> Optional[str]:
        lines = text.split('\n')
        for line in lines[:10]:
            line = line.strip()
            if line and len(line.split()) >= 2 and len(line.split()) <= 5:
                if re.match(r'^[A-Za-z\s\.\-]+$', line):
                    if not re.search(r'@|\.com|phone|email|\d{3}', line, re.IGNORECASE):
                        return line
        return None

    @staticmethod
    def _extract_skills(text: str) -> Optional[str]:
        skill_keywords = [
            "python", "java", "javascript", "typescript", "react", "angular", "vue",
            "node.js", "django", "flask", "fastapi", "sql", "mysql", "postgresql",
            "mongodb", "aws", "azure", "gcp", "docker", "kubernetes", "git",
            "machine learning", "deep learning", "tensorflow", "pytorch", "nlp",
            "data analysis", "tableau", "power bi", "excel", "rest api", "graphql",
            "microservices", "ci/cd", "agile", "scrum", "project management",
            "c++", "c#", "ruby", "go", "rust", "kotlin", "swift", "php", "r"
        ]
        found_skills = []
        text_lower = text.lower()
        for skill in skill_keywords:
            if skill in text_lower:
                found_skills.append(skill)

        skills_section = ResumeParser._extract_section(text, ["skills", "technical skills", "competencies"])
        if skills_section:
            skills_section_clean = re.sub(r'^.*?(?=skills|technical)', '', skills_section, flags=re.IGNORECASE)
            return skills_section_clean.strip() if skills_section_clean else ", ".join(found_skills) if found_skills else None

        return ", ".join(found_skills) if found_skills else None

    @staticmethod
    def _extract_summary(text: str) -> Optional[str]:
        summary = ResumeParser._extract_section(text, ["summary", "profile", "objective", "about"])
        return summary[:500] if summary else None

    @staticmethod
    def _extract_experience(text: str) -> Optional[str]:
        experience = ResumeParser._extract_section(text, ["experience", "work experience", "employment history", "professional experience"])
        return experience[:1000] if experience else None

    @staticmethod
    def _extract_education(text: str) -> Optional[str]:
        education = ResumeParser._extract_section(text, ["education", "academic background", "qualifications"])
        return education[:800] if education else None

    @staticmethod
    def _extract_certifications(text: str) -> Optional[str]:
        certifications = ResumeParser._extract_section(text, ["certifications", "certificates", "credentials"])
        return certifications[:500] if certifications else None

    @staticmethod
    def _extract_section(text: str, keywords: List[str]) -> Optional[str]:
        lines = text.split('\n')
        capture = False
        section_text = []
        next_section_headers = [
            "experience", "education", "skills", "certifications", "projects",
            "summary", "profile", "objective", "about", "contact", "references"
        ]

        for line in lines:
            line_lower = line.lower().strip()
            if any(keyword in line_lower for keyword in keywords):
                capture = True
                continue
            if capture:
                if any(header in line_lower for header in next_section_headers):
                    break
                section_text.append(line)

        return "\n".join(section_text).strip() if section_text else None
