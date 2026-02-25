"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, X, Loader2 } from "lucide-react";
import { uploadDocument } from "@/lib/api";
import type { UploadedFile } from "@/types";

export default function UploadPanel() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    if (!file.name.endsWith(".pdf")) return;

    const id = `${file.name}-${Date.now()}`;
    const entry: UploadedFile = {
      id,
      name: file.name,
      size: file.size,
      status: "uploading",
    };

    setFiles((prev) => [...prev, entry]);

    try {
      const result = await uploadDocument(file);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? { ...f, status: "done", chunksIndexed: result.chunks_indexed }
            : f
        )
      );
    } catch {
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: "error" } : f))
      );
    }
  }, []);

  const handleFiles = useCallback(
    (fileList: FileList) => {
      Array.from(fileList).forEach(processFile);
    },
    [processFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">
          Documents
        </h2>
        {files.length > 0 && (
          <span className="text-xs text-muted">
            {files.filter((f) => f.status === "done").length} indexed
          </span>
        )}
      </div>

      <div
        role="button"
        tabIndex={0}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        className={`group cursor-pointer rounded-lg border-2 border-dashed p-5 text-center transition-all ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border-dashed hover:border-muted-foreground hover:bg-accent"
        }`}
      >
        <Upload
          className={`mx-auto mb-2 h-5 w-5 transition-colors ${
            isDragging ? "text-primary" : "text-muted-foreground group-hover:text-muted"
          }`}
        />
        <p className="text-sm font-medium text-accent-foreground">
          {isDragging ? "Drop PDF here" : "Upload Policy PDF"}
        </p>
        <p className="mt-1 text-xs text-muted">
          Drag and drop or click to browse
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          multiple
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
            e.target.value = "";
          }}
          className="hidden"
          aria-label="Upload PDF files"
        />
      </div>

      {files.length > 0 && (
        <ul className="space-y-2" aria-label="Uploaded files">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2"
            >
              <FileText className="h-4 w-4 shrink-0 text-muted" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {file.name}
                </p>
                <p className="text-xs text-muted">
                  {formatSize(file.size)}
                  {file.status === "done" &&
                    file.chunksIndexed !== undefined &&
                    ` \u00B7 ${file.chunksIndexed} chunks indexed`}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {file.status === "uploading" && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted" />
                )}
                {file.status === "done" && (
                  <CheckCircle2 className="h-4 w-4 text-success" />
                )}
                {file.status === "error" && (
                  <AlertCircle className="h-4 w-4 text-destructive" />
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.id);
                  }}
                  className="ml-1 rounded p-0.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
