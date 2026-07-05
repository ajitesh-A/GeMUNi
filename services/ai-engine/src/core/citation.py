import re
from typing import Optional


KNOWN_SOURCES = {
    "un.org": "United Nations",
    "who.int": "WHO",
    "unicef.org": "UNICEF",
    "undp.org": "UNDP",
    "unesco.org": "UNESCO",
    "unhcr.org": "UNHCR",
    "fao.org": "FAO",
    "amnesty.org": "Amnesty International",
    "hrw.org": "Human Rights Watch",
    "crisisgroup.org": "International Crisis Group",
    "worldbank.org": "World Bank",
    "oecd.org": "OECD",
    "imf.org": "IMF",
    "icrc.org": "ICRC",
    "transparency.org": "Transparency International",
    "sipri.org": "SIPRI",
    "weforum.org": "World Economic Forum",
    "brookings.edu": "Brookings Institution",
    "chathamhouse.org": "Chatham House",
    "cfr.org": "Council on Foreign Relations",
}


def get_source_name(url: str) -> str:
    for domain, name in KNOWN_SOURCES.items():
        if domain in url:
            return name
    return "Source"


def extract_year_from_text(text: str) -> Optional[str]:
    year_match = re.search(r"\b(19|20)\d{2}\b", text)
    return year_match.group(0) if year_match else None


def format_citation(url: str, text_snippet: str = "") -> str:
    source_name = get_source_name(url)
    year = extract_year_from_text(text_snippet) or "n.d."
    return f"[{source_name}, {year}]"


def extract_citations(text: str) -> list[dict]:
    pattern = r"\[([^,]+),\s*(\d{4}|n\.d\.)\]"
    matches = re.findall(pattern, text)
    return [
        {"source_name": m[0], "year": m[1]} for m in matches
    ]
