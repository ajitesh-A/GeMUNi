from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://gemuni:gemuni_dev@localhost:5432/gemuni"
    redis_url: str = "redis://localhost:6379/0"
    chroma_persist_dir: str = "./chroma_data"
    groq_api_key: str = ""
    gemini_api_key: str = ""
    searxng_base_url: str = ""
    openrouter_api_key: str = ""
    openrouter_base_url: str = "https://openrouter.ai/api/v1"
    llm_model: str = "meta-llama/llama-3.3-70b-instruct:free"
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    max_sources_per_section: int = 10
    report_timeout_seconds: int = 120

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
