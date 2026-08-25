import "server-only";

import { Timestamp } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { ZodError, type ZodType } from "zod";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import type { Admin, AdminRole } from "@/types/admin";

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

function isAdminRole(role: unknown): role is AdminRole {
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

  let uid: string;
  try {
    const decoded = bearerToken
      ? await getAdminAuth().verifyIdToken(bearerToken, true)
      : await getAdminAuth().verifySessionCookie(sessionCookie!, true);
    uid = decoded.uid;
  } catch {
    throw new ApiError(401, "Session expired. Please sign in again.");
  }

  const snapshot = await getAdminDb().collection("admins").doc(uid).get();
  if (!snapshot.exists) {
    throw new ApiError(403, "This account is not approved for admin access.");
  }

  const data = snapshot.data() ?? {};
  if (!isAdminRole(data.role)) {
    throw new ApiError(403, "This admin account has an invalid role.");
  }

  return {
    uid,
    email: String(data.email ?? ""),
    displayName: String(data.displayName ?? data.email ?? "Admin"),
    role: data.role,
    avatar: typeof data.avatar === "string" ? data.avatar : undefined,
    createdAt: toIsoString(data.createdAt),
    lastLogin: toIsoString(data.lastLogin),
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
