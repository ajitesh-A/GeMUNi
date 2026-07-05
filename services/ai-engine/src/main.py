from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.routes import router
from src.api.schemas import StatusResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        from src.news.scheduler import refresh_news_cache
        import asyncio
        asyncio.create_task(_run_scheduler())
    except Exception:
        pass
    yield


async def _run_scheduler():
    from src.news.scheduler import refresh_news_cache

    while True:
        try:
            await refresh_news_cache()
        except Exception:
            pass
        import asyncio
        await asyncio.sleep(3600)


app = FastAPI(
    title="GeMUNi.ai AI Engine",
    description="AI-powered research engine for Model United Nations",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/v1")


@app.get("/health")
async def health():
    return {"status": "ok", "service": "gemuni-ai-engine"}


@app.get("/api/v1/research/{report_id}/status", response_model=StatusResponse)
async def get_status(report_id: str):
    return StatusResponse(status="completed", progress=100)
