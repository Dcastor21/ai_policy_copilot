"use client";
import { useState } from "react";
import { askQuestion } from "../lib/api";
import { QueryResponse } from "../types";

interface Props {
  onResponse: (res: QueryResponse) => void;
  onLoading: (loading: boolean) => void;
}

export default function QueryInput({ onResponse, onLoading }: Props) {
  const [question, setQuestion] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;

    onLoading(true);
    try {
      const result = await askQuestion(question);
      onResponse(result);
    } catch {
      console.error("Query error");
    } finally {
      onLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question about your policy document..."
        className="flex-1 rounded-lg border border-neutral-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900"
      />
      <button
        type="submit"
        className="rounded-lg bg-neutral-900 px-5 py-2 text-sm text-white hover:bg-neutral-700 transition-colors disabled:opacity-50"
      >
        Ask
      </button>
    </form>
  );
}