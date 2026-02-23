# AI Policy Co-Pilot - Docker Setup

## Prerequisites
- Docker installed on your system
- Docker Compose installed
- OpenAI API key

## Quick Start

1. **Clone and setup environment:**
   ```bash
   cd ai_policy_copilot/be
   cp .env.example .env
   # Edit .env and add your OPENAI_API_KEY
   ```

2. **Build and run with Docker Compose (Recommended):**
   ```bash
   docker-compose up --build
   ```

3. **Or build and run manually:**
   ```bash
   # Build the image
   docker build -t ai-policy-copilot .

   # Run the container
   docker run -p 8000:8000 --env-file .env ai-policy-copilot
   ```

## API Access

Once running, the API will be available at:
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/

## Development

For development with hot reload:
```bash
docker-compose up --build
```

This will mount your local `app/` directory into the container, so changes will be reflected immediately.

## Volumes

The docker-compose setup includes volume mounts for:
- `./app:/app/app` - Application code (for development)
- `./uploads:/app/uploads` - Uploaded files
- `./faiss_index:/app/faiss_index` - Vector store index

## Environment Variables

Required:
- `OPENAI_API_KEY` - Your OpenAI API key

Optional:
- `CHUNK_SIZE` - Text chunk size (default: 1000)
- `CHUNK_OVERLAP` - Chunk overlap (default: 200)
- `INDEX_PATH` - Path to FAISS index (default: ./faiss_index)