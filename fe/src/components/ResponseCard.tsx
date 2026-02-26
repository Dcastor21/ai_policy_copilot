"use client";

import { useState, useCallback } from "react";
import { Copy, Check, ChevronDown, ChevronRight, Cpu } from "lucide-react";
import type { QueryResponse } from "@/types";

export default function ResponseCard({ data }: { data: QueryResponse }) {
  const [copiedAnswer, setCopiedAnswer] = useState(false);
  const [expandedChunks, setExpandedChunks] = useState(false);

  const copyToClipboard = useCallback(async (text: string, onCopied: (v: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      onCopied(true);
      setTimeout(() => onCopied(false), 2000);
    } catch {
      // Clipboard API may not be available
    }
  }, []);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4 rounded-xl border border-border bg-surface p-6">
      {/* Answer section */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">
            Answer
          </h2>
          <button
            type="button"
            onClick={() => copyToClipboard(data.answer, setCopiedAnswer)}
            className="flex items-center gap-1 rounded px-2 py-1 text-xs text-muted transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label="Copy answer"
          >
            {copiedAnswer ? (
              <>
                <Check className="h-3 w-3 text-success" />
                <span className="text-success">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        <p className="text-sm leading-relaxed text-accent-foreground whitespace-pre-wrap">
          {data.answer}
        </p>
      </div>

      {/* Source chunks section */}
      {data.source_chunks && data.source_chunks.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setExpandedChunks(!expandedChunks)}
            className="flex w-full items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted transition-colors hover:text-accent-foreground"
            aria-expanded={expandedChunks}
          >
            {expandedChunks ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
            Sources ({data.source_chunks.length})
          </button>

          {expandedChunks && (
            <ul className="mt-3 space-y-2" aria-label="Source chunks">
              {data.source_chunks.map((chunk, i) => (
                <SourceChunk key={i} index={i} text={chunk} />
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Model badge */}
      {data.model_used && (
        <div className="flex items-center gap-1.5 pt-1 text-xs text-muted-foreground">
          <Cpu className="h-3 w-3" />
          <span>{data.model_used}</span>
        </div>
      )}
    </div>
  );
}

function SourceChunk({ index, text }: { index: number; text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <li className="group relative rounded-lg border border-border bg-accent/50 p-3">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[11px] font-medium text-muted">
          Chunk {index + 1}
        </span>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(text);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            } catch {
              // Clipboard API may not be available
            }
          }}
          className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-muted-foreground opacity-0 transition-all hover:bg-background group-hover:opacity-100"
          aria-label={`Copy source chunk ${index + 1}`}
        >
          {copied ? (
            <Check className="h-3 w-3 text-success" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </button>
      </div>
      <p className="font-mono text-xs leading-relaxed text-accent-foreground whitespace-pre-wrap">
        {text}
      </p>
    </li>
  );
}
