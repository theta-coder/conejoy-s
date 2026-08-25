"use client";

import { useState } from "react";

export function useUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    setUploading(true);
    setProgress(10);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      setProgress(80);
      const payload = await response.json();
      if (!response.ok || !payload.success || !payload.url) {
        throw new Error(payload.error ?? "Image upload failed.");
      }
      setProgress(100);
      return payload.url as string;
    } catch (uploadError) {
      const message = uploadError instanceof Error ? uploadError.message : "Image upload failed.";
      setError(message);
      throw new Error(message);
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading, progress, error };
}
