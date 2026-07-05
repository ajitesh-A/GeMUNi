import httpx
from src.config import settings


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
        if not self.api_key:
            return self._mock_response(system_prompt, user_prompt)

        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{self.base_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": self.model,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                },
            )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]

    def _mock_response(self, system_prompt: str, user_prompt: str) -> str:
        return (
            "**Sample Research Content**\n\n"
            "This is placeholder content generated because no OpenRouter API key is configured. "
            "To get real AI-generated content:\n\n"
            "1. Sign up at https://openrouter.ai (free)\n"
            "2. Generate an API key\n"
            "3. Set OPENROUTER_API_KEY in your environment\n\n"
            "Once configured, the AI engine will:\n"
            "- Crawl trusted sources (UN, WHO, HRW, etc.)\n"
            "- Generate cited research summaries\n"
            "- Produce committee-specific reports\n"
            "- Every claim will include clickable citations [Source, Year]"
        )
