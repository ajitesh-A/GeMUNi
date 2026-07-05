from fastapi import APIRouter, HTTPException
from src.api.schemas import (
    GenerateRequest,
    GenerateResponse,
    ReportResult,
    ChatRequest,
    ChatResponse,
    CitationResult,
)
from src.core.pipeline import run_research_pipeline
from src.llm.router import llm

router = APIRouter()


@router.post("/generate", response_model=ReportResult)
async def generate_research(req: GenerateRequest):
    try:
        result = await run_research_pipeline(
            country=req.country,
            committee=req.committee,
            agenda=req.agenda,
            report_id=req.report_id,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    try:
        context_text = req.context
        country = req.country
        committee = req.committee
        agenda = req.agenda

        if context_text:
            system_prompt = (
                "You are a MUN research assistant. Answer the user's question "
                "using ONLY the report sections below. Every factual claim must "
                "include a citation. If the provided context doesn't contain the "
                "answer, say so clearly.\n\n"
                f"**Report:** {country} · {committee} · {agenda}\n\n"
                "**Report Sections:**\n"
                f"{context_text}"
            )
        else:
            system_prompt = (
                "You are a MUN research assistant. Answer the user's question "
                f"about {country} in {committee} on '{agenda}'. "
                "Every factual claim must include a citation. "
                "If you don't know the answer, say so clearly."
            )

        user_prompt = (
            f"**Report:** {country} · {committee} · *{agenda}*\n\n"
            f"**Question:** {req.message}\n\n"
            "Answer based on the provided report sections. Use bullet points "
            "where appropriate and cite sources when possible."
        )

        response = await llm.generate(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
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
