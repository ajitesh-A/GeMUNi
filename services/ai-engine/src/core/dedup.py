import hashlib


def deduplicate_sources(sources: list[dict]) -> list[dict]:
    seen_hashes = set()
    deduped = []

    for source in sources:
        content = source.get("content", "")
        content_hash = hashlib.md5(content.encode()).hexdigest()

        if content_hash not in seen_hashes:
            seen_hashes.add(content_hash)
            deduped.append(source)

    return deduped


def deduplicate_urls(urls: list[str]) -> list[str]:
    seen = set()
    result = []
    for url in urls:
        if url not in seen:
            seen.add(url)
            result.append(url)
    return result
