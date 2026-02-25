"use client";

import { Clock, MessageSquare, Trash2 } from "lucide-react";
import type { ConversationEntry } from "@/types";

interface Props {
  entries: ConversationEntry[];
  activeId: string | null;
  onSelect: (entry: ConversationEntry) => void;
  onClear: () => void;
}

export default function ConversationHistory({
  entries,
  activeId,
  onSelect,
  onClear,
}: Props) {
  if (entries.length === 0) {
    return (
      <div className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">
          History
        </h2>
        <p className="text-xs text-muted-foreground">
          Your questions will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">
          History
        </h2>
        <button
          type="button"
          onClick={onClear}
          className="flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-destructive-light hover:text-destructive"
          aria-label="Clear conversation history"
        >
          <Trash2 className="h-3 w-3" />
          <span>Clear</span>
        </button>
      </div>

      <ul className="space-y-1" aria-label="Conversation history">
        {entries.map((entry) => (
          <li key={entry.id}>
            <button
              type="button"
              onClick={() => onSelect(entry)}
              className={`flex w-full items-start gap-2.5 rounded-lg px-3 py-2 text-left transition-colors ${
                activeId === entry.id
                  ? "bg-primary/5 text-foreground"
                  : "text-accent-foreground hover:bg-accent"
              }`}
            >
              <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{entry.question}</p>
                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="h-2.5 w-2.5" />
                  {formatTime(entry.timestamp)}
                </p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
