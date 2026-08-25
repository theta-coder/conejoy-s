"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import FormField from "@/components/admin/FormField";
import ImageUploader from "@/components/admin/ImageUploader";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import AdminToast, { ToastMessage } from "@/components/admin/AdminToast";
import LoadingSkeleton from "@/components/admin/LoadingSkeleton";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { Flavour } from "@/types/flavour";
import { flavourUpdateSchema } from "@/lib/validation";

export default function EditFlavourPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [formData, setFormData] = useState<Flavour>({
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
    createdAt: "",
    updatedAt: "",
  });

  const addToast = (type: "success" | "error" | "warning", message: string) => {
    setToasts((prev) => [...prev, { id: String(Date.now()), type, message }]);
  };

  useEffect(() => {
    async function loadFlavour() {
      try {
        const res = await fetch(`/api/flavours/${id}`);
        const data = await res.json();
        if (data.success && data.data) {
          setFormData(data.data);
        } else {
          addToast("error", "Flavour not found");
        }
      } catch {
        addToast("error", "Failed to load flavour detail");
      } finally {
        setLoading(false);
      }
    }
    loadFlavour();
  }, [id]);

  const updateImageField = (category: "cone" | "cup" | "shake", format: "png" | "webp", url: string) => {
    setFormData((prev) => ({
      ...prev,
      images: {
        ...prev.images,
        [category]: {
          ...(prev.images?.[category] || { png: "", webp: "" }),
          [format]: url,
        },
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = flavourUpdateSchema.safeParse(formData);
    if (!result.success) {
      addToast("error", result.error.issues[0]?.message ?? "Please check the form values.");
      return;
    }
    setSubmitting(true);

    try {
      const res = await fetch(`/api/flavours/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const data = await res.json();
      if (data.success) {
        addToast("success", "Flavour updated successfully!");
      } else {
        addToast("error", data.error || "Failed to update flavour");
      }
    } catch {
      addToast("error", "Network error while saving");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/flavours/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        addToast("success", "Flavour deleted");
        setTimeout(() => router.push("/admin/flavours"), 500);
      } else {
        addToast("error", data.error || "Failed to delete flavour");
      }
    } catch {
      addToast("error", "Network error while deleting");
    } finally {
      setDeleteLoading(false);
      setDeleteConfirmOpen(false);
    }
  };

  if (loading) return <LoadingSkeleton variant="form" />;

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
            <h1 className="font-display text-2xl font-black text-gray-900">
              Edit &bull; {formData.name}
            </h1>
            <p className="text-xs font-bold text-gray-500">ID: {id}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDeleteConfirmOpen(true)}
            className="p-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors cursor-pointer"
            title="Delete Flavour"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <button
            type="submit"
            form="edit-flavour-form"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-transform active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>{submitting ? "Saving..." : "Update Flavour"}</span>
          </button>
        </div>
      </div>

      {/* Form */}
      <form id="edit-flavour-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-xs">
          <h2 className="font-bold text-sm text-gray-900 pb-2 border-b border-gray-100">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Flavour Name"
              required
              value={formData.name}
              onChange={(val) => setFormData((p) => ({ ...p, name: val }))}
            />

            <FormField
              label="Flavour ID (Read Only)"
              disabled
              value={formData.id}
              onChange={() => {}}
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
            value={formData.shakeNote || ""}
            onChange={(val) => setFormData((p) => ({ ...p, shakeNote: val }))}
          />
        </div>

        {/* Image Assets */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-xs">
          <h2 className="font-bold text-sm text-gray-900 pb-2 border-b border-gray-100">
            Image Assets (PNG / WebP)
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">1. Cone Images</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ImageUploader
                  label="Cone PNG"
                  folder="cones"
                  value={formData.images?.cone?.png}
                  onUpload={(url) => updateImageField("cone", "png", url)}
                />
                <ImageUploader
                  label="Cone WebP"
                  folder="cones"
                  value={formData.images?.cone?.webp}
                  onUpload={(url) => updateImageField("cone", "webp", url)}
                />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">2. Cup Images</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ImageUploader
                  label="Cup PNG"
                  folder="cups"
                  value={formData.images?.cup?.png}
                  onUpload={(url) => updateImageField("cup", "png", url)}
                />
                <ImageUploader
                  label="Cup WebP"
                  folder="cups"
                  value={formData.images?.cup?.webp}
                  onUpload={(url) => updateImageField("cup", "webp", url)}
                />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">3. Shake Images</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ImageUploader
                  label="Shake PNG"
                  folder="shakes"
                  value={formData.images?.shake?.png}
                  onUpload={(url) => updateImageField("shake", "png", url)}
                />
                <ImageUploader
                  label="Shake WebP"
                  folder="shakes"
                  value={formData.images?.shake?.webp}
                  onUpload={(url) => updateImageField("shake", "webp", url)}
                />
              </div>
            </div>
          </div>
        </div>
      </form>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Delete Flavour?"
        message={`Are you sure you want to delete "${formData.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
        loading={deleteLoading}
      />

      <AdminToast toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((item) => item.id !== id))} />
    </div>
  );
}
