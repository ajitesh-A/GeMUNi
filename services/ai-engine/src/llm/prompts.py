SYSTEM_PROMPT_TEMPLATE = (
    "You are a MUN research assistant specializing in international relations. "
    "You generate source-backed research reports for Model United Nations delegates. "
    "Rules:\n"
    "1. Use ONLY the provided context to generate content\n"
    "2. Every factual statement MUST end with a citation: [Source Name, Year]\n"
    "3. Never fabricate facts, statistics, or citations\n"
    "4. If the context doesn't contain enough information, state this clearly\n"
    "5. Maintain a neutral, diplomatic tone\n"
    "6. Format citations as clickable references"
)

SECTION_PROMPTS = {
    "executive_summary": (
        "Write a concise executive summary covering the most critical aspects "
        "of {country}'s position on {agenda} in {committee}. Use bullet points "
        "for key findings and recommendations. Include key statistics, "
        "the country's stance, and main recommendations."
    ),
    "country_profile": (
        "Create a country profile for {country} relevant to {agenda}. Use "
        "**key-value format** with **bold** labels. Include: capital, population, GDP, "
        "government type, foreign policy orientation, key alliances, "
        "and UN memberships. Focus on aspects relevant to the agenda."
    ),
    "agenda_background": (
        "Write a background section on '{agenda}' using bullet points and "
        "short sections. Include: issue history, timeline of key events, "
        "affected countries and regions, key organizations involved, "
        "relevant statistics, and current challenges."
    ),
    "current_situation": (
        "Describe the current situation regarding '{agenda}' using bullet points. "
        "Focus on recent developments, ongoing challenges, and the current state "
        "of affairs. Include recent data and reports."
    ),
    "country_position": (
        "Describe {country}'s official position on '{agenda}' using bullet points. "
        "Include: official statements, UN speeches and voting records, "
        "recent policy actions, and diplomatic initiatives. "
        "Cite specific UN documents and statements where possible."
    ),
    "un_resolutions": (
        "List relevant UN resolutions related to '{agenda}' as bullet points. "
        "For each resolution include: resolution number and title, "
        "voting record (especially {country}'s vote), sponsors, "
        "and implementation status."
    ),
    "bloc_positions": (
        "Describe the likely bloc positions on '{agenda}' using sections with "
        "**bold** sub-headings. Identify: likely allies for {country}, "
        "likely opponents, non-aligned states, and regional bloc positions. "
        "Explain the reasoning behind each bloc's position."
    ),
    "speaking_points": (
        "Generate debate-ready speaking points for {country} on '{agenda}' as "
        "bullet points. Include: strong arguments supporting {country}'s position, "
        "likely counterarguments from opponents, and suggested responses."
    ),
    "questions_to_ask": (
        "Generate strategic questions that {country} can ask other delegations "
        "during committee sessions on '{agenda}' as numbered bullet points. "
        "Questions should challenge opposing positions "
        "and advance {country}'s diplomatic objectives."
    ),
    "possible_solutions": (
        "Propose possible solutions to '{agenda}' that align with {country}'s "
        "position. Use numbered bullet points. Include: policy recommendations, "
        "diplomatic initiatives, potential resolution clauses, "
        "and implementation strategies."
    ),
}
