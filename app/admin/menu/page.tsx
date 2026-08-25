"use client";

import React, { useEffect, useState } from "react";
import FormField from "@/components/admin/FormField";
import AdminToast, { ToastMessage } from "@/components/admin/AdminToast";
import LoadingSkeleton from "@/components/admin/LoadingSkeleton";
import { Save, RefreshCw, IceCream, Utensils, GlassWater } from "lucide-react";
import { MenuPricingAll } from "@/types/menu";
import { menuSchemas } from "@/lib/validation";

export default function AdminMenuPricingPage() {
  const [activeTab, setActiveTab] = useState<"cones" | "cups" | "shakes">("cones");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [menuData, setMenuData] = useState<MenuPricingAll>({
    cones: { price: 100, originalPrice: 150, saving: 50 },
    cups: {
      sizes: [
        { id: "small", name: "Small Cup", scoops: 1, price: 160, originalPrice: 160 },
        { id: "medium", name: "Medium Cup", scoops: 2, price: 280, originalPrice: 280 },
        { id: "large", name: "Large Cup", scoops: 3, price: 390, originalPrice: 390 },
      ],
      packs: [
        { id: "small-pack", name: "6-Scoop Pack", scoops: 6, price: 420, originalPrice: 420 },
        { id: "family-pack", name: "Family Pack (12 Scoops)", scoops: 12, price: 820, originalPrice: 820 },
      ],
    },
    shakes: {
      sizes: {
        Regular: { volume: "350 ml", price: 420, originalPrice: 420 },
        Large: { volume: "500 ml", price: 580, originalPrice: 580 },
      },
    },
  });

  const addToast = (type: "success" | "error" | "warning", message: string) => {
    setToasts((prev) => [...prev, { id: String(Date.now()), type, message }]);
  };

  const fetchMenuData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/menu");
      const data = await res.json();
      if (data.success && data.data) {
        setMenuData((prev) => ({
          ...prev,
          ...data.data,
        }));
      }
    } catch {
      addToast("error", "Failed to fetch menu pricing");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  const handleSaveCategory = async (category: "cones" | "cups" | "shakes") => {
    const validation = category === "cones"
      ? menuSchemas.cones.safeParse(menuData.cones)
      : category === "cups"
        ? menuSchemas.cups.safeParse(menuData.cups)
        : menuSchemas.shakes.safeParse(menuData.shakes);
    if (!validation.success) {
      addToast("error", validation.error.issues[0]?.message ?? "Please check the pricing values.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = validation.data;
      const res = await fetch(`/api/menu/${category}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        addToast("success", `Updated ${category.toUpperCase()} pricing successfully!`);
      } else {
        addToast("error", data.error || "Failed to update pricing");
      }
    } catch {
      addToast("error", "Network error while saving");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSkeleton variant="form" />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-black text-gray-900">Menu &amp; Pricing Manager</h1>
          <p className="text-xs font-bold text-gray-500">
            Set scoop prices, pack rates &amp; shake sizes live across the store
          </p>
        </div>

        <button
          type="button"
          onClick={fetchMenuData}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-xs transition-colors"
        >
          <RefreshCw className="h-4 w-4 text-amber-600" />
          <span>Reload Prices</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-gray-200 shadow-xs">
        <button
          onClick={() => setActiveTab("cones")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
            activeTab === "cones"
              ? "bg-amber-500 text-white shadow-xs"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <IceCream className="h-4 w-4" />
          <span>Cones Pricing</span>
        </button>

        <button
          onClick={() => setActiveTab("cups")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
            activeTab === "cups"
              ? "bg-amber-500 text-white shadow-xs"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Utensils className="h-4 w-4" />
          <span>Cups &amp; Packs</span>
        </button>

        <button
          onClick={() => setActiveTab("shakes")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
            activeTab === "shakes"
              ? "bg-amber-500 text-white shadow-xs"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <GlassWater className="h-4 w-4" />
          <span>Shakes</span>
        </button>
      </div>

      {/* Cones Tab Content */}
      {activeTab === "cones" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 className="font-bold text-base text-gray-900">Cone Scoops Pricing</h2>
              <p className="text-xs font-semibold text-gray-500">
                Single scoop cone current price and original slashed rate
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleSaveCategory("cones")}
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-transform active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>Save Cones Rate</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
              label="Selling Price (Rs.)"
              type="number"
              value={menuData.cones.price}
              onChange={(val) =>
                setMenuData((p) => ({
                  ...p,
                  cones: {
                    ...p.cones,
                    price: Number(val),
                    saving: Math.max(0, p.cones.originalPrice - Number(val)),
                  },
                }))
              }
            />

            <FormField
              label="Original Price (Slashed Rs.)"
              type="number"
              value={menuData.cones.originalPrice}
              onChange={(val) =>
                setMenuData((p) => ({
                  ...p,
                  cones: {
                    ...p.cones,
                    originalPrice: Number(val),
                    saving: Math.max(0, Number(val) - p.cones.price),
                  },
                }))
              }
            />

            <FormField
              label="Auto Calculated Discount (Rs.)"
              disabled
              value={menuData.cones.saving}
              onChange={() => {}}
            />
          </div>
        </div>
      )}

      {/* Cups & Packs Tab Content */}
      {activeTab === "cups" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 className="font-bold text-base text-gray-900">Cups &amp; Multi-Flavour Packs</h2>
              <p className="text-xs font-semibold text-gray-500">
                Manage single-flavour cups and multi-flavour pack options
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleSaveCategory("cups")}
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-transform active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>Save Cups &amp; Packs</span>
            </button>
          </div>

          {/* Normal Cups Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase text-amber-700 tracking-wider">
              Single-Flavour Cups
            </h3>
            <div className="space-y-3">
              {menuData.cups.sizes.map((cup, idx) => (
                <div key={cup.id} className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <FormField
                    label="Cup Name"
                    value={cup.name}
                    onChange={(val) => {
                      const updated = [...menuData.cups.sizes];
                      updated[idx].name = val;
                      setMenuData((p) => ({ ...p, cups: { ...p.cups, sizes: updated } }));
                    }}
                  />
                  <FormField
                    label="Scoops"
                    type="number"
                    value={cup.scoops}
                    onChange={(val) => {
                      const updated = [...menuData.cups.sizes];
                      updated[idx].scoops = Number(val);
                      setMenuData((p) => ({ ...p, cups: { ...p.cups, sizes: updated } }));
                    }}
                  />
                  <FormField
                    label="Price (Rs.)"
                    type="number"
                    value={cup.price}
                    onChange={(val) => {
                      const updated = [...menuData.cups.sizes];
                      updated[idx].price = Number(val);
                      setMenuData((p) => ({ ...p, cups: { ...p.cups, sizes: updated } }));
                    }}
                  />
                  <FormField
                    label="Original Price (Rs.)"
                    type="number"
                    value={cup.originalPrice}
                    onChange={(val) => {
                      const updated = [...menuData.cups.sizes];
                      updated[idx].originalPrice = Number(val);
                      setMenuData((p) => ({ ...p, cups: { ...p.cups, sizes: updated } }));
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Multi-Flavour Packs Table */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <h3 className="text-xs font-extrabold uppercase text-amber-700 tracking-wider">
              Multi-Flavour Mix &amp; Match Packs
            </h3>
            <div className="space-y-3">
              {menuData.cups.packs.map((pack, idx) => (
                <div key={pack.id} className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 bg-amber-50/50 rounded-xl border border-amber-200">
                  <FormField
                    label="Pack Name"
                    value={pack.name}
                    onChange={(val) => {
                      const updated = [...menuData.cups.packs];
                      updated[idx].name = val;
                      setMenuData((p) => ({ ...p, cups: { ...p.cups, packs: updated } }));
                    }}
                  />
                  <FormField
                    label="Scoops"
                    type="number"
                    value={pack.scoops}
                    onChange={(val) => {
                      const updated = [...menuData.cups.packs];
                      updated[idx].scoops = Number(val);
                      setMenuData((p) => ({ ...p, cups: { ...p.cups, packs: updated } }));
                    }}
                  />
                  <FormField
                    label="Price (Rs.)"
                    type="number"
                    value={pack.price}
                    onChange={(val) => {
                      const updated = [...menuData.cups.packs];
                      updated[idx].price = Number(val);
                      setMenuData((p) => ({ ...p, cups: { ...p.cups, packs: updated } }));
                    }}
                  />
                  <FormField
                    label="Original Price (Rs.)"
                    type="number"
                    value={pack.originalPrice}
                    onChange={(val) => {
                      const updated = [...menuData.cups.packs];
                      updated[idx].originalPrice = Number(val);
                      setMenuData((p) => ({ ...p, cups: { ...p.cups, packs: updated } }));
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Shakes Tab Content */}
      {activeTab === "shakes" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 className="font-bold text-base text-gray-900">Thick Ice Cream Shakes Pricing</h2>
              <p className="text-xs font-semibold text-gray-500">
                Regular (350ml) and Large (500ml) shake volume rates
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleSaveCategory("shakes")}
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-transform active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>Save Shake Rates</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Regular Shake */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
              <h3 className="font-bold text-sm text-gray-900">Regular Shake</h3>
              <FormField
                label="Volume (e.g. 350 ml)"
                value={menuData.shakes.sizes.Regular.volume}
                onChange={(val) =>
                  setMenuData((p) => ({
                    ...p,
                    shakes: {
                      ...p.shakes,
                      sizes: {
                        ...p.shakes.sizes,
                        Regular: { ...p.shakes.sizes.Regular, volume: val },
                      },
                    },
                  }))
                }
              />
              <FormField
                label="Price (Rs.)"
                type="number"
                value={menuData.shakes.sizes.Regular.price}
                onChange={(val) =>
                  setMenuData((p) => ({
                    ...p,
                    shakes: {
                      ...p.shakes,
                      sizes: {
                        ...p.shakes.sizes,
                        Regular: { ...p.shakes.sizes.Regular, price: Number(val) },
                      },
                    },
                  }))
                }
              />
              <FormField
                label="Original Price (Rs.)"
                type="number"
                value={menuData.shakes.sizes.Regular.originalPrice}
                onChange={(val) =>
                  setMenuData((p) => ({
                    ...p,
                    shakes: {
                      ...p.shakes,
                      sizes: {
                        ...p.shakes.sizes,
                        Regular: { ...p.shakes.sizes.Regular, originalPrice: Number(val) },
                      },
                    },
                  }))
                }
              />
            </div>

            {/* Large Shake */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
              <h3 className="font-bold text-sm text-gray-900">Large Shake</h3>
              <FormField
                label="Volume (e.g. 500 ml)"
                value={menuData.shakes.sizes.Large.volume}
                onChange={(val) =>
                  setMenuData((p) => ({
                    ...p,
                    shakes: {
                      ...p.shakes,
                      sizes: {
                        ...p.shakes.sizes,
                        Large: { ...p.shakes.sizes.Large, volume: val },
                      },
                    },
                  }))
                }
              />
              <FormField
                label="Price (Rs.)"
                type="number"
                value={menuData.shakes.sizes.Large.price}
                onChange={(val) =>
                  setMenuData((p) => ({
                    ...p,
                    shakes: {
                      ...p.shakes,
                      sizes: {
                        ...p.shakes.sizes,
                        Large: { ...p.shakes.sizes.Large, price: Number(val) },
                      },
                    },
                  }))
                }
              />
              <FormField
                label="Original Price (Rs.)"
                type="number"
                value={menuData.shakes.sizes.Large.originalPrice}
                onChange={(val) =>
                  setMenuData((p) => ({
                    ...p,
                    shakes: {
                      ...p.shakes,
                      sizes: {
                        ...p.shakes.sizes,
                        Large: { ...p.shakes.sizes.Large, originalPrice: Number(val) },
                      },
                    },
                  }))
                }
              />
            </div>
          </div>
        </div>
      )}

      <AdminToast toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((item) => item.id !== id))} />
    </div>
  );
}
