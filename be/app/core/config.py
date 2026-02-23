from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    openai_api_key: Optional[str] = None
    chunk_size: int = 500
    chunk_overlap: int = 50
    top_k_results: int = 4
    upload_dir: str = "uploads"
    index_path: str = "faiss_index"

    class Config:
        env_file = ".env"

settings = Settings()