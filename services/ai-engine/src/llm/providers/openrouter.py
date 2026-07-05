import httpx
from src.config import settings

FREE_MODELS = [
    "meta-llama/llama-3.3-70b-instruct:free",
    "qwen/qwen2.5-72b-instruct:free",
    "mistralai/mistral-nemo:free",
]

MOCK_SECTIONS = {
    "executive_summary": (
        "**Executive Summary**\n\n"
        "This report examines the selected country's position on the agenda item within the "
        "designated UN committee. The country maintains a diplomatic approach focused on "
        "multilateral cooperation while prioritizing national interests.\n\n"
        "**Key Findings:**\n"
        "- The country has consistently engaged with this issue through UN mechanisms\n"
        "- Voting records indicate support for multilateral solutions\n"
        "- Regional alliances significantly influence the country's diplomatic stance\n"
        "- Economic considerations play a key role in policy formulation\n\n"
        "*Configure OPENROUTER_API_KEY for AI-generated content with real citations.*"
    ),
    "country_profile": (
        "**Country Profile**\n\n"
        "**Capital:** [Capital City]\n"
        "**Population:** [Data from UN Statistics]\n"
        "**Government:** [Government type]\n"
        "**Foreign Policy:** Non-alignment, multilateral cooperation\n"
        "**Key Alliances:** Regional organizations, UN membership\n\n"
        "The country is an active participant in UN forums and maintains diplomatic "
        "relations with major powers across all regions."
    ),
    "agenda_background": (
        "**Agenda Background**\n\n"
        "The selected agenda item represents a significant global challenge requiring "
        "coordinated international action. The issue has been on the UN agenda for "
        "several years, with multiple resolutions and frameworks established.\n\n"
        "**Timeline:**\n"
        "- Previous UN sessions have addressed this issue\n"
        "- Multiple resolutions have been adopted\n"
        "- International frameworks exist for cooperation\n\n"
        "The agenda item affects countries across all regions, with developing nations "
        "often bearing disproportionate impacts."
    ),
    "current_situation": (
        "**Current Situation**\n\n"
        "The current state of affairs regarding this agenda item involves ongoing "
        "international efforts and remaining challenges. Recent developments include "
        "new policy initiatives, diplomatic engagements, and evolving positions.\n\n"
        "**Recent Developments:**\n"
        "- Ongoing multilateral discussions\n"
        "- New policy proposals from member states\n"
        "- Continued implementation of existing frameworks\n"
        "- Emerging challenges requiring attention"
    ),
    "country_position": (
        "**Country Position**\n\n"
        "The country has articulated its position through official statements, UN "
        "speeches, and diplomatic engagements. The position emphasizes:\n\n"
        "- Support for international cooperation frameworks\n"
        "- Respect for national sovereignty\n"
        "- Equitable burden-sharing among member states\n"
        "- Development-focused approaches to global challenges\n\n"
        "Voting records show consistent support for resolutions aligned with these principles."
    ),
    "un_resolutions": (
        "**UN Resolutions**\n\n"
        "Several key UN resolutions address this agenda item. The country has "
        "participated actively in resolution negotiations and voting.\n\n"
        "**Key Resolutions:**\n"
        "- UN Resolution on international cooperation (voted in favor)\n"
        "- Resolution on capacity building (co-sponsored)\n"
        "- Framework resolution on sustainable development (supported)\n\n"
        "The country's voting record demonstrates commitment to multilateral solutions."
    ),
    "bloc_positions": (
        "**Bloc Positions**\n\n"
        "**Likely Allies:** Countries with aligned voting records, shared regional "
        "interests, and similar development priorities.\n\n"
        "**Likely Opponents:** States with divergent policy approaches or competing "
        "geopolitical interests.\n\n"
        "**Non-Aligned:** Several states may remain uncommitted, presenting opportunities "
        "for diplomatic engagement and coalition building."
    ),
    "speaking_points": (
        "**Speaking Points**\n\n"
        "• Our delegation reaffirms commitment to international cooperation\n"
        "• National sovereignty must be respected in all frameworks\n"
        "• Developing nations require equitable resources and representation\n"
        "• Sustainable solutions must address root causes\n"
        "• We call for consensus-based decision making\n\n"
        "**Anticipated Questions:**\n"
        "- How does your position align with previous voting records?\n"
        "- What specific resources is your country committing?\n"
        "- How do you address concerns about implementation?"
    ),
    "possible_solutions": (
        "**Possible Solutions**\n\n"
        "1. **Strengthened Multilateral Framework** — Enhance cooperation through "
        "existing UN mechanisms\n\n"
        "2. **Capacity Building** — Support developing nations in implementation\n\n"
        "3. **Inclusive Dialogue** — Establish consultations with all stakeholders\n\n"
        "4. **Monitoring Mechanisms** — Transparent reporting systems for accountability\n\n"
        "5. **Resource Mobilization** — Equitable distribution of financial and technical resources"
    ),
    "questions_to_ask": (
        "**Questions to Ask**\n\n"
        "Suggested questions for other delegations:\n\n"
        "1. What specific measures has your country implemented to address this issue?\n"
        "2. How does your proposed solution account for differing levels of development?\n"
        "3. What monitoring mechanisms do you support for implementation?\n"
        "4. How does your position align with existing international frameworks?\n"
        "5. What resources is your delegation prepared to commit?"
    ),
}


class OpenRouterProvider:
    def __init__(self):
        self.api_key = settings.openrouter_api_key
        self.base_url = settings.openrouter_base_url
        self.model = settings.llm_model

    async def generate(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.3,
        max_tokens: int = 2048,
    ) -> str:
        models_to_try = [self.model] + [m for m in FREE_MODELS if m != self.model]

        for model in models_to_try:
            try:
                return await self._try_generate(
                    model, system_prompt, user_prompt, temperature, max_tokens
                )
            except Exception:
                continue

        return self._mock_response(system_prompt, user_prompt)

    async def _try_generate(
        self,
        model: str,
        system_prompt: str,
        user_prompt: str,
        temperature: float,
        max_tokens: int,
    ) -> str:
        if not self.api_key:
            raise ValueError("No API key")

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                f"{self.base_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": model,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                },
            )

            if response.status_code in (402, 429):
                raise ValueError(f"OpenRouter {response.status_code}")

            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]

    def _mock_response(self, system_prompt: str, user_prompt: str) -> str:
        for section_type, content in MOCK_SECTIONS.items():
            if section_type in user_prompt.lower():
                return content
        return MOCK_SECTIONS["executive_summary"]
