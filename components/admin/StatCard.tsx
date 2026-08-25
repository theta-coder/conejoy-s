"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: "amber" | "blue" | "emerald" | "purple";
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp = true,
  color = "amber",
}: StatCardProps) {
  const colorMap = {
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  };

  return (
    <div className="flex items-center justify-between p-5 rounded-2xl bg-white border border-gray-200 shadow-xs">
      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500">{title}</p>
        <p className="text-2xl font-black text-gray-900">{value}</p>

        {trend && (
          <p className={`text-[0.68rem] font-bold ${trendUp ? "text-emerald-600" : "text-red-500"}`}>
            {trend}
          </p>
        )}
      </div>

      <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${colorMap[color]}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
}
