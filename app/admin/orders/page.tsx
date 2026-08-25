"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import FormField from "@/components/admin/FormField";
import AdminToast, { ToastMessage } from "@/components/admin/AdminToast";
import { Eye, Plus, Package, X } from "lucide-react";
import { Order, OrderStatus } from "@/types/order";
import { orderCreateSchema } from "@/lib/validation";

const STATUS_TABS: Array<{ label: string; value: OrderStatus | "all" }> = [
  { label: "All Orders", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Preparing", value: "preparing" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<OrderStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Manual Order Modal State
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [manualForm, setManualForm] = useState({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    flavour: "Mango",
    type: "Cone" as "Cone" | "Cup" | "Pack" | "Shake",
    quantity: 1,
    unitPrice: 100,
    deliveryFee: 50,
  });

  const addToast = (type: "success" | "error" | "warning", message: string) => {
    setToasts((prev) => [...prev, { id: String(Date.now()), type, message }]);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = `/api/orders?page=${page}&limit=10${
        activeTab !== "all" ? `&status=${activeTab}` : ""
      }`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setOrders(data.data);
        if (data.pagination) setTotalOrders(data.pagination.total);
      }
    } catch {
      addToast("error", "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeTab, page]);

  const handleStatusChangeInline = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        addToast("success", `Order ${orderId} updated to ${newStatus}`);
        setOrders((prev) =>
          prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o))
        );
      } else {
        addToast("error", data.error || "Failed to update status");
      }
    } catch {
      addToast("error", "Network error updating status");
    }
  };

  const handleCreateManualOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const subtotal = manualForm.unitPrice * manualForm.quantity;
      const total = subtotal + manualForm.deliveryFee;

      const payload = {
        customerName: manualForm.customerName,
        customerPhone: manualForm.customerPhone,
        customerAddress: manualForm.customerAddress,
        items: [
          {
            id: `item-${Date.now()}`,
            type: manualForm.type,
            flavour: manualForm.flavour,
            quantity: manualForm.quantity,
            unitPrice: manualForm.unitPrice,
          },
        ],
        subtotal,
        deliveryFee: manualForm.deliveryFee,
        total,
        status: "confirmed" as OrderStatus,
        source: "admin_manual" as const,
      };

      const validation = orderCreateSchema.safeParse(payload);
      if (!validation.success) {
        addToast("error", validation.error.issues[0]?.message ?? "Please check the order fields.");
        return;
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      const data = await res.json();
      if (data.success) {
        addToast("success", "Manual order created successfully!");
        setManualModalOpen(false);
        fetchOrders();
      } else {
        addToast("error", data.error || "Failed to create order");
      }
    } catch {
      addToast("error", "Failed to create manual order");
    }
  };

  const columns = [
    {
      header: "Order ID",
      accessorKey: "orderId" as keyof Order,
      cell: (row: Order) => (
        <span className="font-extrabold text-gray-900">{row.orderId}</span>
      ),
    },
    {
      header: "Customer",
      accessorKey: "customerName" as keyof Order,
      cell: (row: Order) => (
        <div>
          <p className="font-bold text-gray-900">{row.customerName}</p>
          <p className="text-[0.68rem] text-gray-500">{row.customerPhone}</p>
        </div>
      ),
    },
    {
      header: "Items",
      cell: (row: Order) => (
        <span className="truncate max-w-[220px] inline-block font-semibold">
          {row.items?.map((i) => `${i.flavour} (${i.type}) x${i.quantity}`).join(", ") || "-"}
        </span>
      ),
    },
    {
      header: "Total",
      cell: (row: Order) => (
        <span className="font-extrabold text-amber-600">Rs. {row.total}</span>
      ),
    },
    {
      header: "Status",
      cell: (row: Order) => (
        <select
          value={row.status}
          onChange={(e) => handleStatusChangeInline(row.orderId, e.target.value as OrderStatus)}
          onClick={(e) => e.stopPropagation()}
          className="rounded-full border border-gray-200 px-2.5 py-1 text-xs font-bold bg-white text-gray-800 focus:outline-none focus:border-amber-500 cursor-pointer"
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="preparing">Preparing</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      ),
    },
    {
      header: "Date",
      cell: (row: Order) => (
        <span className="text-[0.7rem] font-medium text-gray-500">
          {new Date(row.createdAt).toLocaleDateString("en-PK", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
    {
      header: "Action",
      cell: (row: Order) => (
        <Link
          href={`/admin/orders/${row.orderId}`}
          className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg inline-flex items-center gap-1 font-bold text-[0.7rem]"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>Details</span>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-black text-gray-900">Orders Management</h1>
          <p className="text-xs font-bold text-gray-500">
            View, track &amp; update order fulfillment status
          </p>
        </div>

        <button
          onClick={() => setManualModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Create Manual Order</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {STATUS_TABS.map((tab) => {
          const active = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => {
                setActiveTab(tab.value);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                active
                  ? "bg-amber-500 text-white shadow-xs"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={orders}
        loading={loading}
        pagination={{
          page,
          limit: 10,
          total: totalOrders,
          onPageChange: (p) => setPage(p),
        }}
      />

      {/* Create Manual Order Modal */}
      {manualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900">Create Manual Order</h3>
              <button onClick={() => setManualModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateManualOrder} className="space-y-3 text-xs">
              <FormField
                label="Customer Name"
                required
                value={manualForm.customerName}
                onChange={(v) => setManualForm((p) => ({ ...p, customerName: v }))}
              />
              <FormField
                label="Customer Phone"
                required
                value={manualForm.customerPhone}
                onChange={(v) => setManualForm((p) => ({ ...p, customerPhone: v }))}
              />
              <FormField
                label="Delivery Address"
                value={manualForm.customerAddress}
                onChange={(v) => setManualForm((p) => ({ ...p, customerAddress: v }))}
              />

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  label="Flavour Name"
                  value={manualForm.flavour}
                  onChange={(v) => setManualForm((p) => ({ ...p, flavour: v }))}
                />
                <FormField
                  label="Product Type"
                  type="select"
                  options={[
                    { label: "Cone", value: "Cone" },
                    { label: "Cup", value: "Cup" },
                    { label: "Pack", value: "Pack" },
                    { label: "Shake", value: "Shake" },
                  ]}
                  value={manualForm.type}
                  onChange={(v) => setManualForm((p) => ({ ...p, type: v }))}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <FormField
                  label="Quantity"
                  type="number"
                  value={manualForm.quantity}
                  onChange={(v) => setManualForm((p) => ({ ...p, quantity: Number(v) }))}
                />
                <FormField
                  label="Unit Price (Rs.)"
                  type="number"
                  value={manualForm.unitPrice}
                  onChange={(v) => setManualForm((p) => ({ ...p, unitPrice: Number(v) }))}
                />
                <FormField
                  label="Delivery Fee"
                  type="number"
                  value={manualForm.deliveryFee}
                  onChange={(v) => setManualForm((p) => ({ ...p, deliveryFee: Number(v) }))}
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="font-extrabold text-sm text-gray-900">
                  Total: Rs. {manualForm.unitPrice * manualForm.quantity + manualForm.deliveryFee}
                </span>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs"
                >
                  Confirm Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AdminToast toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((item) => item.id !== id))} />
    </div>
  );
}
