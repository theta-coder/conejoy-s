"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import FormField from "@/components/admin/FormField";
import ImageUploader from "@/components/admin/ImageUploader";
import AdminToast, { ToastMessage } from "@/components/admin/AdminToast";
import { ArrowLeft, Save } from "lucide-react";
import { flavourCreateSchema } from "@/lib/validation";

export default function NewFlavourPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    color: "#faa926",
    sortOrder: 1,
    isActive: true,
    shakeNote: "",
    images: {
      cone: { png: "", webp: "" },
      cup: { png: "", webp: "" },
      shake: { png: "", webp: "" },
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: "success" | "error" | "warning", message: string) => {
    setToasts((prev) => [...prev, { id: String(Date.now()), type, message }]);
  };

  const handleNameChange = (val: string) => {
    const autoId = val.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
    setFormData((prev) => ({
      ...prev,
      name: val,
      id: prev.id || autoId,
    }));
  };

  const updateImageField = (category: "cone" | "cup" | "shake", format: "png" | "webp", url: string) => {
    setFormData((prev) => ({
      ...prev,
      images: {
        ...prev.images,
        [category]: {
          ...prev.images[category],
          [format]: url,
        },
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = flavourCreateSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(Object.fromEntries(
        Object.entries(fieldErrors).map(([key, messages]) => [key, messages?.[0] ?? "Invalid value"]),
      ));
      addToast("error", "Please correct the highlighted fields.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/flavours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const data = await res.json();
      if (data.success) {
        addToast("success", "Flavour created successfully!");
        setTimeout(() => router.push("/admin/flavours"), 800);
      } else {
        addToast("error", data.error || "Failed to create flavour");
      }
    } catch {
      addToast("error", "Network error while saving");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-500 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="font-display text-2xl font-black text-gray-900">Add New Flavour</h1>
            <p className="text-xs font-bold text-gray-500">Configure new flavour details &amp; image assets</p>
          </div>
        </div>

        <button
          type="submit"
          form="new-flavour-form"
          disabled={submitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-transform active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          <Save className="h-4 w-4" />
          <span>{submitting ? "Saving..." : "Save Flavour"}</span>
        </button>
      </div>

      {/* Form */}
      <form id="new-flavour-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-xs">
          <h2 className="font-bold text-sm text-gray-900 pb-2 border-b border-gray-100">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Flavour Name"
              required
              value={formData.name}
              onChange={handleNameChange}
              placeholder="e.g. Mango"
              error={errors.name}
            />

            <FormField
              label="Flavour ID (Slug)"
              required
              value={formData.id}
              onChange={(val) => setFormData((p) => ({ ...p, id: val }))}
              placeholder="e.g. mango"
              error={errors.id}
            />

            <FormField
              label="Brand Color"
              type="color"
              value={formData.color}
              onChange={(val) => setFormData((p) => ({ ...p, color: val }))}
            />

            <FormField
              label="Sort Order"
              type="number"
              value={formData.sortOrder}
              onChange={(val) => setFormData((p) => ({ ...p, sortOrder: Number(val) }))}
            />
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-gray-100">
            <span className="text-xs font-bold text-gray-700">Active Status</span>
            <FormField
              label=""
              type="toggle"
              value={formData.isActive}
              onChange={(val) => setFormData((p) => ({ ...p, isActive: val }))}
            />
          </div>

          <FormField
            label="Shake Note (Optional)"
            type="textarea"
            rows={2}
            value={formData.shakeNote}
            onChange={(val) => setFormData((p) => ({ ...p, shakeNote: val }))}
            placeholder="Special blend notes..."
          />
        </div>

        {/* Image Assets Uploaders Grid */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-xs">
          <h2 className="font-bold text-sm text-gray-900 pb-2 border-b border-gray-100">
            Image Assets (PNG / WebP)
          </h2>

          <div className="space-y-6">
            {/* Cone Section */}
            <div>
              <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">
                1. Cone Images
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ImageUploader
                  label="Cone PNG"
                  folder="cones"
                  value={formData.images.cone.png}
                  onUpload={(url) => updateImageField("cone", "png", url)}
                />
                <ImageUploader
                  label="Cone WebP"
                  folder="cones"
                  value={formData.images.cone.webp}
                  onUpload={(url) => updateImageField("cone", "webp", url)}
                />
              </div>
            </div>

            {/* Cup Section */}
            <div>
              <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">
                2. Cup Images
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ImageUploader
                  label="Cup PNG"
                  folder="cups"
                  value={formData.images.cup.png}
                  onUpload={(url) => updateImageField("cup", "png", url)}
                />
                <ImageUploader
                  label="Cup WebP"
                  folder="cups"
                  value={formData.images.cup.webp}
                  onUpload={(url) => updateImageField("cup", "webp", url)}
                />
              </div>
            </div>

            {/* Shake Section */}
            <div>
              <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">
                3. Shake Images
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ImageUploader
                  label="Shake PNG"
                  folder="shakes"
                  value={formData.images.shake.png}
                  onUpload={(url) => updateImageField("shake", "png", url)}
                />
                <ImageUploader
                  label="Shake WebP"
                  folder="shakes"
                  value={formData.images.shake.webp}
                  onUpload={(url) => updateImageField("shake", "webp", url)}
                />
              </div>
            </div>
          </div>
        </div>
      </form>

      <AdminToast toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((item) => item.id !== id))} />
    </div>
  );
}
