from typing import Dict, List, Tuple, Optional
import re
from app.services.parser import ResumeParser


class ATSScorer:
    def __init__(self, parsed_data: Dict[str, Optional[str]]):
        self.parsed_data = parsed_data
        self.raw_text = parsed_data.get("raw_text", "")
        self.weights = {
            "format": 0.20,
            "content": 0.30,
            "keyword": 0.25,
            "readability": 0.15,
            "section": 0.10,
        }

    def calculate_score(self) -> Dict:
        format_score = self._score_format()
        content_score = self._score_content()
        keyword_score = self._score_keywords()
        readability_score = self._score_readability()
        section_score = self._score_sections()

        overall = (
            format_score * self.weights["format"]
            + content_score * self.weights["content"]
            + keyword_score * self.weights["keyword"]
            + readability_score * self.weights["readability"]
            + section_score * self.weights["section"]
        )

        feedback, suggestions = self._generate_feedback(
            format_score, content_score, keyword_score, readability_score, section_score
        )

        return {
            "overall_score": round(overall, 2),
            "format_score": round(format_score, 2),
            "content_score": round(content_score, 2),
            "keyword_score": round(keyword_score, 2),
            "readability_score": round(readability_score, 2),
            "section_score": round(section_score, 2),
            "feedback": feedback,
            "suggestions": suggestions,
        }

    def _score_format(self) -> float:
        score = 100.0
        if not self.raw_text:
            return 0.0
        lines = self.raw_text.split('\n')
        if len(lines) < 10:
            score -= 20
        if self.raw_text.count('\n') < 15:
            score -= 10
        if len(self.raw_text) < 200:
            score -= 20
        return max(0.0, score)

    def _score_content(self) -> float:
        score = 0.0
        fields = ["full_name", "email", "phone", "skills", "experience", "education"]
        present = sum(1 for field in fields if self.parsed_data.get(field))
        score = (present / len(fields)) * 100
        return score

    def _score_keywords(self) -> float:
        if not self.raw_text:
            return 0.0
        common_keywords = [
            "python", "java", "javascript", "sql", "aws", "docker", "git",
            "agile", "project management", "communication", "leadership",
            "team", "collaboration", "problem solving", "analysis", "design",
            "development", "testing", "deployment", "management"
        ]
        text_lower = self.raw_text.lower()
        matches = sum(1 for keyword in common_keywords if keyword in text_lower)
        score = min(100.0, (matches / len(common_keywords)) * 100)
        return score

    def _score_readability(self) -> float:
        if not self.raw_text:
            return 0.0
        words = self.raw_text.split()
        if not words:
            return 0.0
        sentences = re.split(r'[.!?]+', self.raw_text)
        sentences = [s.strip() for s in sentences if s.strip()]
        if not sentences:
            return 50.0
        avg_sentence_length = len(words) / len(sentences)
        if avg_sentence_length > 30:
            return 40.0
        elif avg_sentence_length > 20:
            return 60.0
        elif avg_sentence_length > 15:
            return 80.0
        else:
            return 90.0

    def _score_sections(self) -> float:
        if not self.raw_text:
            return 0.0
        text_lower = self.raw_text.lower()
        sections = ["summary", "experience", "education", "skills", "certifications"]
        present = sum(1 for section in sections if section in text_lower)
        score = (present / len(sections)) * 100
        return score

    def _generate_feedback(
        self, format_score: float, content_score: float,
        keyword_score: float, readability_score: float, section_score: float
    ) -> Tuple[str, str]:
        feedback_parts = []
        suggestion_parts = []

        if format_score < 70:
            feedback_parts.append("Format needs improvement")
            suggestion_parts.append("Add clear section headers and consistent formatting")
        if content_score < 70:
            feedback_parts.append("Missing key information")
            suggestion_parts.append("Include contact details, work experience, and education")
        if keyword_score < 60:
            feedback_parts.append("Limited industry keywords detected")
            suggestion_parts.append("Add more relevant skills and keywords for your target role")
        if readability_score < 70:
            feedback_parts.append("Readability could be better")
            suggestion_parts.append("Use shorter sentences and bullet points for clarity")
        if section_score < 70:
            feedback_parts.append("Missing important sections")
            suggestion_parts.append("Include Summary, Experience, Education, and Skills sections")

        if not feedback_parts:
            feedback = "Excellent resume structure and content!"
            suggestions = "Keep up the great work!"
        else:
            feedback = ". ".join(feedback_parts) + "."
            suggestions = ". ".join(suggestion_parts) + "."

        return feedback, suggestions
