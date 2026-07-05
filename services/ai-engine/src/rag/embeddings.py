from fastembed import TextEmbedding
from src.config import settings

_model = None


def get_embedding_model() -> TextEmbedding:
    global _model
    if _model is None:
        _model = TextEmbedding(model_name=settings.embedding_model)
    return _model


def embed_text(text: str) -> list[float]:
    model = get_embedding_model()
    for embedding in model.embed(text):
        return embedding.tolist()
    return []


def embed_texts(texts: list[str]) -> list[list[float]]:
    model = get_embedding_model()
    return [embedding.tolist() for embedding in model.embed(texts)]
