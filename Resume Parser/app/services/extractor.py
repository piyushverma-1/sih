import os
import io
import re
from typing import Optional
import PyPDF2
import pdfplumber
from docx import Document
from PIL import Image
import pytesseract
from app.config import settings


class TextExtractor:
    @staticmethod
    def extract_from_pdf(file_path: str) -> str:
        text = ""
        try:
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        except Exception:
            try:
                with open(file_path, "rb") as f:
                    pdf_reader = PyPDF2.PdfReader(f)
                    for page in pdf_reader.pages:
                        page_text = page.extract_text()
                        if page_text:
                            text += page_text + "\n"
            except Exception as e:
                raise Exception(f"Failed to extract PDF text: {str(e)}")
        return text.strip()

    @staticmethod
    def extract_from_docx(file_path: str) -> str:
        try:
            doc = Document(file_path)
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs if paragraph.text.strip()])
            return text.strip()
        except Exception as e:
            raise Exception(f"Failed to extract DOCX text: {str(e)}")

    @staticmethod
    def extract_from_image(file_path: str) -> str:
        try:
            image = Image.open(file_path)
            text = pytesseract.image_to_string(image)
            return text.strip()
        except Exception as e:
            raise Exception(f"Failed to extract image text: {str(e)}")

    @staticmethod
    def extract(file_path: str, file_type: str) -> str:
        file_type = file_type.lower()
        if file_type == "pdf":
            return TextExtractor.extract_from_pdf(file_path)
        elif file_type in ["docx", "doc"]:
            return TextExtractor.extract_from_docx(file_path)
        elif file_type in ["jpg", "jpeg", "png"]:
            return TextExtractor.extract_from_image(file_path)
        else:
            raise ValueError(f"Unsupported file type: {file_type}")
