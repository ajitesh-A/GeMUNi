import feedparser
from typing import Optional

RSS_FEEDS = [
    {"url": "https://news.un.org/feed/subscribe/en/news/all/rss.xml", "category": "UN"},
    {"url": "https://www.who.int/rss-feeds/news.xml", "category": "Health"},
    {"url": "https://www.amnesty.org/en/latest/feed/", "category": "Human Rights"},
    {"url": "https://www.hrw.org/feed/all.xml", "category": "Human Rights"},
    {"url": "https://www.crisisgroup.org/rss.xml", "category": "Conflict"},
    {"url": "https://www.worldbank.org/en/news/rss", "category": "Development"},
    {"url": "https://www.oecd.org/newsroom/rss.xml", "category": "Economics"},
    {"url": "https://www.icrc.org/en/rss", "category": "Humanitarian"},
    {"url": "https://www.transparency.org/en/rss", "category": "Governance"},
    {"url": "https://www.weforum.org/rss.xml", "category": "Economics"},
]


async def fetch_rss_feeds() -> list[dict]:
    articles = []

    for feed in RSS_FEEDS:
        try:
            parsed = feedparser.parse(feed["url"])
            for entry in parsed.entries[:5]:
                articles.append({
                    "title": entry.get("title", ""),
                    "url": entry.get("link", ""),
                    "content": entry.get("summary", entry.get("description", "")),
                    "published": entry.get("published", ""),
                    "category": feed["category"],
                    "source": feed["url"],
                })
        except Exception:
            continue

    return articles
