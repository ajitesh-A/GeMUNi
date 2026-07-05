from src.rag.embeddings import embed_text
from src.rag.vector_store import query_similar
from src.config import settings


def retrieve_context(
    query: str,
    n_results: int = 10,
) -> list[dict]:
    query_embedding = embed_text(query)
    results = query_similar(
        query_embedding=query_embedding,
        n_results=min(n_results, settings.max_sources_per_section),
    )
    return results


def format_context(results: list[dict]) -> str:
    formatted = []
    for i, r in enumerate(results, 1):
        source = r["metadata"].get("source_name", "Unknown")
        url = r["metadata"].get("url", "")
        formatted.append(
            f"[Source {i}] {r['content'][:500]}...\n"
            f"  Source: {source} ({url})\n"
        )
    return "\n".join(formatted)
