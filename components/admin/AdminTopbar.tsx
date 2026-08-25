"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronRight, Store } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AdminTopbarProps {
  onMenuClick?: () => void;
  title?: string;
}

export default function AdminTopbar({ onMenuClick, title }: AdminTopbarProps) {
  const pathname = usePathname();
  const { admin } = useAuth();

  const pathSegments = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => ({
      name: segment.charAt(0).toUpperCase() + segment.slice(1),
      href: "/" + pathname.split("/").slice(1, pathname.split("/").indexOf(segment) + 1).join("/"),
    }));

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white/90 px-4 sm:px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          aria-label="Open sidebar menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-500">
          <Link href="/admin" className="hover:text-amber-600 transition-colors">
            Admin
          </Link>
          {pathSegments.slice(1).map((segment, idx) => (
            <React.Fragment key={segment.href}>
              <ChevronRight className="h-3.5 w-3.5 text-gray-400 shrink-0" />
              {idx === pathSegments.length - 2 ? (
                <span className="font-bold text-gray-900">{title || segment.name}</span>
              ) : (
                <Link href={segment.href} className="hover:text-amber-600 transition-colors">
                  {segment.name}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Quick link to live store */}
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Store className="h-3.5 w-3.5 text-amber-600" />
          <span className="max-sm:hidden">View Shop</span>
        </a>

        <div className="h-5 w-[1px] bg-gray-200" />

        {/* User Info */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white font-black text-xs shadow-xs">
            {admin?.displayName?.charAt(0) || "A"}
          </div>
          <span className="hidden sm:inline-block text-xs font-bold text-gray-800">
            {admin?.displayName || "Admin User"}
          </span>
        </div>
      </div>
    </header>
  );
}
