import BrandLogo from "@/components/BrandLogo";
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  IceCream,
  Receipt,
  Package,
  Image as ImageIcon,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  pendingOrdersCount?: number;
}

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Flavours", href: "/admin/flavours", icon: IceCream },
  { label: "Menu & Pricing", href: "/admin/menu", icon: Receipt },
  { label: "Orders", href: "/admin/orders", icon: Package, badgeKey: "orders" },
  { label: "Banners", href: "/admin/banners", icon: ImageIcon },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({
  mobileOpen = false,
  onMobileClose,
  pendingOrdersCount = 0,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { admin, signOut } = useAuth();

  const isLinkActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const navContent = (
    <div className="flex h-full flex-col justify-between bg-white border-r border-gray-200 text-gray-800">
      {/* Header / Logo */}
      <div>
        <div className="flex h-16 items-center justify-between px-3 lg:px-5 border-b border-gray-100">
          <Link href="/admin" className="flex items-center gap-2">
            <BrandLogo className="h-8 w-auto object-contain max-md:h-7" />
          </Link>
          {onMobileClose && (
            <button
              onClick={onMobileClose}
              className="md:hidden p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Nav Links */}
        <nav className="p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isLinkActive(item.href);
            const showBadge = item.badgeKey === "orders" && pendingOrdersCount > 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  active
                    ? "bg-amber-50 text-amber-700 font-bold shadow-xs"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-5 w-5 transition-colors ${
                      active ? "text-amber-600" : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />
                  <span className="md:hidden lg:inline">{item.label}</span>
                </div>

                {showBadge && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-500 text-[0.65rem] font-extrabold text-white px-1.5 shadow-xs animate-pulse">
                    {pendingOrdersCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / User Profile & Logout */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800 font-bold text-sm">
              {admin?.displayName?.charAt(0) || "A"}
            </div>
            <div className="flex flex-col overflow-hidden md:hidden lg:flex">
              <span className="text-xs font-bold text-gray-900 truncate">
                {admin?.displayName || "Store Admin"}
              </span>
              <span className="text-[0.68rem] font-semibold text-gray-500 capitalize truncate">
                {admin?.role || "admin"}
              </span>
            </div>
          </div>

          <button
            onClick={() => signOut()}
            title="Sign Out"
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop / Tablet Sidebar */}
      <aside className="hidden md:block fixed top-0 left-0 bottom-0 z-30 w-16 lg:w-60 transition-[width] duration-200">
        {navContent}
      </aside>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex items-end">
          <div
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs transition-opacity"
            onClick={onMobileClose}
          />
          <aside className="relative z-50 w-full max-h-[82vh] rounded-t-3xl overflow-hidden shadow-2xl">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
