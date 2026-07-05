from src.core.summarizer import generate_section
from src.core.citation import format_citation, get_source_name
from src.api.schemas import SectionResult, CitationResult

REPORT_SECTIONS = [
    "executive_summary",
    "country_profile",
    "agenda_background",
    "current_situation",
    "country_position",
    "un_resolutions",
    "bloc_positions",
    "speaking_points",
    "possible_solutions",
    "questions_to_ask",
]


async def assemble_report(
    country: str,
    committee: str,
    agenda: str,
    sources: list[dict],
) -> list[SectionResult]:
    sections = []

    for idx, section_type in enumerate(REPORT_SECTIONS):
        content, context = await generate_section(
            section_type=section_type,
            country=country,
            committee=committee,
            agenda=agenda,
        )

        citations = []
        for source in sources[:5]:
            citations.append(
                CitationResult(
                    statement="",
                    url=source.get("url", ""),
                    source_name=get_source_name(source.get("url", "")),
                )
            )

        sections.append(
            SectionResult(
                section_type=section_type,
                content={"text": content},
                order_index=idx,
                citations=citations,
            )
        )

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
