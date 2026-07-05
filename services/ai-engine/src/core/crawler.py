import asyncio
import httpx
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urljoin
from typing import Optional


async def fetch_page(url: str, timeout: int = 5) -> Optional[str]:
    try:
        async with httpx.AsyncClient(
            timeout=timeout,
            follow_redirects=True,
            headers={
                "User-Agent": (
                    "GeMUNi/1.0 Research Crawler "
                    "(educational project; respects robots.txt)"
                ),
            },
        ) as client:
            response = await client.get(url)
            response.raise_for_status()
            return response.text
    except Exception:
        return None


def extract_text_simple(html: str) -> str:
    soup = BeautifulSoup(html, "html.parser")
    for tag in soup(["script", "style", "nav", "footer", "header", "aside"]):
        tag.decompose()
    text = soup.get_text(separator=" ", strip=True)
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    return " ".join(lines)


def extract_links(html: str, base_url: str) -> list[str]:
    soup = BeautifulSoup(html, "html.parser")
    links = []
    for a in soup.find_all("a", href=True):
        href = a["href"]
        full_url = urljoin(base_url, href)
        parsed = urlparse(full_url)
        if parsed.scheme in ("http", "https"):
            links.append(full_url)
    return links


async def crawl_url(
    url: str,
    max_depth: int = 1,
    current_depth: int = 0,
) -> list[dict]:
    if current_depth > max_depth:
        return []

    html = await fetch_page(url)
    if not html:
        return []

    text = extract_text_simple(html)
    domain = urlparse(url).netloc

    results = [{"url": url, "domain": domain, "content": text[:5000]}]

    if current_depth < max_depth:
        links = extract_links(html, url)[:5]
        tasks = [crawl_url(link, max_depth, current_depth + 1) for link in links]
        nested = await asyncio.gather(*tasks)
        for n in nested:
            results.extend(n)

    return results
