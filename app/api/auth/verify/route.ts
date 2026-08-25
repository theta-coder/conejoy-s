import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  ApiError,
  assertTrustedOrigin,
  handleApiError,
  parseJson,
  serializeFirestore,
} from "@/lib/api-helpers";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import type { Admin, AdminRole } from "@/types/admin";

const verifySchema = z.object({ idToken: z.string().trim().min(100) });
const SESSION_DURATION_MS = 5 * 24 * 60 * 60 * 1000;

function validRole(value: unknown): value is AdminRole {
  return value === "super_admin" || value === "admin" || value === "manager";
}

export async function POST(request: NextRequest) {
  try {
    assertTrustedOrigin(request);
    const { idToken } = await parseJson(request, verifySchema);
    const auth = getAdminAuth();
    const decoded = await auth.verifyIdToken(idToken, true);

    const signedInAt = Number(decoded.auth_time ?? 0) * 1000;
    if (!signedInAt || Date.now() - signedInAt > 5 * 60 * 1000) {
      throw new ApiError(401, "Please sign in again before starting an admin session.");
    }

    const adminRef = getAdminDb().collection("admins").doc(decoded.uid);
    const adminSnapshot = await adminRef.get();
    if (!adminSnapshot.exists) {
      throw new ApiError(403, "This account is not approved for admin access.");
    }

    const stored = adminSnapshot.data() ?? {};
    if (!validRole(stored.role)) {
      throw new ApiError(403, "This admin account has an invalid role.");
    }

    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION_MS,
    });
    await adminRef.update({ lastLogin: FieldValue.serverTimestamp() });

    const user: Admin = {
      uid: decoded.uid,
      email: String(stored.email ?? decoded.email ?? ""),
      displayName: String(stored.displayName ?? decoded.name ?? decoded.email ?? "Admin"),
      role: stored.role,
      avatar: typeof stored.avatar === "string" ? stored.avatar : undefined,
      createdAt: serializeFirestore(stored.createdAt ?? ""),
      lastLogin: new Date().toISOString(),
    };

    const response = NextResponse.json({ success: true, user });
    response.cookies.set("admin-session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: SESSION_DURATION_MS / 1000,
      path: "/",
    });
    return response;
  } catch (error) {
    return handleApiError(error, "Unable to verify admin credentials.");
  }
}
