import asyncio
import hashlib
from datetime import datetime

from src.core.search import search_trusted_sources, crawl_direct_sources
from src.core.ranker import rank_sources
from src.core.dedup import deduplicate_sources
from src.core.reporter import assemble_report
from src.rag.embeddings import embed_texts
from src.rag.vector_store import store_embeddings
from src.api.schemas import ReportResult


async def run_research_pipeline(
    country: str,
    committee: str,
    agenda: str,
    report_id: str,
    progress_callback=None,
) -> ReportResult:
    if progress_callback:
        await progress_callback(5, "Searching trusted sources")

    trusted = await search_trusted_sources(country, agenda)
    if progress_callback:
        await progress_callback(20, "Crawling direct sources")

    direct = await crawl_direct_sources(country, agenda)
    if progress_callback:
        await progress_callback(35, "Ranking and deduplicating sources")

    all_sources = deduplicate_sources(trusted + direct)
    ranked = rank_sources(all_sources, f"{country} {agenda}")
    if progress_callback:
        await progress_callback(50, "Generating embeddings")

    if ranked:
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
                "crawled_at": datetime.utcnow().isoformat(),
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

    if progress_callback:
        await progress_callback(65, "Generating report sections")

    sections = await assemble_report(country, committee, agenda, ranked)

    if progress_callback:
        await progress_callback(95, "Finalizing report")

    return ReportResult(
        report_id=report_id,
        country=country,
        committee=committee,
        agenda=agenda,
        sections=sections,
    )
