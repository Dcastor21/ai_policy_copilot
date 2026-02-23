import os
import pdfplumber
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from app.core.config import settings

def extract_text_from_pdf(file_path: str) -> str:
    """Extract raw text from a PDF file, page by page."""
    full_text = ""
    with pdfplumber.open(file_path) as pdf:
        for i, page in enumerate(pdf.pages):
            text = page.extract_text()
            if text:
                # Tag each chunk with its page number for citations later
                full_text += f"\n[Page {i+1}]\n{text}"
    return full_text

def chunk_text(text: str) -> list[str]:
    """Split large text into smaller overlapping chunks."""
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.chunk_size,
        chunk_overlap=settings.chunk_overlap,
        separators=["\n\n", "\n", ".", " "]
    )
    return splitter.split_text(text)

def ingest_document(file_path: str) -> dict:
    """Full pipeline: extract → chunk → embed → store in FAISS."""
    # 1. Extract text
    text = extract_text_from_pdf(file_path)
    if not text.strip():
        raise ValueError("Could not extract text from this PDF.")

    # 2. Chunk it
    chunks = chunk_text(text)

    # 3. Create embeddings model
    embeddings = OpenAIEmbeddings(openai_api_key=settings.openai_api_key)

    # 4. Build or update FAISS index
    if os.path.exists(settings.index_path):
        # Load existing index and add new docs
        vectorstore = FAISS.load_local(
            settings.index_path, 
            embeddings,
            allow_dangerous_deserialization=True
        )
        vectorstore.add_texts(chunks)
    else:
        # Create new index from scratch
        vectorstore = FAISS.from_texts(chunks, embeddings)

    # 5. Save to disk
    vectorstore.save_local(settings.index_path)

    return {"chunks_indexed": len(chunks), "status": "success"}

