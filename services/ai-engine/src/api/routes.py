import asyncio
from fastapi import APIRouter, HTTPException
from src.api.schemas import (
    GenerateRequest,
    GenerateResponse,
    ReportResult,
    ChatRequest,
    ChatResponse,
    CitationResult,
    SectionResult,
)
from src.core.pipeline import run_research_pipeline
from src.llm.router import llm

router = APIRouter()

_pipeline_results: dict[str, ReportResult | None] = {}


@router.post("/generate", response_model=GenerateResponse)
async def generate_research(req: GenerateRequest):
    _pipeline_results[req.report_id] = None
    asyncio.create_task(_run_pipeline(req))
    return GenerateResponse(report_id=req.report_id, status="processing")


async def _run_pipeline(req: GenerateRequest):
    try:
        result = await asyncio.wait_for(
            run_research_pipeline(
                country=req.country,
                committee=req.committee,
                agenda=req.agenda,
                report_id=req.report_id,
            ),
            timeout=120,
        )
        _pipeline_results[req.report_id] = result
        print(f"[Generate] Pipeline completed for {req.report_id}")
    except asyncio.TimeoutError:
        print(f"[Generate] Pipeline timed out for {req.report_id}")
        _pipeline_results[req.report_id] = ReportResult(
            report_id=req.report_id,
            country=req.country,
            committee=req.committee,
            agenda=req.agenda,
            sections=[
                SectionResult(
                    section_type="executive_summary",
                    content={"text": "The research pipeline timed out during source retrieval. The AI engine will still generate content based on general knowledge.\n\n**Note:** Citations may reference general sources rather than specific documents. Please verify facts independently."},
                    order_index=0,
                    citations=[],
                )
            ],
        )
    except Exception as e:
        print(f"[Generate] Pipeline failed: {e}")
        _pipeline_results[req.report_id] = ReportResult(
            report_id=req.report_id,
            country=req.country,
            committee=req.committee,
            agenda=req.agenda,
            sections=[
                SectionResult(
                    section_type="executive_summary",
                    content={"text": f"**Report Generation Note**\n\nThe research pipeline encountered an issue: {e}. The AI engine was unable to retrieve external sources. Please try again or check service configuration."},
                    order_index=0,
                    citations=[],
                )
            ],
        )


@router.get("/generate/{report_id}/result")
async def get_generate_result(report_id: str):
    result = _pipeline_results.get(report_id)
    if result is None:
        return {"status": "processing"}
    return result


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
