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
    "agenda_overview": (
        "Write an agenda overview on '{agenda}' using bullet points and "
        "short sections. Include: issue history, timeline of key events, "
        "affected countries and regions, key organizations involved, "
        "relevant statistics, current challenges, and recent developments. "
        "Use **bold** sub-headings to separate 'Background' and 'Current Situation'."
    ),
    "country_position": (
        "Describe {country}'s official position on '{agenda}' and list relevant "
        "UN resolutions. Use **bold** sub-headings to separate two sections:\n\n"
        "**Country Position:** Official statements, UN speeches and voting records, "
        "recent policy actions, and diplomatic initiatives.\n\n"
        "**UN Resolutions:** Resolution numbers and titles, voting record "
        "(especially {country}'s vote), sponsors, and implementation status."
    ),
    "speaking_points_and_strategies": (
        "Generate speaking points, bloc positions, and possible solutions "
        "for {country} on '{agenda}'. Use **bold** sub-headings to separate:\n\n"
        "**Bloc Positions:** Likely allies, opponents, non-aligned states.\n\n"
        "**Speaking Points:** Strong arguments, counterarguments, responses.\n\n"
        "**Proposed Solutions:** Policy recommendations, diplomatic initiatives, "
        "potential resolution clauses, and implementation strategies."
    ),
}
