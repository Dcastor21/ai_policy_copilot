"use client";

import { useState, useCallback } from "react";
import Header from "@/components/Header";
import UploadPanel from "@/components/UploadPanel";
import QueryInput from "@/components/QueryInput";
import ResponseCard from "@/components/ResponseCard";
import ConversationHistory from "@/components/ConversationHistory";
import EmptyState from "@/components/EmptyState";
import { askQuestion } from "@/lib/api";
import type { QueryResponse, ConversationEntry } from "@/types";

export default function Home() {
  const [currentResponse, setCurrentResponse] =
    useState<QueryResponse | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ConversationEntry[]>([]);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (question: string) => {
      setLoading(true);
      setError(null);
      setCurrentQuestion(question);
      setCurrentResponse(null);
      setActiveEntryId(null);

      try {
        const result = await askQuestion(question);
        setCurrentResponse(result);

        const entry: ConversationEntry = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          question,
          response: result,
          timestamp: new Date(),
        };

        setHistory((prev) => [entry, ...prev]);
        setActiveEntryId(entry.id);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleSelectEntry = useCallback((entry: ConversationEntry) => {
    setCurrentResponse(entry.response);
    setCurrentQuestion(entry.question);
    setActiveEntryId(entry.id);
    setError(null);
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    setActiveEntryId(null);
    setCurrentResponse(null);
    setCurrentQuestion("");
    setError(null);
  }, []);

  const handleSelectSuggestion = useCallback(
    (question: string) => {
      handleSubmit(question);
    },
    [handleSubmit]
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full shrink-0 border-b border-border bg-surface px-6 py-5 lg:w-72 lg:border-b-0 lg:border-r lg:py-6">
          <div className="space-y-6">
            <UploadPanel />
            <div className="hidden lg:block">
              <ConversationHistory
                entries={history}
                activeId={activeEntryId}
                onSelect={handleSelectEntry}
                onClear={handleClearHistory}
              />
            </div>
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex flex-1 flex-col">
          {/* Response area */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
            {loading && (
              <div className="space-y-4">
                {currentQuestion && (
                  <div className="flex justify-end">
                    <div className="max-w-md rounded-lg bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                      {currentQuestion}
                    </div>
                  </div>
                )}
                <LoadingSkeleton />
              </div>
            )}

            {error && !loading && (
              <div className="rounded-lg border border-destructive/20 bg-destructive-light px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {currentResponse && !loading && (
              <div className="space-y-4">
                {currentQuestion && (
                  <div className="flex justify-end">
                    <div className="max-w-md rounded-lg bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                      {currentQuestion}
                    </div>
                  </div>
                )}
                <ResponseCard data={currentResponse} />
              </div>
            )}

            {!currentResponse && !loading && !error && (
              <EmptyState onSelectQuestion={handleSelectSuggestion} />
            )}
          </div>

          {/* Query input pinned to bottom */}
          <QueryInput onSubmit={handleSubmit} isLoading={loading} />
        </main>
      </div>

      {/* Mobile history (visible only on small screens) */}
      {history.length > 0 && (
        <div className="border-t border-border bg-surface px-6 py-4 lg:hidden">
          <ConversationHistory
            entries={history}
            activeId={activeEntryId}
            onSelect={handleSelectEntry}
            onClear={handleClearHistory}
          />
        </div>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4 rounded-xl border border-border bg-surface p-6">
      <div className="space-y-2">
        <div className="h-3 w-16 animate-pulse rounded bg-accent" />
        <div className="h-4 w-full animate-pulse rounded bg-accent" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-accent" />
        <div className="h-4 w-3/5 animate-pulse rounded bg-accent" />
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-3 w-20 animate-pulse rounded bg-accent" />
        <div className="h-3 w-24 animate-pulse rounded bg-accent" />
      </div>
    </div>
  );
}
