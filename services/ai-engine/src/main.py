import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.routes import router
from src.api.schemas import StatusResponse

_app_ready = False


def _warmup_embedding():
    from src.rag.embeddings import get_embedding_model
    try:
        get_embedding_model()
        print("[Startup] Embedding model loaded")
    except Exception as e:
        print(f"[Startup] Failed to load embedding model: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    global _app_ready
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, _warmup_embedding)
    asyncio.create_task(_run_scheduler())
    _app_ready = True
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
    title="GeMUNi AI Engine",
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
    if not _app_ready:
        from fastapi.responses import JSONResponse
        return JSONResponse(status_code=503, content={"status": "starting"})
    return {"status": "ok", "service": "gemuni-ai-engine"}


@app.get("/api/v1/research/{report_id}/status", response_model=StatusResponse)
async def get_status(report_id: str):
    return StatusResponse(status="completed", progress=100)
