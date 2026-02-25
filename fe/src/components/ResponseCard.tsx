import { QueryResponse } from "../types";

export default function ResponseCard({ data }: { data: QueryResponse }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-4">
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-2">
          Answer
        </h2>
        <p className="text-sm text-neutral-800 leading-relaxed">{data.answer}</p>
      </div>

      {data.citations && data.citations.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-2">
            Citations
          </h2>
          <ul className="space-y-2">
            {data.citations.map((c, i) => (
              <li key={i} className="rounded-lg bg-neutral-50 border border-neutral-100 p-3 text-xs text-neutral-600">
                <span className="font-medium text-neutral-800">{c.source}</span>
                {c.page && <span className="text-neutral-400"> · Page {c.page}</span>}
                <p className="mt-1 italic">&ldquo;{c.excerpt}&rdquo;</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.confidence !== undefined && (
        <p className="text-xs text-neutral-400">
          Confidence: {Math.round(data.confidence * 100)}%
        </p>
      )}
    </div>
  );
}