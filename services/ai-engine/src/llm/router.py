from src.llm.providers.openrouter import OpenRouterProvider
from src.config import settings


class LLMRouter:
    def __init__(self):
        self._provider = None

    @property
    def provider(self):
        if self._provider is None:
            self._provider = OpenRouterProvider()
        return self._provider

    async def generate(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.3,
        max_tokens: int = 2048,
    ) -> str:
        return await self.provider.generate(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=temperature,
            max_tokens=max_tokens,
        )

    async def generate_section(
        self,
        section_type: str,
        country: str,
        committee: str,
        agenda: str,
        context: str,
    ) -> str:
        system_prompt = (
            "You are a MUN research assistant. Write a research section for "
            f"a report about {country} on {committee} discussing '{agenda}'. "
            "Use ONLY the provided context to generate content. "
            "Every factual claim MUST end with a citation in the format [Source Name, Year]. "
            "Do not make up facts or citations. If the context lacks information, say so. "
            "Write in clear, professional English suitable for a position paper."
        )

        user_prompt = (
            f"Section: {section_type}\n\n"
            f"Country: {country}\n"
            f"Committee: {committee}\n"
            f"Agenda: {agenda}\n\n"
            f"Retrieved Context:\n{context}\n\n"
            f"Generate a well-structured {section_type.replace('_', ' ')} section "
            f"with citations for every factual statement."
        )

        return await self.generate(system_prompt, user_prompt)


llm = LLMRouter()
