"use client";
import { useState } from "react";
import Header from "../components/Header";
import UploadPanel from "../components/UploadPanel";
import QueryInput from "../components/QueryInput";
import ResponseCard from "../components/ResponseCard";
import { QueryResponse } from "../types";

export default function Home() {
  const [response, setResponse] = useState<QueryResponse | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <main className="min-h-screen bg-neutral-50">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        <UploadPanel />
        <QueryInput onResponse={setResponse} onLoading={setLoading} />
        {loading && (
          <p className="text-sm text-center text-neutral-400 animate-pulse">
            Thinking...
          </p>
        )}
        {response && !loading && <ResponseCard data={response} />}
      </div>
    </main>
  );
}