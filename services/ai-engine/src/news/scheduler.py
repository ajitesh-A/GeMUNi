import hashlib
from src.rag.embeddings import embed_text
from src.rag.vector_store import store_embeddings
from src.news.rss_feeds import fetch_rss_feeds


async def refresh_news_cache():
    articles = await fetch_rss_feeds()

    if not articles:
        return

    texts = [a["content"] for a in articles if a.get("content")]
    if not texts:
        return

    embeddings_data = [{"text": t, "embedding": embed_text(t)} for t in texts]

    ids = [
        hashlib.md5(a["url"].encode()).hexdigest()
        for a in articles
        if a.get("content")
    ]
    metadatas = [
        {
            "title": a["title"],
            "url": a["url"],
            "published": a["published"],
            "category": a["category"],
            "type": "news",
        }
        for a in articles
        if a.get("content")
    ]

    if ids:
        store_embeddings(
            ids=ids,
            embeddings=[e["embedding"] for e in embeddings_data],
            metadatas=metadatas,
            documents=[e["text"] for e in embeddings_data],
            collection_name="gemuni_news",
        )
