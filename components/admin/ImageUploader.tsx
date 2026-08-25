"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Check, Image as ImageIcon } from "lucide-react";
import { useUpload } from "@/hooks/useUpload";

interface ImageUploaderProps {
  label?: string;
  value?: string;
  onUpload: (url: string) => void;
  folder?: string;
  accept?: string;
  maxSizeMB?: number;
}

export default function ImageUploader({
  label = "Upload Image",
  value,
  onUpload,
  folder = "general",
  accept = "image/png, image/webp, image/jpeg",
  maxSizeMB = 5,
}: ImageUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [clientError, setClientError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadFile, uploading, progress, error: uploadError } = useUpload();

  const handleFileSelect = async (file: File) => {
    setClientError(null);

    const allowed = ["image/png", "image/webp", "image/jpeg", "image/jpg"];
    if (!allowed.includes(file.type)) {
      setClientError("Invalid file type. PNG, WebP or JPEG only.");
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setClientError(`File size exceeds ${maxSizeMB}MB limit.`);
      return;
    }

    // Local preview
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    try {
      const remoteUrl = await uploadFile(file, folder);
      onUpload(remoteUrl);
      setPreview(remoteUrl);
    } catch (err: any) {
      setClientError(err?.message || "Upload failed");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUpload("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-1.5 w-full">
      {label && <label className="text-xs font-bold text-gray-700">{label}</label>}

      {preview ? (
        <div className="relative group rounded-xl border border-gray-200 bg-gray-50 p-2 overflow-hidden flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-white flex items-center justify-center">
              <Image
                src={preview}
                alt="Upload preview"
                fill
                className="object-contain p-1"
                unoptimized={preview.startsWith("blob:")}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-900 flex items-center gap-1">
                <Check className="h-3.5 w-3.5 text-emerald-600" /> Image Uploaded
              </span>
              <span className="text-[0.68rem] text-gray-400 font-semibold truncate max-w-[200px]">
                {preview}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
            dragOver ? "border-amber-500 bg-amber-50/50" : "border-gray-200 hover:border-amber-400 bg-white"
          }`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-600 mb-2">
            {uploading ? <ImageIcon className="h-5 w-5 animate-pulse" /> : <Upload className="h-5 w-5" />}
          </div>
          <p className="text-xs font-bold text-gray-800">
            {uploading ? "Uploading..." : "Click or drag image to upload"}
          </p>
          <p className="text-[0.68rem] text-gray-400 font-medium mt-0.5">
            PNG, WebP or JPEG (Max {maxSizeMB}MB)
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            className="hidden"
          />
        </div>
      )}

      {/* Progress Bar */}
      {uploading && (
        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-2">
          <div
            className="bg-amber-500 h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {(clientError || uploadError) && (
        <p className="text-[0.7rem] font-bold text-red-500 mt-1">
          {clientError || uploadError}
        </p>
      )}
    </div>
  );
}
