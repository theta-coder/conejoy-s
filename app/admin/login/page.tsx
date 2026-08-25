"use client";

import BrandLogo from "@/components/BrandLogo";
import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";

function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedRedirect = searchParams.get("redirect") || "/admin";
  const redirectPath =
    requestedRedirect.startsWith("/admin") && !requestedRedirect.startsWith("//")
      ? requestedRedirect
      : "/admin";

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoadingEmail(true);

    try {
      await signIn(email, password);
      router.push(redirectPath);
    } catch (err: any) {
      setError(err?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoadingGoogle(true);

    try {
      await signInWithGoogle();
      router.push(redirectPath);
    } catch (err: any) {
      setError(err?.message || "Google sign-in failed. Please try again.");
    } finally {
      setLoadingGoogle(false);
    }
  };

  const isBusy = loadingEmail || loadingGoogle;

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

        {/* Google Sign-in Option */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isBusy}
          className="w-full min-h-[48px] rounded-xl border-2 border-gray-200 hover:border-[#4a2618]/30 bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs flex items-center justify-center gap-3 shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          {loadingGoogle ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-gray-400 border-t-gray-800 animate-spin" />
              Connecting to Google...
            </span>
          ) : (
            <>
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-200 w-full" />
          <span className="bg-white px-3 text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest relative">
            Or sign in with email
          </span>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                required
                disabled={isBusy}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@conejoys.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 disabled:bg-gray-50"
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
                disabled={isBusy}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 disabled:bg-gray-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isBusy}
            className="w-full min-h-[46px] mt-2 rounded-xl bg-[#4a2618] hover:bg-[#381c11] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-transform active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {loadingEmail ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Signing In...
              </span>
            ) : (
              <>
                <span>Sign In with Email</span>
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
