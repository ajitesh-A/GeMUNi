from src.llm.providers.groq import GroqProvider
from src.llm.providers.gemini import GeminiProvider
from src.llm.providers.openrouter import OpenRouterProvider
from src.config import settings


class LLMRouter:
    def __init__(self):
        self._groq = None
        self._gemini = None
        self._openrouter = None

    @property
    def groq(self):
        if self._groq is None:
            self._groq = GroqProvider()
        return self._groq

    @property
    def gemini(self):
        if self._gemini is None:
            self._gemini = GeminiProvider()
        return self._gemini

    @property
    def openrouter(self):
        if self._openrouter is None:
            self._openrouter = OpenRouterProvider()
        return self._openrouter

    async def generate(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.3,
        max_tokens: int = 2048,
    ) -> str:
        if settings.groq_api_key:
            try:
                return await self.groq.generate(
                    system_prompt=system_prompt,
                    user_prompt=user_prompt,
                    temperature=temperature,
                    max_tokens=max_tokens,
                )
            except Exception:
                pass

        if settings.gemini_api_key:
            try:
                return await self.gemini.generate(
                    system_prompt=system_prompt,
                    user_prompt=user_prompt,
                    temperature=temperature,
                    max_tokens=max_tokens,
                )
            except Exception:
                pass

        return await self.openrouter.generate(
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
