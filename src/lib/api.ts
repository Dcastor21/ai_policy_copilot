import type { QueryResponse, UploadResponse, HealthResponse } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function uploadDocument(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "Upload failed");
    throw new Error(detail);
  }

  return res.json();
}

export async function askQuestion(question: string): Promise<QueryResponse> {
  const res = await fetch(`${API_BASE}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "Query failed");
    throw new Error(detail);
  }

  return res.json();
}

export async function checkHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE}/health`);

  if (!res.ok) {
    throw new Error("Health check failed");
  }

  return res.json();
}
