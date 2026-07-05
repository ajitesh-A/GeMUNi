import asyncio
import hashlib
from datetime import datetime, timezone

from src.core.search import search_trusted_sources, crawl_direct_sources
from src.core.ranker import rank_sources
from src.core.dedup import deduplicate_sources
from src.core.reporter import assemble_report
from src.rag.embeddings import embed_texts
from src.rag.vector_store import store_embeddings
from src.api.schemas import ReportResult, SectionResult


async def run_research_pipeline(
    country: str,
    committee: str,
    agenda: str,
    report_id: str,
    progress_callback=None,
) -> ReportResult:
    ranked = []
    sections: list[SectionResult] = []

    try:
        trusted = await asyncio.wait_for(
            search_trusted_sources(country, agenda), timeout=20
        )
    except Exception as e:
        print(f"[Pipeline] search_trusted_sources failed: {e}")
        trusted = []

    try:
        direct = await asyncio.wait_for(
            crawl_direct_sources(country, agenda), timeout=20
        )
    except Exception as e:
        print(f"[Pipeline] crawl_direct_sources failed: {e}")
        direct = []

    all_sources = deduplicate_sources(trusted + direct)
    ranked = rank_sources(all_sources, f"{country} {agenda}")

    if ranked:
        try:
            texts = [s["content"] for s in ranked[:20]]
            ids = [
                hashlib.md5(f"{s['domain']}:{i}".encode()).hexdigest()
                for i, s in enumerate(ranked[:20])
            ]
            metadatas = [
                {
                    "url": s["url"],
                    "domain": s["domain"],
                    "source_name": s.get("source_name", s["domain"]),
                    "country": country,
                    "committee": committee,
                    "agenda": agenda,
                    "crawled_at": datetime.now(timezone.utc).isoformat(),
                }
                for s in ranked[:20]
            ]

            embeddings = embed_texts(texts)
            store_embeddings(
                ids=ids,
                embeddings=embeddings,
                metadatas=metadatas,
                documents=texts,
            )
        except Exception as e:
            print(f"[Pipeline] embed/store failed: {e}")

    try:
        sections = await asyncio.wait_for(
            assemble_report(country, committee, agenda, ranked), timeout=90
        )
    except Exception as e:
        print(f"[Pipeline] assemble_report failed/timed out: {e}")
        sections = _fallback_sections()

    return ReportResult(
        report_id=report_id,
        country=country,
        committee=committee,
        agenda=agenda,
        sections=sections,
    )


def _fallback_sections() -> list[SectionResult]:
    return [
        SectionResult(
            section_type="executive_summary",
            content={"text": "Research report generated. The AI engine could not retrieve external sources in time, but the platform structure is ready. Configure OpenRouter API key and try again for full AI-generated content with citations."},
            order_index=0,
            citations=[],
        ),
        SectionResult(
            section_type="sources",
            content={"sources": []},
            order_index=8,
            citations=[],
        ),
    ]
