"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import FormField from "@/components/admin/FormField";
import ImageUploader from "@/components/admin/ImageUploader";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import AdminToast, { ToastMessage } from "@/components/admin/AdminToast";
import LoadingSkeleton from "@/components/admin/LoadingSkeleton";
import { Plus, Trash2, Link as LinkIcon, Image as ImageIcon, X } from "lucide-react";
import { Banner } from "@/types/banner";
import { bannerCreateSchema } from "@/lib/validation";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [newBanner, setNewBanner] = useState({
    title: "",
    imageUrl: "",
    linkTo: "",
    isActive: true,
    sortOrder: 1,
  });

  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: "success" | "error" | "warning", message: string) => {
    setToasts((prev) => [...prev, { id: String(Date.now()), type, message }]);
  };

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/banners?all=true");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setBanners(data.data);
      }
    } catch {
      addToast("error", "Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = bannerCreateSchema.safeParse(newBanner);
    if (!validation.success) {
      addToast("error", validation.error.issues[0]?.message ?? "Please check the banner form.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      const data = await res.json();
      if (data.success) {
        addToast("success", "Banner created successfully!");
        setModalOpen(false);
        setNewBanner({ title: "", imageUrl: "", linkTo: "", isActive: true, sortOrder: 1 });
        fetchBanners();
      } else {
        addToast("error", data.error || "Failed to create banner");
      }
    } catch {
      addToast("error", "Network error creating banner");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (banner: Banner) => {
    try {
      const updatedStatus = !banner.isActive;
      const res = await fetch(`/api/banners/${banner.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: updatedStatus }),
      });
      const data = await res.json();
      if (data.success) {
        addToast("success", `Status updated for ${banner.title}`);
        setBanners((prev) =>
          prev.map((b) => (b.id === banner.id ? { ...b, isActive: updatedStatus } : b))
        );
      }
    } catch {
      addToast("error", "Failed to update status");
    }
  };

  const handleSortOrder = async (bannerId: string, sortOrder: number) => {
    setBanners((current) =>
      current.map((banner) => (banner.id === bannerId ? { ...banner, sortOrder } : banner)),
    );
    try {
      const response = await fetch(`/api/banners/${bannerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? "Unable to update sort order.");
      }
      setBanners((current) => [...current].sort((a, b) => a.sortOrder - b.sortOrder));
    } catch (error) {
      addToast("error", error instanceof Error ? error.message : "Unable to update sort order.");
      fetchBanners();
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/banners/${deleteTarget.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        addToast("success", "Banner deleted");
        setBanners((prev) => prev.filter((b) => b.id !== deleteTarget.id));
      } else {
        addToast("error", data.error || "Failed to delete banner");
      }
    } catch {
      addToast("error", "Network error deleting banner");
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-black text-gray-900">Banners Manager</h1>
          <p className="text-xs font-bold text-gray-500">
            Promotional banners &amp; campaign images for homepage
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Banner</span>
        </button>
      </div>

      {/* Grid of Banners */}
      {loading ? (
        <LoadingSkeleton variant="stats" />
      ) : banners.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 mx-auto">
            <ImageIcon className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-sm text-gray-900">No Banners Created</h3>
          <p className="text-xs text-gray-500">Click &quot;Add New Banner&quot; above to create a promotional banner.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs flex flex-col justify-between"
            >
              <div className="relative h-44 w-full bg-gray-100 border-b border-gray-100 flex items-center justify-center overflow-hidden">
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleToggleActive(banner)}
                  className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[0.65rem] font-black uppercase shadow-xs transition-colors ${
                    banner.isActive ? "bg-emerald-500 text-white" : "bg-gray-700 text-white"
                  }`}
                >
                  {banner.isActive ? "Active" : "Disabled"}
                </button>
              </div>

              <div className="p-4 space-y-3">
                <h3 className="font-bold text-sm text-gray-900 leading-tight">{banner.title}</h3>

                {banner.linkTo && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold truncate">
                    <LinkIcon className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{banner.linkTo}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <label className="flex items-center gap-2 text-[0.68rem] font-bold text-gray-500">
                    <span>Sort</span>
                    <input
                      type="number"
                      min={0}
                      max={999}
                      value={banner.sortOrder}
                      onChange={(event) => setBanners((current) => current.map((item) =>
                        item.id === banner.id
                          ? { ...item, sortOrder: Number(event.target.value) }
                          : item,
                      ))}
                      onBlur={(event) => handleSortOrder(banner.id, Number(event.currentTarget.value))}
                      className="w-16 rounded-lg border border-gray-200 px-2 py-1 text-center text-gray-900 focus:border-amber-500 focus:outline-none"
                    />
                  </label>

                  <button
                    onClick={() => setDeleteTarget(banner)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete banner"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Banner Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900">Add New Banner</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBanner} className="space-y-4 text-xs">
              <FormField
                label="Banner Title"
                required
                value={newBanner.title}
                onChange={(v) => setNewBanner((p) => ({ ...p, title: v }))}
                placeholder="e.g. Summer Special 20% Off"
              />

              <ImageUploader
                label="Banner Image"
                folder="banners"
                value={newBanner.imageUrl}
                onUpload={(url) => setNewBanner((p) => ({ ...p, imageUrl: url }))}
              />

              <FormField
                label="Target Link (Optional)"
                value={newBanner.linkTo}
                onChange={(v) => setNewBanner((p) => ({ ...p, linkTo: v }))}
                placeholder="/cups?pack=12"
              />

              <FormField
                label="Sort Order"
                type="number"
                value={newBanner.sortOrder}
                onChange={(v) => setNewBanner((p) => ({ ...p, sortOrder: Number(v) }))}
              />

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 font-bold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold"
                >
                  {submitting ? "Creating..." : "Save Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Banner?"
        message={`Are you sure you want to delete banner "${deleteTarget?.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteLoading}
      />

      <AdminToast toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((item) => item.id !== id))} />
    </div>
  );
}
