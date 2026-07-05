from fastapi import APIRouter, HTTPException
from src.api.schemas import (
    GenerateRequest,
    GenerateResponse,
    ChatRequest,
    ChatResponse,
    CitationResult,
)
from src.core.pipeline import run_research_pipeline
from src.llm.router import llm

router = APIRouter()


@router.post("/generate", response_model=GenerateResponse)
async def generate_research(req: GenerateRequest):
    try:
        from src.core.pipeline import run_research_pipeline

        result = await run_research_pipeline(
            country=req.country,
            committee=req.committee,
            agenda=req.agenda,
            report_id=req.report_id,
        )

        return GenerateResponse(
            report_id=result.report_id,
            status="completed",
        )
    except Exception as e:
        return GenerateResponse(
            report_id=req.report_id,
            status="failed",
        )


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    try:
        system_prompt = (
            "You are a MUN research assistant. Answer the user's question "
            "using ONLY the previously retrieved context for the report. "
            "Every factual claim must include a citation. "
            "If the context doesn't contain the answer, say so clearly."
        )

        response = await llm.generate(
            system_prompt=system_prompt,
            user_prompt=req.message,
            temperature=0.3,
        )

        return ChatResponse(
            response=response,
            citations=[
                CitationResult(
                    statement="",
                    url="",
                    source_name="Generated response",
                )
            ],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
