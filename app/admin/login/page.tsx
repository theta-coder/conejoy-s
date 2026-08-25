import BrandLogo from "@/components/BrandLogo";
"use client";

import React, { Suspense, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";

function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedRedirect = searchParams.get("redirect") || "/admin";
  const redirectPath = requestedRedirect.startsWith("/admin") && !requestedRedirect.startsWith("//")
    ? requestedRedirect
    : "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn(email, password);
      router.push(redirectPath);
    } catch (err: any) {
      setError(err?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fdf6e3] p-4 text-[#4a2618]">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#4a2618]/15 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header / Brand Logo */}
        <div className="flex flex-col items-center text-center space-y-2">
          <BrandLogo priority className="h-16 w-auto object-contain drop-shadow-sm mb-1" />
          <h1 className="font-display text-2xl font-black text-[#4a2618]">ConeJoy&apos;s Admin</h1>
          <p className="text-xs font-bold text-[#4a2618]/60 uppercase tracking-wider">
            Sign in to manage store &amp; orders
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold animate-fade-in">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@conejoys.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[46px] mt-2 rounded-xl bg-[#4a2618] hover:bg-[#381c11] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-transform active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Signing In...
              </span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100">
          <p className="text-[0.68rem] font-bold text-gray-400 uppercase tracking-widest">
            ConeJoy&apos;s Scoop Shop &bull; Lahore
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fdf6e3]" />}>
      <AdminLoginForm />
    </Suspense>
  );
}
