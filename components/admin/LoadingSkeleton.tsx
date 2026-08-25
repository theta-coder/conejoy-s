"use client";

import React from "react";

interface LoadingSkeletonProps {
  variant?: "table" | "card" | "form" | "stats";
}

export default function LoadingSkeleton({ variant = "table" }: LoadingSkeletonProps) {
  if (variant === "stats") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-white rounded-2xl border border-gray-200 p-4" />
        ))}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className="w-full bg-white rounded-2xl border border-gray-200 p-6 space-y-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded-md w-1/3" />
        <div className="h-10 bg-gray-200 rounded-md w-full" />
      </div>
    );
  }

  if (variant === "form") {
    return (
      <div className="w-full bg-white rounded-2xl border border-gray-200 p-6 space-y-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded-md w-1/4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-10 bg-gray-200 rounded-xl" />
          <div className="h-10 bg-gray-200 rounded-xl" />
        </div>
        <div className="h-24 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 p-4 space-y-4 animate-pulse">
      <div className="h-8 bg-gray-200 rounded-md w-full" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-10 bg-gray-100 rounded-md w-full" />
      ))}
    </div>
  );
}
