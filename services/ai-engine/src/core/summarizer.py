from src.llm.router import llm
from src.rag.retriever import retrieve_context, format_context
from src.llm.prompts import SECTION_PROMPTS


async def generate_section(
    section_type: str,
    country: str,
    committee: str,
    agenda: str,
) -> tuple[str, str]:
    query = f"{country} {agenda} {section_type.replace('_', ' ')} {committee}"

    retrieved = retrieve_context(query)
    context = format_context(retrieved)

    section_prompt = SECTION_PROMPTS.get(
        section_type,
        "Write a section about {country}'s position on {agenda} in {committee}.",
    ).format(country=country, committee=committee, agenda=agenda)

    content = await llm.generate_section(
        section_type=section_type,
        country=country,
        committee=committee,
        agenda=agenda,
        context=context,
    )

    return content, context
