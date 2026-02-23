import os
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from app.core.config import settings

def retrieve_relevant_chunks(query: str) -> list[str]:
    """Find the top-k most relevant text chunks for a given query."""
    if not os.path.exists(settings.index_path):
        raise FileNotFoundError("No documents have been indexed yet. Please upload a PDF first.")

    embeddings = OpenAIEmbeddings(openai_api_key=settings.openai_api_key)
    vectorstore = FAISS.load_local(
        settings.index_path,
        embeddings,
        allow_dangerous_deserialization=True
    )

    # Similarity search returns the top-k most relevant chunks
    results = vectorstore.similarity_search(query, k=settings.top_k_results)
    return [doc.page_content for doc in results]
