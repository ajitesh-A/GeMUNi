import hashlib
import httpx
from src.core.crawler import fetch_page, extract_text_simple, extract_links
from src.core.extractor import extract_relevant_sentences

TRUSTED_DOMAINS = [
    "un.org", "who.int", "amnesty.org", "hrw.org", "crisisgroup.org",
    "worldbank.org", "icrc.org", "transparency.org", "unicef.org",
    "ohchr.org", "undp.org", "unep.org", "ipcc.ch", "refworld.org",
    "iom.int", "ifrc.org",
]

TRUSTED_SOURCE_URLS = [
    "https://news.un.org/en/",
    "https://www.who.int/news-room",
    "https://www.amnesty.org/en/latest/",
    "https://www.hrw.org/news",
    "https://www.crisisgroup.org/latest-updates",
    "https://www.worldbank.org/en/news",
    "https://www.icrc.org/en/news",
    "https://www.transparency.org/en/news",
    "https://www.unicef.org/press-releases",
    "https://www.ohchr.org/en/press-releases",
    "https://www.undp.org/news",
    "https://www.unep.org/news-and-stories",
    "https://www.ipcc.ch/news/",
    "https://www.refworld.org/",
    "https://www.iom.int/news",
    "https://www.ifrc.org/press-release",
]


async def keyword_crawl_search(
    country: str,
    agenda: str,
) -> list[dict]:
    keywords = country.lower().split() + agenda.lower().split()
    seen_urls: set[str] = set()
    results: list[dict] = []

    for url in TRUSTED_SOURCE_URLS[:2]:
        try:
            html = await fetch_page(url, timeout=5)
            if not html:
                continue
            links = extract_links(html, url)[:2]
            for link in links:
                if link in seen_urls:
                    continue
                seen_urls.add(link)
                try:
                    article_html = await fetch_page(link, timeout=5)
                    if not article_html:
                        continue
                    text = extract_text_simple(article_html)
                    if not text or len(text) < 300:
                        continue
                    filtered = extract_relevant_sentences(text, keywords, max_sentences=30)
                    if len(filtered) < 200:
                        continue
                    results.append({
                        "id": hashlib.md5(link.encode()).hexdigest(),
                        "url": link,
                        "domain": link.split("/")[2],
                        "content": filtered[:4000],
                        "title": text[:150],
                        "source_type": "crawl",
                    })
                except Exception:
                    continue
        except Exception:
            continue

    return results


async def searxng_search(
    country: str,
    agenda: str,
    base_url: str,
) -> list[dict]:
    site_filter = " OR ".join(f"site:{d}" for d in TRUSTED_DOMAINS)
    query = f"{country} {agenda} ({site_filter})"

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(
            f"{base_url}/search",
            params={"q": query, "format": "json", "language": "en-US"},
        )
        response.raise_for_status()
        data = response.json()

    results = []
    for item in data.get("results", [])[:20]:
        url = item.get("url", "")
        domain = url.split("/")[2] if url else ""
        content = item.get("content", "") or item.get("snippet", "")
        title = item.get("title", "")
        if not content or len(content) < 100:
            continue
        results.append({
            "id": hashlib.md5(url.encode()).hexdigest(),
            "url": url,
            "domain": domain,
            "content": content[:4000],
            "title": title,
            "source_type": "searxng",
        })

    return results
