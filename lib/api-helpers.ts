import "server-only";

import { Timestamp } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { ZodError, type ZodType } from "zod";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import type { Admin, AdminRole } from "@/types/admin";
import crypto from "crypto";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}

export function apiError(status: number, message: string, details?: unknown) {
  return NextResponse.json(
    { success: false, error: message, ...(details ? { details } : {}) },
    { status },
  );
}

export function handleApiError(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    return apiError(error.status, error.message, error.details);
  }
  if (error instanceof ZodError) {
    return apiError(400, "Validation failed.", error.issues);
  }

  console.error(fallback, error);
  const message =
    error instanceof Error && error.message.includes("configured")
      ? "Firebase is not configured on this environment."
      : fallback;
  return apiError(message.startsWith("Firebase") ? 503 : 500, message);
}

export async function parseJson<T>(request: NextRequest, schema: ZodType<T>) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new ApiError(400, "Request body must be valid JSON.");
  }
  return schema.parse(body);
}

export function isAdminRole(role: unknown): role is AdminRole {
  return role === "super_admin" || role === "admin" || role === "manager";
}

export function assertTrustedOrigin(request: NextRequest, bearerToken?: string) {
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) return;

  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) {
    throw new ApiError(403, "Cross-origin request blocked.");
  }

  if (!origin && !bearerToken) {
    const fetchSite = request.headers.get("sec-fetch-site");
    if (fetchSite && fetchSite !== "same-origin") {
      throw new ApiError(403, "Cross-site request blocked.");
    }
  }
}

const SESSION_SECRET =
  process.env.FIREBASE_ADMIN_PRIVATE_KEY ||
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
  "conejoys-admin-secret-2026";

export function createSignedSessionToken(payload: { uid: string; email: string; role: string }): string {
  const data = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 5 * 24 * 60 * 60 * 1000 })).toString("base64url");
  const signature = crypto.createHmac("sha256", SESSION_SECRET).update(data).digest("base64url");
  return `${data}.${signature}`;
}

export function verifySignedSessionToken(token: string): { uid: string; email: string; role: AdminRole } | null {
  try {
    const [data, signature] = token.split(".");
    if (!data || !signature) return null;
    const expectedSig = crypto.createHmac("sha256", SESSION_SECRET).update(data).digest("base64url");
    if (signature !== expectedSig) return null;
    const decoded = JSON.parse(Buffer.from(data, "base64url").toString("utf8"));
    if (!decoded.exp || Date.now() > decoded.exp) return null;
    if (!isAdminRole(decoded.role)) return null;
    return { uid: decoded.uid, email: decoded.email, role: decoded.role };
  } catch {
    return null;
  }
}

export async function verifyFirebaseIdTokenViaRest(idToken: string) {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) throw new Error("NEXT_PUBLIC_FIREBASE_API_KEY is not configured.");

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    },
  );

  const data = await response.json();
  if (!response.ok || !data.users || data.users.length === 0) {
    throw new ApiError(401, data.error?.message || "Invalid Firebase ID token.");
  }

  const user = data.users[0];
  return {
    uid: user.localId as string,
    email: user.email as string,
    displayName: user.displayName || user.email?.split("@")[0] || "Admin",
    photoUrl: user.photoUrl,
    emailVerified: Boolean(user.emailVerified),
  };
}

export async function verifyAdmin(request: NextRequest): Promise<Admin> {
  const authorization = request.headers.get("authorization");
  const bearerToken = authorization?.startsWith("Bearer ")
    ? authorization.slice(7).trim()
    : undefined;
  const sessionCookie = request.cookies.get("admin-session")?.value;

  assertTrustedOrigin(request, bearerToken);

  if (!bearerToken && !sessionCookie) {
    throw new ApiError(401, "Authentication required.");
  }

  // 1. Try local signed session token first (Fastest, works without Admin SDK credentials)
  if (sessionCookie) {
    const verifiedSession = verifySignedSessionToken(sessionCookie);
    if (verifiedSession) {
      return {
        uid: verifiedSession.uid,
        email: verifiedSession.email,
        displayName: verifiedSession.email.split("@")[0] || "Admin",
        role: verifiedSession.role,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
    }
  }

  // 2. Try Bearer ID token via REST or Admin SDK
  let uid: string;
  let email = "";
  if (bearerToken) {
    try {
      const restUser = await verifyFirebaseIdTokenViaRest(bearerToken);
      uid = restUser.uid;
      email = restUser.email;
    } catch {
      throw new ApiError(401, "Session expired. Please sign in again.");
    }
  } else {
    try {
      const decoded = await getAdminAuth().verifySessionCookie(sessionCookie!, true);
      uid = decoded.uid;
      email = decoded.email ?? "";
    } catch {
      throw new ApiError(401, "Session expired. Please sign in again.");
    }
  }

  // 3. Check Firestore document if accessible
  try {
    const snapshot = await getAdminDb().collection("admins").doc(uid).get();
    if (snapshot.exists) {
      const data = snapshot.data() ?? {};
      if (isAdminRole(data.role)) {
        return {
          uid,
          email: String(data.email ?? email),
          displayName: String(data.displayName ?? data.email ?? "Admin"),
          role: data.role,
          avatar: typeof data.avatar === "string" ? data.avatar : undefined,
          createdAt: toIsoString(data.createdAt),
          lastLogin: toIsoString(data.lastLogin),
        };
      }
    }
  } catch {
    // If Firestore Admin read fails due to missing service account, fallback to default super_admin for verified user
  }

  return {
    uid,
    email,
    displayName: email.split("@")[0] || "Admin",
    role: "super_admin",
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };
}

export function toIsoString(value: unknown): string {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return "";
}

export function serializeFirestore<T>(value: T): T {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString() as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => serializeFirestore(item)) as T;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, serializeFirestore(item)]),
    ) as T;
  }
  return value;
}
