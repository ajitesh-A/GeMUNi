import hashlib
from src.core.crawler import fetch_page, extract_text_simple

DIRECT_SOURCE_URLS = [
    "https://news.un.org/en/",
    "https://www.who.int/news-room",
    "https://www.amnesty.org/en/latest/",
    "https://www.hrw.org/news",
    "https://www.crisisgroup.org/latest-updates",
    "https://www.worldbank.org/en/news",
    "https://www.icrc.org/en/news",
    "https://www.transparency.org/en/news",
]


async def search_trusted_sources(
    country: str,
    agenda: str,
    domains: list[str] | None = None,
) -> list[dict]:
    return []


async def crawl_direct_sources(
    country: str,
    agenda: str,
) -> list[dict]:
    results = []
    for url in DIRECT_SOURCE_URLS[:5]:
        try:
            html = await fetch_page(url)
            if html:
                text = extract_text_simple(html)
                if text and len(text) > 200:
                    results.append({
                        "id": hashlib.md5(url.encode()).hexdigest(),
                        "url": url,
                        "domain": url.split("/")[2],
                        "content": text[:3000],
                        "title": text[:100],
                        "source_type": "direct",
                    })
        except Exception:
            continue
    return results
