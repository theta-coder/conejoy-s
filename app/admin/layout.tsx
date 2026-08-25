"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import AuthGuard from "@/components/admin/AuthGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { AuthProvider } from "@/hooks/useAuth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

  React.useEffect(() => {
    if (pathname === "/admin/login") return;
    fetch("/api/orders?status=pending&page=1&limit=1")
      .then((response) => response.json())
      .then((payload) => setPendingOrdersCount(payload.pagination?.total ?? 0))
      .catch(() => setPendingOrdersCount(0));
  }, [pathname]);

  // If on standalone login page, don't show admin sidebar/topbar shell
  if (pathname === "/admin/login") {
    return <AuthProvider>{children}</AuthProvider>;
  }

  return (
    <AuthProvider>
      <AuthGuard>
        <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
        {/* Sidebar */}
        <AdminSidebar
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
          pendingOrdersCount={pendingOrdersCount}
        />

        {/* Main Wrapper */}
        <div className="flex-1 flex flex-col md:pl-16 lg:pl-60 transition-all duration-200">
          <AdminTopbar onMenuClick={() => setMobileSidebarOpen(true)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
            {children}
          </main>
        </div>
        </div>
      </AuthGuard>
    </AuthProvider>
  );
}
