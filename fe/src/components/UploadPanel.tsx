"use client";
import { useState } from "react";
import { uploadDocument } from "../lib/api";

export default function UploadPanel() {
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [fileName, setFileName] = useState<string>("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setStatus("uploading");

    try {
      await uploadDocument(file);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center">
      <label className="cursor-pointer">
        <span className="block text-sm font-medium text-neutral-700 mb-2">
          Upload a Policy PDF
        </span>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFile}
          className="hidden"
        />
        <span className="inline-block rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-700 transition-colors">
          Choose File
        </span>
      </label>

      {fileName && (
        <p className="mt-3 text-xs text-neutral-500">
          {status === "uploading" && `Uploading ${fileName}...`}
          {status === "done" && `✓ ${fileName} uploaded successfully`}
          {status === "error" && `✗ Upload failed. Try again.`}
        </p>
      )}
    </div>
  );
}