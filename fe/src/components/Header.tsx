"use client";

import { useEffect, useState } from "react";
import { Shield } from "lucide-react";
import { checkHealth } from "@/lib/api";

export default function Header() {
  const [health, setHealth] = useState<
    "checking" | "online" | "offline"
  >("checking");

  useEffect(() => {
    checkHealth()
      .then(() => setHealth("online"))
      .catch(() => setHealth("offline"));

    const interval = setInterval(() => {
      checkHealth()
        .then(() => setHealth("online"))
        .catch(() => setHealth("offline"));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-foreground">
              AI Policy Co-Pilot
            </h1>
            <p className="text-xs text-muted">
              Grounded answers from your policy documents
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted">
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              health === "online"
                ? "bg-success"
                : health === "offline"
                  ? "bg-destructive"
                  : "animate-pulse bg-muted-foreground"
            }`}
            aria-hidden="true"
          />
          <span className="sr-only">Backend status:</span>
          <span>
            {health === "online"
              ? "Connected"
              : health === "offline"
                ? "Offline"
                : "Checking..."}
          </span>
        </div>
      </div>
    </header>
  );
}
