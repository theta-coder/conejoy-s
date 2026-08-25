"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import StatCard from "@/components/admin/StatCard";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import LoadingSkeleton from "@/components/admin/LoadingSkeleton";
import { Package, DollarSign, IceCream, Clock, Plus, Receipt, Eye, BarChart3 } from "lucide-react";
import { Order } from "@/types/order";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeFlavoursCount, setActiveFlavoursCount] = useState<number>(12);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [ordersRes, flavoursRes] = await Promise.all([
          fetch("/api/orders?limit=100").then((r) => r.json()).catch(() => ({ data: [] })),
          fetch("/api/flavours").then((r) => r.json()).catch(() => ({ data: [] })),
        ]);

        if (ordersRes.success && Array.isArray(ordersRes.data)) {
          setOrders(ordersRes.data);
        }
        if (flavoursRes.success && Array.isArray(flavoursRes.data)) {
          setActiveFlavoursCount(flavoursRes.data.filter((f: any) => f.isActive).length);
        }
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const todayKey = new Date().toDateString();
  const todayOrders = orders.filter((order) => new Date(order.createdAt).toDateString() === todayKey);
  const totalOrdersToday = todayOrders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const revenueToday = todayOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + (o.total || 0), 0);
  const flavourCounts = orders
    .flatMap((order) => order.items ?? [])
    .reduce<Record<string, number>>((counts, item) => {
      counts[item.flavour] = (counts[item.flavour] ?? 0) + item.quantity;
      return counts;
    }, {});
  const popularFlavours = Object.entries(flavourCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const highestFlavourCount = popularFlavours[0]?.[1] ?? 1;

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
      accessorKey: "items" as keyof Order,
      cell: (row: Order) => (
        <span className="truncate max-w-[200px] inline-block font-semibold">
          {row.items?.map((i) => `${i.flavour} (${i.type})`).join(", ") || "Scoop items"}
        </span>
      ),
    },
    {
      header: "Total",
      accessorKey: "total" as keyof Order,
      cell: (row: Order) => (
        <span className="font-extrabold text-amber-600">Rs. {row.total}</span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status" as keyof Order,
      cell: (row: Order) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      header: "Action",
      cell: (row: Order) => (
        <Link
          href={`/admin/orders/${row.orderId}`}
          className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg inline-flex items-center gap-1 font-bold text-[0.7rem]"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>View</span>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-black text-gray-900">Dashboard</h1>
          <p className="text-xs font-bold text-gray-500">
            Overview of store activity, sales &amp; recent orders
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/flavours/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Flavour</span>
          </Link>
          <Link
            href="/admin/menu"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-xs transition-colors"
          >
            <Receipt className="h-4 w-4 text-amber-600" />
            <span>Update Prices</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards Row */}
      {loading ? (
        <LoadingSkeleton variant="stats" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Orders Today"
            value={totalOrdersToday}
            icon={Package}
            color="amber"
          />
          <StatCard
            title="Revenue Today"
            value={`Rs. ${revenueToday}`}
            icon={DollarSign}
            color="emerald"
          />
          <StatCard
            title="Active Flavours"
            value={`${activeFlavoursCount} / 12`}
            icon={IceCream}
            color="purple"
          />
          <StatCard
            title="Pending Orders"
            value={pendingOrders}
            icon={Clock}
            color="blue"
          />
        </div>
      )}

      {/* Recent Orders Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-base text-gray-900">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-amber-600 hover:underline"
          >
            View all orders &rarr;
          </Link>
        </div>

        <DataTable
          columns={columns}
          data={orders.slice(0, 10)}
          loading={loading}
          searchable={false}
        />
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-amber-600" />
          <div>
            <h2 className="font-bold text-base text-gray-900">Popular Flavours</h2>
            <p className="text-xs font-semibold text-gray-500">Based on the latest 100 orders</p>
          </div>
        </div>
        {popularFlavours.length === 0 ? (
          <p className="rounded-xl bg-gray-50 p-6 text-center text-xs font-semibold text-gray-500">
            Flavour trends will appear after orders are added.
          </p>
        ) : (
          <div className="space-y-3">
            {popularFlavours.map(([name, count]) => (
              <div key={name} className="grid grid-cols-[7rem_1fr_2rem] items-center gap-3 text-xs">
                <span className="truncate font-bold text-gray-700">{name}</span>
                <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-amber-500"
                    style={{ width: `${Math.max(8, (count / highestFlavourCount) * 100)}%` }}
                  />
                </div>
                <span className="text-right font-black text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
