def rank_sources(
    sources: list[dict],
    query: str,
) -> list[dict]:
    query_lower = query.lower()
    query_terms = set(query_lower.split())

    for source in sources:
        score = 0.0
        content_lower = source.get("content", "").lower()

        term_matches = sum(
            1 for term in query_terms if term in content_lower
        )
        score += term_matches * 2.0

        title = source.get("title", "")
        if query_lower in title.lower():
            score += 5.0

        domain = source.get("domain", "")
        priority_domains = [
            "un.org", "who.int", "unicef.org", "hrw.org", "amnesty.org",
        ]
        if any(d in domain for d in priority_domains):
            score += 3.0

        content_length = len(source.get("content", ""))
        if 500 < content_length < 5000:
            score += 2.0

        source["relevance_score"] = round(score, 2)

    sources.sort(key=lambda x: x["relevance_score"], reverse=True)

    return sources[:20]
