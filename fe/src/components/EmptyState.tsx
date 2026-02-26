"use client";

import { FileText, HelpCircle, Scale, BookOpen } from "lucide-react";

interface Props {
  onSelectQuestion: (question: string) => void;
}

const SUGGESTED_QUESTIONS = [
  {
    icon: HelpCircle,
    text: "What are the key compliance requirements outlined in this policy?",
  },
  {
    icon: Scale,
    text: "Summarize the data retention and privacy provisions.",
  },
  {
    icon: BookOpen,
    text: "What exceptions or exemptions are defined?",
  },
];

export default function EmptyState({ onSelectQuestion }: Props) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
        <FileText className="h-6 w-6 text-muted" />
      </div>
      <h2 className="text-lg font-semibold text-foreground">
        Ask your policy documents
      </h2>
      <p className="mt-1 max-w-sm text-center text-sm text-muted">
        Upload a PDF on the left, then ask a question below. Answers are
        grounded in your uploaded documents with source references.
      </p>

      <div className="mt-8 w-full max-w-md space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          Try asking
        </p>
        {SUGGESTED_QUESTIONS.map((q) => {
          const Icon = q.icon;
          return (
            <button
              key={q.text}
              type="button"
              onClick={() => onSelectQuestion(q.text)}
              className="flex w-full items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-left text-sm text-accent-foreground transition-colors hover:bg-accent"
            >
              <Icon className="h-4 w-4 shrink-0 text-muted" />
              <span>{q.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
