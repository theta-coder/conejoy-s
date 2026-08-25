"use client";

import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "firebase/auth";
import {
  loginWithEmail,
  loginWithGoogle,
  logoutUser,
  subscribeToAuthChanges,
} from "@/lib/firebase/auth";
import type { Admin } from "@/types/admin";

interface AuthContextValue {
  user: User | null;
  admin: Admin | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<Admin>;
  signInWithGoogle: () => Promise<Admin>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function startServerSession(user: User): Promise<Admin> {
  const idToken = await user.getIdToken(true);
  const response = await fetch("/api/auth/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  const payload = await response.json();
  if (!response.ok || !payload.success) {
    throw new Error(payload.error ?? "Admin verification failed.");
  }
  return payload.user as Admin;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: () => void = () => undefined;
    try {
      unsubscribe = subscribeToAuthChanges(async (currentUser) => {
        setUser(currentUser);
        setError(null);
        if (!currentUser) {
          setAdmin(null);
          setLoading(false);
          return;
        }

        try {
          setAdmin(await startServerSession(currentUser));
        } catch (sessionError) {
          setAdmin(null);
          setError(
            sessionError instanceof Error
              ? sessionError.message
              : "Session verification failed.",
          );
          await logoutUser().catch(() => undefined);
        } finally {
          setLoading(false);
        }
      });
    } catch (configurationError) {
      setError(
        configurationError instanceof Error
          ? configurationError.message
          : "Firebase authentication is not configured.",
      );
      setLoading(false);
    }
    return unsubscribe;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const authenticatedUser = await loginWithEmail(email, password);
      const verifiedAdmin = await startServerSession(authenticatedUser);
      setUser(authenticatedUser);
      setAdmin(verifiedAdmin);
      return verifiedAdmin;
    } catch (signInError) {
      await logoutUser().catch(() => undefined);
      const message =
        signInError instanceof Error ? signInError.message : "Unable to sign in.";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const authenticatedUser = await loginWithGoogle();
      const verifiedAdmin = await startServerSession(authenticatedUser);
      setUser(authenticatedUser);
      setAdmin(verifiedAdmin);
      return verifiedAdmin;
    } catch (signInError) {
      await logoutUser().catch(() => undefined);
      const message =
        signInError instanceof Error
          ? signInError.message
          : "Unable to sign in with Google.";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/session", { method: "DELETE" }).catch(() => undefined);
      await logoutUser().catch(() => undefined);
      setUser(null);
      setAdmin(null);
      window.location.assign("/admin/login");
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({ user, admin, loading, error, signIn, signInWithGoogle, signOut }),
    [user, admin, loading, error, signIn, signInWithGoogle, signOut],
  );
  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
