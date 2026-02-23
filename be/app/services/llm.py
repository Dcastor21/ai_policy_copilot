from openai import OpenAI
from app.core.config import settings

client = OpenAI(api_key=settings.openai_api_key)

def generate_answer(query: str, context_chunks: list[str]) -> dict:
    """Generate an answer grounded in the retrieved context."""
    
    # Join the chunks into a single context block
    context = "\n\n---\n\n".join(context_chunks)

    system_prompt = """You are a helpful policy assistant. 
    Answer the user's question ONLY using the context provided below.
    Always cite the page number when referencing information (e.g., "According to [Page 3]...").
    If the answer is not found in the context, say: "I could not find relevant information in the uploaded documents."
    Do not make up information."""

    user_prompt = f"""Context from policy documents:
{context}

Question: {query}

Answer:"""

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.2,  # Low temperature = more factual, less creative
        max_tokens=800
    )

    answer = response.choices[0].message.content

    return {
        "answer": answer,
        "source_chunks": context_chunks,  # Return chunks as citations
        "model_used": "gpt-3.5-turbo"
    }

