"use client";

import React, { useEffect, useState } from "react";
import FormField from "@/components/admin/FormField";
import AdminToast, { ToastMessage } from "@/components/admin/AdminToast";
import LoadingSkeleton from "@/components/admin/LoadingSkeleton";
import { Save, Store, Phone, Clock, Share2 } from "lucide-react";
import { SiteSettings } from "@/types/settings";
import { settingsSchema } from "@/lib/validation";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    storeName: "ConeJoy's Ice Cream",
    tagline: "Scoop Shop • Lahore",
    whatsappNumber: "+92 340 7258700",
    phone: "+92 340 7258700",
    address: "Main Multan Road, Opposite Police Station, Chung, Lahore",
    mapCoords: {
      lat: 31.4318,
      lng: 74.1733,
      iframeSrc:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3404.3583275345345!2d74.17333968704374!3d31.43180078514371!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919031eeb169d51%3A0xbd009e0a8cfba415!2sConejoys!5e0!3m2!1sen!2s!4v1787551872842!5m2!1sen!2s",
    },
    storeHours: { open: "12:00", close: "00:00" },
    socialLinks: {
      instagram: "https://instagram.com/conejoys.official",
      tiktok: "https://tiktok.com/@conejoys.official",
      youtube: "https://youtube.com/@conejoys.official",
      whatsapp: "https://wa.me/923407258700",
    },
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: "success" | "error" | "warning", message: string) => {
    setToasts((prev) => [...prev, { id: String(Date.now()), type, message }]);
  };

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.success && data.data) {
          setSettings(data.data);
        }
      } catch {
        addToast("error", "Failed to load settings");
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = settingsSchema.safeParse(settings);
    if (!result.success) {
      addToast("error", result.error.issues[0]?.message ?? "Please check the settings form.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const data = await res.json();
      if (data.success) {
        addToast("success", "Site settings updated successfully!");
      } else {
        addToast("error", data.error || "Failed to update settings");
      }
    } catch {
      addToast("error", "Network error updating settings");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSkeleton variant="form" />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-black text-gray-900">Site Settings</h1>
          <p className="text-xs font-bold text-gray-500">
            Configure store info, contact details &amp; operating hours
          </p>
        </div>

        <button
          type="submit"
          form="settings-form"
          disabled={submitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-transform active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          <Save className="h-4 w-4" />
          <span>{submitting ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>

      <form id="settings-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Store Info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-xs">
          <h2 className="font-bold text-sm text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
            <Store className="h-4 w-4 text-amber-600" />
            <span>Store Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Store Name"
              required
              value={settings.storeName}
              onChange={(v) => setSettings((p) => ({ ...p, storeName: v }))}
            />

            <FormField
              label="Tagline"
              value={settings.tagline}
              onChange={(v) => setSettings((p) => ({ ...p, tagline: v }))}
            />
          </div>
        </div>

        {/* Contact & Location */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-xs">
          <h2 className="font-bold text-sm text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
            <Phone className="h-4 w-4 text-amber-600" />
            <span>Contact &amp; Location</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="WhatsApp Ordering Number"
              required
              value={settings.whatsappNumber}
              onChange={(v) => setSettings((p) => ({ ...p, whatsappNumber: v }))}
            />

            <FormField
              label="Phone Number"
              value={settings.phone}
              onChange={(v) => setSettings((p) => ({ ...p, phone: v }))}
            />
          </div>

          <FormField
            label="Shop Physical Address"
            type="textarea"
            rows={2}
            value={settings.address}
            onChange={(v) => setSettings((p) => ({ ...p, address: v }))}
          />

          <FormField
            label="Google Maps Embed URL (Iframe Src)"
            type="textarea"
            rows={3}
            value={settings.mapCoords?.iframeSrc || ""}
            onChange={(v) =>
              setSettings((p) => ({
                ...p,
                mapCoords: { ...p.mapCoords, iframeSrc: v },
              }))
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Map Latitude"
              type="number"
              value={settings.mapCoords.lat}
              onChange={(v) => setSettings((p) => ({
                ...p,
                mapCoords: { ...p.mapCoords, lat: Number(v) },
              }))}
            />
            <FormField
              label="Map Longitude"
              type="number"
              value={settings.mapCoords.lng}
              onChange={(v) => setSettings((p) => ({
                ...p,
                mapCoords: { ...p.mapCoords, lng: Number(v) },
              }))}
            />
          </div>
        </div>

        {/* Hours & Social */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-xs">
          <h2 className="font-bold text-sm text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-600" />
            <span>Hours &amp; Social Links</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Opening Time (24-hour)"
              value={settings.storeHours.open}
              placeholder="12:00"
              onChange={(v) => setSettings((p) => ({
                ...p,
                storeHours: { ...p.storeHours, open: v },
              }))}
            />
            <FormField
              label="Closing Time (24-hour)"
              value={settings.storeHours.close}
              placeholder="00:00"
              onChange={(v) => setSettings((p) => ({
                ...p,
                storeHours: { ...p.storeHours, close: v },
              }))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <FormField
              label="Instagram URL"
              value={settings.socialLinks?.instagram || ""}
              onChange={(v) =>
                setSettings((p) => ({
                  ...p,
                  socialLinks: { ...p.socialLinks, instagram: v },
                }))
              }
            />

            <FormField
              label="WhatsApp Chat URL"
              value={settings.socialLinks?.whatsapp || ""}
              onChange={(v) =>
                setSettings((p) => ({
                  ...p,
                  socialLinks: { ...p.socialLinks, whatsapp: v },
                }))
              }
            />

            <FormField
              label="TikTok URL"
              value={settings.socialLinks?.tiktok || ""}
              onChange={(v) => setSettings((p) => ({
                ...p,
                socialLinks: { ...p.socialLinks, tiktok: v },
              }))}
            />

            <FormField
              label="YouTube URL"
              value={settings.socialLinks?.youtube || ""}
              onChange={(v) => setSettings((p) => ({
                ...p,
                socialLinks: { ...p.socialLinks, youtube: v },
              }))}
            />

            <FormField
              label="Facebook URL"
              value={settings.socialLinks?.facebook || ""}
              onChange={(v) => setSettings((p) => ({
                ...p,
                socialLinks: { ...p.socialLinks, facebook: v },
              }))}
            />
          </div>
        </div>
      </form>

      <AdminToast toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((item) => item.id !== id))} />
    </div>
  );
}
