import asyncio
from src.core.summarizer import generate_section
from src.core.citation import get_source_name
from src.api.schemas import SectionResult, CitationResult

REPORT_SECTIONS = [
    "executive_summary",
    "country_profile",
    "agenda_background",
    "current_situation",
    "country_position",
    "un_resolutions",
    "speaking_points_and_bloc_positions",
    "possible_solutions",
]

MAX_CONCURRENT_LLM = 3


async def assemble_report(
    country: str,
    committee: str,
    agenda: str,
    sources: list[dict],
) -> list[SectionResult]:
    sem = asyncio.Semaphore(MAX_CONCURRENT_LLM)

    async def gen_section(idx: int, section_type: str) -> SectionResult:
        async with sem:
            try:
                content, context = await generate_section(
                    section_type=section_type,
                    country=country,
                    committee=committee,
                    agenda=agenda,
                )
            except Exception as e:
                print(f"[Reporter] Section '{section_type}' failed: {e}")
                content = f"**{section_type.replace('_', ' ').title()}**\n\nContent could not be generated for this section."

            citations = []
            for source in sources[:5]:
                citations.append(
                    CitationResult(
                        statement="",
                        url=source.get("url", ""),
                        source_name=get_source_name(source.get("url", "")),
                    )
                )

            return SectionResult(
                section_type=section_type,
                content={"text": content},
                order_index=idx,
                citations=citations,
            )

    tasks = [gen_section(idx, st) for idx, st in enumerate(REPORT_SECTIONS)]
    sections = await asyncio.gather(*tasks)

    sections.append(
        SectionResult(
            section_type="sources",
            content={
                "sources": [
                    {"url": s.get("url", ""), "title": s.get("title", "")}
                    for s in sources
                ]
            },
            order_index=len(REPORT_SECTIONS),
            citations=[],
        )
    )

    return sections
