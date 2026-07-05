import httpx
from src.config import settings

GEMINI_MODEL = "gemini-2.0-flash"


class GeminiProvider:
    def __init__(self):
        self.api_key = settings.gemini_api_key

    async def generate(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.3,
        max_tokens: int = 2048,
    ) -> str:
        if not self.api_key:
            raise ValueError("No Gemini API key")

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={self.api_key}"

        body = {
            "system_instruction": {
                "parts": [{"text": system_prompt}]
            },
            "contents": [
                {
                    "parts": [{"text": user_prompt}]
                }
            ],
            "generationConfig": {
                "temperature": temperature,
                "maxOutputTokens": max_tokens,
            },
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, json=body)

            if response.status_code == 429:
                raise ValueError("Gemini rate limited")

            response.raise_for_status()
            data = response.json()

            candidates = data.get("candidates", [])
            if not candidates:
                raise ValueError("No candidates returned from Gemini")

            return candidates[0]["content"]["parts"][0]["text"]
