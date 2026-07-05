import hashlib
from src.core.crawler import fetch_page, extract_text_simple
from src.core.extractor import extract_relevant_sentences
from src.core.searcher import keyword_crawl_search, searxng_search, TRUSTED_SOURCE_URLS
from src.config import settings


async def search_trusted_sources(
    country: str,
    agenda: str,
    domains: list[str] | None = None,
) -> list[dict]:
    if settings.searxng_base_url:
        try:
            return await searxng_search(country, agenda, settings.searxng_base_url)
        except Exception as e:
            print(f"[Search] SearXNG search failed: {e}")

    try:
        print("[Search] Falling back to keyword crawl")
        return await keyword_crawl_search(country, agenda)
    except Exception as e:
        print(f"[Search] Keyword crawl also failed: {e}")
        return []


async def crawl_direct_sources(
    country: str,
    agenda: str,
) -> list[dict]:
    keywords = country.lower().split() + agenda.lower().split()
    results = []
    for url in TRUSTED_SOURCE_URLS[:4]:
        try:
            html = await fetch_page(url)
            if html:
                text = extract_text_simple(html)
                if text and len(text) > 200:
                    filtered = extract_relevant_sentences(text, keywords, max_sentences=15)
                    if len(filtered) < 100:
                        filtered = text[:2000]
                    results.append({
                        "id": hashlib.md5(url.encode()).hexdigest(),
                        "url": url,
                        "domain": url.split("/")[2],
                        "content": filtered[:3000],
                        "title": text[:100],
                        "source_type": "direct",
                    })
        except Exception:
            continue
    return results
