import chromadb
from chromadb.config import Settings
from src.config import settings

_client = None


def get_chroma_client() -> chromadb.Client:
    global _client
    if _client is None:
        _client = chromadb.Client(
            Settings(
                persist_directory=settings.chroma_persist_dir,
                is_persistent=True,
            )
        )
    return _client


def get_or_create_collection(name: str = "gemuni_sources"):
    client = get_chroma_client()
    try:
        return client.get_collection(name)
    except ValueError:
        return client.create_collection(name)


def store_embeddings(
    ids: list[str],
    embeddings: list[list[float]],
    metadatas: list[dict],
    documents: list[str],
    collection_name: str = "gemuni_sources",
):
    collection = get_or_create_collection(collection_name)
    collection.add(
        ids=ids,
        embeddings=embeddings,
        metadatas=metadatas,
        documents=documents,
    )


def query_similar(
    query_embedding: list[float],
    n_results: int = 10,
    collection_name: str = "gemuni_sources",
) -> list[dict]:
    collection = get_or_create_collection(collection_name)
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results,
    )
    documents = []
    for i in range(len(results["ids"][0])):
        documents.append({
            "id": results["ids"][0][i],
            "content": results["documents"][0][i],
            "metadata": results["metadatas"][0][i],
            "distance": results["distances"][0][i] if results["distances"] else 0,
        })
    return documents
