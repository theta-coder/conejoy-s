"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import StatusBadge from "@/components/admin/StatusBadge";
import FormField from "@/components/admin/FormField";
import AdminToast, { ToastMessage } from "@/components/admin/AdminToast";
import LoadingSkeleton from "@/components/admin/LoadingSkeleton";
import { ArrowLeft, Check, Clock, Truck, CheckCircle2, XCircle, Save, Phone, MapPin, User as UserIcon } from "lucide-react";
import { Order, OrderStatus } from "@/types/order";

const STATUS_STEPS: OrderStatus[] = ["pending", "confirmed", "preparing", "delivered"];

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<OrderStatus>("pending");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: "success" | "error" | "warning", message: string) => {
    setToasts((prev) => [...prev, { id: String(Date.now()), type, message }]);
  };

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        const data = await res.json();
        if (data.success && data.data) {
          setOrder(data.data);
          setStatus(data.data.status);
          setNotes(data.data.notes || "");
        } else {
          addToast("error", "Order not found");
        }
      } catch {
        addToast("error", "Failed to load order detail");
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  const handleSaveUpdate = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
      const data = await res.json();
      if (data.success) {
        addToast("success", "Order updated successfully!");
        setOrder((prev) => (prev ? { ...prev, status, notes } : null));
      } else {
        addToast("error", data.error || "Failed to update order");
      }
    } catch {
      addToast("error", "Network error updating order");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSkeleton variant="card" />;
  if (!order) return <p className="text-sm font-bold text-red-500">Order not found.</p>;

  const currentStepIdx = STATUS_STEPS.indexOf(order.status);
  const isCancelled = order.status === "cancelled";

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
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-black text-gray-900">
                Order #{order.orderId}
              </h1>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-xs font-bold text-gray-500">
              Placed on {new Date(order.createdAt).toLocaleString()} &bull; Source: {order.source}
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveUpdate}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-transform active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          <Save className="h-4 w-4" />
          <span>{saving ? "Saving..." : "Save Order Changes"}</span>
        </button>
      </div>

      {/* Visual Status Progress Timeline */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
        <h2 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-4">
          Order Status Progress
        </h2>

        {isCancelled ? (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 text-red-700 font-bold text-xs">
            <XCircle className="h-5 w-5 shrink-0" />
            <span>This order has been cancelled.</span>
          </div>
        ) : (
          <div className="flex items-center justify-between relative max-w-2xl mx-auto py-2">
            {STATUS_STEPS.map((step, idx) => {
              const isCompleted = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;

              return (
                <div key={step} className="flex flex-col items-center z-10">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold text-xs transition-all ${
                      isCompleted
                        ? "bg-amber-500 border-amber-500 text-white shadow-xs"
                        : "bg-white border-gray-200 text-gray-400"
                    } ${isCurrent ? "ring-4 ring-amber-100" : ""}`}
                  >
                    {isCompleted ? <Check className="h-5 w-5 stroke-[3]" /> : idx + 1}
                  </div>
                  <span className={`mt-2 text-[0.7rem] font-black uppercase tracking-wider ${
                    isCompleted ? "text-amber-700" : "text-gray-400"
                  }`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Customer Info & Status Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Details */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-xs">
          <h2 className="font-bold text-sm text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
            <UserIcon className="h-4 w-4 text-amber-600" />
            <span>Customer Details</span>
          </h2>

          <div className="space-y-3 text-xs font-semibold text-gray-700">
            <div>
              <span className="text-[0.68rem] text-gray-400 uppercase tracking-wider font-extrabold block">
                Name
              </span>
              <span className="text-sm font-bold text-gray-900">{order.customerName}</span>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-gray-400" />
              <a href={`tel:${order.customerPhone}`} className="hover:underline font-bold text-amber-600">
                {order.customerPhone}
              </a>
            </div>

            {order.customerAddress && (
              <div className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-gray-400 mt-0.5" />
                <span>{order.customerAddress}</span>
              </div>
            )}
          </div>
        </div>

        {/* Update Status & Notes */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-xs">
          <h2 className="font-bold text-sm text-gray-900 pb-2 border-b border-gray-100">
            Order Controls
          </h2>

          <FormField
            label="Order Status"
            type="select"
            value={status}
            onChange={(v) => setStatus(v as OrderStatus)}
            options={[
              { label: "Pending", value: "pending" },
              { label: "Confirmed", value: "confirmed" },
              { label: "Preparing", value: "preparing" },
              { label: "Delivered", value: "delivered" },
              { label: "Cancelled", value: "cancelled" },
            ]}
          />

          <FormField
            label="Internal Notes"
            type="textarea"
            rows={3}
            value={notes}
            onChange={(v) => setNotes(v)}
            placeholder="Special instructions or delivery notes..."
          />
        </div>
      </div>

      {/* Itemized Order Breakdown */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-xs">
        <h2 className="font-bold text-sm text-gray-900 pb-2 border-b border-gray-100">
          Itemized Summary
        </h2>

        <div className="divide-y divide-gray-100">
          {order.items?.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between text-xs">
              <div>
                <span className="font-extrabold text-gray-900">{item.flavour}</span>{" "}
                <span className="font-bold text-amber-700">({item.type})</span>
                {item.size && <span className="text-gray-500"> &bull; {item.size}</span>}
                {item.flavourBreakdownText && (
                  <p className="text-[0.68rem] text-gray-500 font-semibold mt-1 whitespace-pre-line">
                    {item.flavourBreakdownText}
                  </p>
                )}
              </div>
              <div className="text-right">
                <span className="font-semibold text-gray-600">
                  x{item.quantity} @ Rs. {item.unitPrice}
                </span>
                <p className="font-extrabold text-gray-900">
                  Rs. {item.unitPrice * item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-100 space-y-1.5 text-xs text-right">
          <div className="flex justify-between text-gray-600 font-semibold">
            <span>Subtotal</span>
            <span>Rs. {order.subtotal}</span>
          </div>
          <div className="flex justify-between text-gray-600 font-semibold">
            <span>Delivery Fee</span>
            <span>Rs. {order.deliveryFee}</span>
          </div>
          <div className="flex justify-between font-black text-sm text-gray-900 pt-2 border-t border-gray-100">
            <span>Total Amount</span>
            <span className="text-amber-600">Rs. {order.total}</span>
          </div>
        </div>
      </div>

      <AdminToast toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((item) => item.id !== id))} />
    </div>
  );
}
