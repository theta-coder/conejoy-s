import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import {
  handleApiError,
  parseJson,
  serializeFirestore,
  verifyAdmin,
} from "@/lib/api-helpers";
import { getAdminDb } from "@/lib/firebase/admin";
import { bannerCreateSchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const showAll = request.nextUrl.searchParams.get("all") === "true";
  try {
    if (showAll) await verifyAdmin(request);
    let query: FirebaseFirestore.Query = getAdminDb().collection("banners");
    if (!showAll) query = query.where("isActive", "==", true);
    const snapshot = await query.orderBy("sortOrder", "asc").get();
    const data = snapshot.docs.map((document) =>
      serializeFirestore({ id: document.id, ...document.data() }),
    );
    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (showAll) return handleApiError(error, "Unable to load banners.");
    return NextResponse.json({ success: true, data: [], fallback: true });
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyAdmin(request);
    const input = await parseJson(request, bannerCreateSchema);
    const reference = getAdminDb().collection("banners").doc();
    await reference.set({
      ...input,
      id: reference.id,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    return NextResponse.json(
      {
        success: true,
        data: {
          ...input,
          id: reference.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error, "Unable to create banner.");
  }
}
