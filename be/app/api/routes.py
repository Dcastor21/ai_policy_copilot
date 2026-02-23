import os
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from app.services.ingestion import ingest_document
from app.services.retrieval import retrieve_relevant_chunks
from app.services.llm import generate_answer
from app.core.config import settings

router = APIRouter()

# --- Request/Response Models ---
class QueryRequest(BaseModel):
    question: str

class QueryResponse(BaseModel):
    answer: str
    source_chunks: list[str]
    model_used: str

# --- Endpoints ---

@router.post("/upload", summary="Upload and index a PDF policy document")
async def upload_document(file: UploadFile = File(...)):
    """Accepts a PDF, saves it, and indexes it into the vector store."""
    
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    # Save uploaded file to disk
    os.makedirs(settings.upload_dir, exist_ok=True)
    file_path = os.path.join(settings.upload_dir, file.filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Run ingestion pipeline
    try:
        result = ingest_document(file_path)
        return {
            "message": f"Successfully indexed '{file.filename}'",
            "chunks_indexed": result["chunks_indexed"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ask", response_model=QueryResponse, summary="Ask a question about uploaded documents")
async def ask_question(request: QueryRequest):
    """Takes a question, retrieves relevant chunks, and returns a grounded answer."""
    
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")
    
    try:
        # Step 1: Retrieve relevant chunks
        chunks = retrieve_relevant_chunks(request.question)
        
        # Step 2: Generate grounded answer
        result = generate_answer(request.question, chunks)
        
        return result
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health", summary="Health check")
async def health_check():
    return {"status": "ok", "index_exists": os.path.exists(settings.index_path)}
