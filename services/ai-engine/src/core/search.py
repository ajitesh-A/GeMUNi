import hashlib
import httpx
from urllib.parse import quote
from src.config import settings
from src.core.crawler import fetch_page, extract_text_simple

SEARCH_TEMPLATES = [
    "site:{domain} {country} {agenda}",
    "site:{domain} {agenda} report {year}",
    "site:{domain} {country} position {agenda}",
    "site:{domain} {agenda} resolution",
]

TRUSTED_DOMAINS = [
    "un.org", "who.int", "unicef.org", "undp.org", "unesco.org",
    "unhcr.org", "fao.org", "amnesty.org", "hrw.org",
    "crisisgroup.org", "worldbank.org", "oecd.org", "imf.org",
    "icrc.org", "transparency.org", "sipri.org",
]


async def search_trusted_sources(
    country: str,
    agenda: str,
    domains: list[str] | None = None,
) -> list[dict]:
    if domains is None:
        domains = TRUSTED_DOMAINS

    results = []
    year = "2026"

    for domain in domains:
        query = (
            f"site:{domain} {country} {agenda} "
            f"OR {agenda} report {year}"
        )

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                url = (
                    f"https://html.duckduckgo.com/html/?q={quote(query)}"
                )
                html = await fetch_page(url)
                if html:
                    text = extract_text_simple(html)
                    if text and len(text) > 200:
                        source_id = hashlib.md5(
                            f"{domain}:{query}".encode()
                        ).hexdigest()
                        results.append({
                            "id": source_id,
                            "url": f"https://{domain}",
                            "domain": domain,
                            "content": text[:3000],
                            "source_type": "trusted",
                        })
        except Exception:
            continue

    return results


async def crawl_direct_sources(
    country: str,
    agenda: str,
) -> list[dict]:
    direct_urls = [
        f"https://news.un.org/en/search/{quote(country + ' ' + agenda)}",
        f"https://www.who.int/search?q={quote(agenda)}",
        f"https://www.amnesty.org/en/search/?q={quote(country + ' ' + agenda)}",
        f"https://www.hrw.org/search?q={quote(agenda)}",
    ]

    results = []
    for url in direct_urls:
        html = await fetch_page(url)
        if html:
            text = extract_text_simple(html)
            if text and len(text) > 200:
                results.append({
                    "id": hashlib.md5(url.encode()).hexdigest(),
                    "url": url,
                    "domain": url.split("/")[2],
                    "content": text[:3000],
                    "source_type": "direct",
                })

    return results
