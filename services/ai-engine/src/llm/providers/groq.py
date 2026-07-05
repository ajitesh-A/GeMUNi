import httpx
from src.config import settings

GROQ_MODELS = [
    "llama-3.1-8b-instant",
    "llama-3.3-70b-versatile",
]


class GroqProvider:
    def __init__(self):
        self.api_key = settings.groq_api_key

    async def generate(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.3,
        max_tokens: int = 2048,
    ) -> str:
        if not self.api_key:
            raise ValueError("No Groq API key")

        models_to_try = GROQ_MODELS

        for model in models_to_try:
            try:
                return await self._try_generate(
                    model, system_prompt, user_prompt, temperature, max_tokens
                )
            except Exception as e:
                print(f"[Groq] Model {model} failed: {e}")

        print("[Groq] All models failed")
        raise ValueError("All Groq models failed")

    async def _try_generate(
        self,
        model: str,
        system_prompt: str,
        user_prompt: str,
        temperature: float,
        max_tokens: int,
    ) -> str:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
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

            if response.status_code == 429:
                raise ValueError("Groq rate limited")

            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
