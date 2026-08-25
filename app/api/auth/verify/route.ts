import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  ApiError,
  assertTrustedOrigin,
  createSignedSessionToken,
  handleApiError,
  isAdminRole,
  parseJson,
  serializeFirestore,
  verifyFirebaseIdTokenViaRest,
} from "@/lib/api-helpers";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import type { Admin, AdminRole } from "@/types/admin";
import { FieldValue } from "firebase-admin/firestore";

const verifySchema = z.object({ idToken: z.string().trim().min(50) });
const SESSION_DURATION_MS = 5 * 24 * 60 * 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    assertTrustedOrigin(request);
    const { idToken } = await parseJson(request, verifySchema);

    let uid = "";
    let email = "";
    let displayName = "Admin";
    let avatar: string | undefined;

    // 1. First try Admin SDK if service account is present
    try {
      if (process.env.FIREBASE_ADMIN_PRIVATE_KEY && process.env.FIREBASE_ADMIN_CLIENT_EMAIL) {
        const auth = getAdminAuth();
        const decoded = await auth.verifyIdToken(idToken, true);
        uid = decoded.uid;
        email = decoded.email ?? "";
        displayName = decoded.name ?? decoded.email?.split("@")[0] ?? "Admin";
        avatar = typeof decoded.picture === "string" ? decoded.picture : undefined;
      } else {
        throw new Error("Use REST fallback");
      }
    } catch {
      // 2. Fallback to Google Identity Toolkit REST API verification (Requires only API Key)
      const restUser = await verifyFirebaseIdTokenViaRest(idToken);
      uid = restUser.uid;
      email = restUser.email;
      displayName = restUser.displayName;
      avatar = restUser.photoUrl;
    }

    let role: AdminRole = "super_admin";
    let storedCreatedAt = new Date().toISOString();

    // 3. Try to access Firestore Admin DB if available
    try {
      const adminRef = getAdminDb().collection("admins").doc(uid);
      let adminSnapshot = await adminRef.get();

      if (!adminSnapshot.exists) {
        const adminsCountSnapshot = await getAdminDb().collection("admins").limit(1).get();
        if (adminsCountSnapshot.empty) {
          const initialAdminData = {
            email,
            displayName,
            role: "super_admin" as const,
            avatar,
            createdAt: FieldValue.serverTimestamp(),
            lastLogin: FieldValue.serverTimestamp(),
          };
          await adminRef.set(initialAdminData);
          adminSnapshot = await adminRef.get();
        }
      }

      if (adminSnapshot.exists) {
        const stored = adminSnapshot.data() ?? {};
        if (isAdminRole(stored.role)) {
          role = stored.role;
          storedCreatedAt = serializeFirestore(stored.createdAt ?? storedCreatedAt);
        }
        await adminRef.update({ lastLogin: FieldValue.serverTimestamp() }).catch(() => undefined);
      }
    } catch (dbError) {
      console.warn("Firestore Admin DB check skipped during login:", dbError);
    }

    // 4. Create Session Cookie (Either Firebase Admin Session Cookie or Signed Token)
    let sessionCookie: string;
    try {
      if (process.env.FIREBASE_ADMIN_PRIVATE_KEY && process.env.FIREBASE_ADMIN_CLIENT_EMAIL) {
        sessionCookie = await getAdminAuth().createSessionCookie(idToken, {
          expiresIn: SESSION_DURATION_MS,
        });
      } else {
        sessionCookie = createSignedSessionToken({ uid, email, role });
      }
    } catch {
      sessionCookie = createSignedSessionToken({ uid, email, role });
    }

    const user: Admin = {
      uid,
      email,
      displayName,
      role,
      avatar,
      createdAt: storedCreatedAt,
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
