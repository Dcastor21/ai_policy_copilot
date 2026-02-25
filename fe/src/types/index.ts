export interface Citation {
  source: string;
  page?: number;
  excerpt: string;
}

export interface QueryResponse {
  answer: string;
  citations?: Citation[];
  confidence?: number;
}