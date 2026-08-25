"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import DataTable from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import AdminToast, { ToastMessage } from "@/components/admin/AdminToast";
import { Plus, Edit3, Trash2 } from "lucide-react";
import { Flavour } from "@/types/flavour";

export default function AdminFlavoursPage() {
  const [flavours, setFlavours] = useState<Flavour[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Flavour | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: "success" | "error" | "warning", message: string) => {
    setToasts((prev) => [...prev, { id: String(Date.now()), type, message }]);
  };

  const fetchFlavours = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/flavours?all=true");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setFlavours(data.data);
      }
    } catch {
      addToast("error", "Failed to fetch flavours");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlavours();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/flavours/${deleteTarget.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        addToast("success", `Flavour "${deleteTarget.name}" deleted`);
        fetchFlavours();
      } else {
        addToast("error", data.error || "Failed to delete flavour");
      }
    } catch {
      addToast("error", "Network error while deleting");
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  const handleToggleActive = async (flavour: Flavour) => {
    try {
      const updatedStatus = !flavour.isActive;
      const res = await fetch(`/api/flavours/${flavour.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: updatedStatus }),
      });
      const data = await res.json();
      if (data.success) {
        addToast("success", `Status updated for ${flavour.name}`);
        setFlavours((prev) =>
          prev.map((f) => (f.id === flavour.id ? { ...f, isActive: updatedStatus } : f))
        );
      }
    } catch {
      addToast("error", "Failed to toggle status");
    }
  };

  const columns = [
    {
      header: "Image",
      cell: (row: Flavour) => (
        <div
          className="relative h-10 w-10 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center p-1"
          style={{ backgroundColor: `color-mix(in srgb, ${row.color || "#faa926"} 20%, white)` }}
        >
          <Image
            src={row.images?.cone?.webp || row.images?.cone?.png || "/assets/mascot-logo.png"}
            alt={row.name}
            width={40}
            height={40}
            className="object-contain h-full w-auto drop-shadow-xs"
          />
        </div>
      ),
    },
    {
      header: "Name",
      accessorKey: "name" as keyof Flavour,
      sortable: true,
      cell: (row: Flavour) => (
        <span className="font-extrabold text-gray-900">{row.name}</span>
      ),
    },
    {
      header: "Color Swatch",
      accessorKey: "color" as keyof Flavour,
      cell: (row: Flavour) => (
        <div className="flex items-center gap-2">
          <span
            className="h-4 w-4 rounded-full border border-gray-300 shadow-xs"
            style={{ backgroundColor: row.color }}
          />
          <span className="font-mono text-[0.7rem] text-gray-500">{row.color}</span>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (row: Flavour) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleToggleActive(row);
          }}
          className={`px-2.5 py-1 rounded-full text-[0.65rem] font-black uppercase tracking-wider transition-colors cursor-pointer ${
            row.isActive
              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          {row.isActive ? "Active" : "Inactive"}
        </button>
      ),
    },
    {
      header: "Sort Order",
      accessorKey: "sortOrder" as keyof Flavour,
      sortable: true,
    },
    {
      header: "Actions",
      cell: (row: Flavour) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Link
            href={`/admin/flavours/${row.id}`}
            className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            title="Edit Flavour"
          >
            <Edit3 className="h-4 w-4" />
          </Link>
          <button
            onClick={() => setDeleteTarget(row)}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Delete Flavour"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-black text-gray-900">Flavours Manager</h1>
          <p className="text-xs font-bold text-gray-500">
            Manage your signature ice cream flavours, images &amp; colors
          </p>
        </div>

        <Link
          href="/admin/flavours/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Flavour</span>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={flavours}
        loading={loading}
        searchPlaceholder="Search by flavour name or color..."
      />

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Flavour?"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action will permanently remove it.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteLoading}
      />

      <AdminToast toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((item) => item.id !== id))} />
    </div>
  );
}
