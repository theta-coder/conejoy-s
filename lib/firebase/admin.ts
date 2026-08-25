import "server-only";

import {
  applicationDefault,
  cert,
  getApp,
  getApps,
  initializeApp,
  type App,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

function adminOptions() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const storageBucket =
    process.env.FIREBASE_ADMIN_STORAGE_BUCKET ??
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

  if (!projectId) {
    throw new Error("FIREBASE_ADMIN_PROJECT_ID is not configured.");
  }

  if ((clientEmail && !privateKey) || (!clientEmail && privateKey)) {
    throw new Error(
      "FIREBASE_ADMIN_CLIENT_EMAIL and FIREBASE_ADMIN_PRIVATE_KEY must be configured together.",
    );
  }

  return {
    projectId,
    storageBucket,
    credential:
      clientEmail && privateKey
        ? cert({ projectId, clientEmail, privateKey })
        : applicationDefault(),
  };
}

export function getFirebaseAdminApp(): App {
  return getApps().length > 0 ? getApp() : initializeApp(adminOptions());
}

export function getAdminAuth() {
  return getAuth(getFirebaseAdminApp());
}

export function getAdminDb() {
  return getFirestore(getFirebaseAdminApp());
}

export function getAdminStorage() {
  return getStorage(getFirebaseAdminApp());
}

export function getAdminBucket() {
  return getAdminStorage().bucket();
}

function storageObjectPath(pathOrUrl: string, bucketName: string) {
  if (!pathOrUrl) return null;
  if (!pathOrUrl.startsWith("http")) {
    return pathOrUrl.startsWith("/") ? null : pathOrUrl;
  }

  try {
    const url = new URL(pathOrUrl);
    if (url.hostname === "firebasestorage.googleapis.com") {
      const match = url.pathname.match(/^\/v0\/b\/([^/]+)\/o\/(.+)$/);
      if (!match || decodeURIComponent(match[1]) !== bucketName) return null;
      return decodeURIComponent(match[2]);
    }
    if (url.hostname === "storage.googleapis.com") {
      const prefix = `/${bucketName}/`;
      return url.pathname.startsWith(prefix)
        ? decodeURIComponent(url.pathname.slice(prefix.length))
        : null;
    }
  } catch {
    return null;
  }
  return null;
}

export async function deleteStoredFile(pathOrUrl: string) {
  const bucket = getAdminBucket();
  const objectPath = storageObjectPath(pathOrUrl, bucket.name);
  if (!objectPath) return;
  await bucket.file(objectPath).delete({ ignoreNotFound: true });
}
