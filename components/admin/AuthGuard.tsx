"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { admin, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !admin && pathname !== "/admin/login") {
      router.push(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [admin, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 text-gray-800 p-4">
        <div className="relative flex items-center justify-center">
          <div className="h-14 w-14 rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin" />
          <div className="absolute font-black text-xs text-amber-600">CJ</div>
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-gray-500">
          Verifying Admin Credentials...
        </p>
      </div>
    );
  }

  if (!admin && pathname !== "/admin/login") {
    return null;
  }

  return <>{children}</>;
}
