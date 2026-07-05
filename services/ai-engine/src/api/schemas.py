from pydantic import BaseModel, HttpUrl
from typing import Optional


class GenerateRequest(BaseModel):
    country: str
    committee: str
    agenda: str
    report_id: str


class GenerateResponse(BaseModel):
    report_id: str
    status: str


class SourceResult(BaseModel):
    url: str
    domain: str
    title: str
    content: str
    source_type: str
    relevance_score: float


class CitationResult(BaseModel):
    statement: str
    url: str
    source_name: str


class SectionResult(BaseModel):
    section_type: str
    content: dict
    order_index: int
    citations: list[CitationResult]


class ReportResult(BaseModel):
    report_id: str
    country: str
    committee: str
    agenda: str
    sections: list[SectionResult]


class ChatRequest(BaseModel):
    report_id: str
    message: str
    context: str = ""
    country: str = ""
    committee: str = ""
    agenda: str = ""


class ChatResponse(BaseModel):
    response: str
    citations: list[CitationResult]


class StatusResponse(BaseModel):
    status: str
    progress: int
