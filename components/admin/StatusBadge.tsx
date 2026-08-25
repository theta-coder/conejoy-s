"use client";

import React from "react";
import { OrderStatus } from "@/types/order";

interface StatusBadgeProps {
  status: OrderStatus | string;
  size?: "sm" | "md";
}

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  let badgeStyle = "bg-gray-100 text-gray-700 border-gray-200";

  switch (status.toLowerCase()) {
    case "pending":
      badgeStyle = "bg-amber-50 text-amber-800 border-amber-200";
      break;
    case "confirmed":
      badgeStyle = "bg-blue-50 text-blue-800 border-blue-200";
      break;
    case "preparing":
      badgeStyle = "bg-orange-50 text-orange-800 border-orange-200";
      break;
    case "delivered":
      badgeStyle = "bg-emerald-50 text-emerald-800 border-emerald-200";
      break;
    case "cancelled":
      badgeStyle = "bg-red-50 text-red-800 border-red-200";
      break;
  }

  const px = size === "sm" ? "px-2 py-0.5 text-[0.65rem]" : "px-3 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center rounded-full border font-extrabold uppercase tracking-wider ${badgeStyle} ${px}`}
    >
      {status}
    </span>
  );
}
