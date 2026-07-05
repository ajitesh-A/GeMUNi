import re
from typing import Optional


def clean_text(text: str) -> str:
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"[^\w\s\.\,\;\:\!\?\(\)\[\]\-\'\"]", " ", text)
    return text.strip()


def extract_relevant_sentences(
    text: str,
    keywords: list[str],
    max_sentences: int = 20,
) -> str:
    sentences = re.split(r"(?<=[.!?])\s+", text)
    relevant = []

    for sentence in sentences:
        if any(k.lower() in sentence.lower() for k in keywords):
            relevant.append(sentence.strip())
            if len(relevant) >= max_sentences:
                break

    return " ".join(relevant) if relevant else clean_text(text)[:2000]


def chunk_text(text: str, chunk_size: int = 500) -> list[str]:
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i : i + chunk_size])
        if chunk:
            chunks.append(chunk)
    return chunks
