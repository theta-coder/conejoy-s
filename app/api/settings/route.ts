import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import {
  handleApiError,
  parseJson,
  serializeFirestore,
  verifyAdmin,
} from "@/lib/api-helpers";
import { defaultSettings } from "@/lib/defaults";
import { getAdminDb } from "@/lib/firebase/admin";
import { settingsSchema } from "@/lib/validation";

export async function GET() {
  try {
    const snapshot = await getAdminDb().collection("site_settings").doc("general").get();
    const stored = snapshot.exists ? serializeFirestore(snapshot.data()) : null;
    const data = stored
      ? {
          ...defaultSettings,
          ...stored,
          mapCoords: { ...defaultSettings.mapCoords, ...stored.mapCoords },
          storeHours: { ...defaultSettings.storeHours, ...stored.storeHours },
          socialLinks: { ...defaultSettings.socialLinks, ...stored.socialLinks },
        }
      : defaultSettings;
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: true, data: defaultSettings, fallback: true });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await verifyAdmin(request);
    const input = await parseJson(request, settingsSchema);
    await getAdminDb().collection("site_settings").doc("general").set(
      { ...input, updatedAt: FieldValue.serverTimestamp() },
      { merge: true },
    );
    return NextResponse.json({
      success: true,
      data: { ...input, updatedAt: new Date().toISOString() },
    });
  } catch (error) {
    return handleApiError(error, "Unable to update store settings.");
  }
}
