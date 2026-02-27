export interface QueryResponse {
  answer: string;
  source_chunks: string[];
  model_used: string;
  citations?: Citation[];
}

export interface UploadResponse {
  message: string;
  chunks_indexed: number;
}

export interface HealthResponse {
  status: string;
  index_exists: boolean;
}

export interface ConversationEntry {
  id: string;
  question: string;
  response: QueryResponse;
  timestamp: Date;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: "uploading" | "done" | "error";
  chunksIndexed?: number;
}
