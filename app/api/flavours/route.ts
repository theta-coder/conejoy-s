import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import {
  ApiError,
  handleApiError,
  parseJson,
  serializeFirestore,
  verifyAdmin,
} from "@/lib/api-helpers";
import { defaultFlavours } from "@/lib/defaults";
import { getAdminDb } from "@/lib/firebase/admin";
import { flavourCreateSchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const showAll = request.nextUrl.searchParams.get("all") === "true";

  try {
    if (showAll) await verifyAdmin(request);

    let query: FirebaseFirestore.Query = getAdminDb().collection("flavours");
    if (!showAll) query = query.where("isActive", "==", true);
    const snapshot = await query.orderBy("sortOrder", "asc").get();
    const data = snapshot.docs.map((document) =>
      serializeFirestore({ id: document.id, ...document.data() }),
    );
    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (showAll) return handleApiError(error, "Unable to load flavours.");

    console.warn("Using static flavour fallback because Firestore is unavailable.");
    return NextResponse.json({ success: true, data: defaultFlavours, fallback: true });
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyAdmin(request);
    const input = await parseJson(request, flavourCreateSchema);
    const reference = getAdminDb().collection("flavours").doc(input.id);
    if ((await reference.get()).exists) {
      throw new ApiError(409, "A flavour with this ID already exists.");
    }

    await reference.set({
      ...input,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    return NextResponse.json(
      {
        success: true,
        data: {
          ...input,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error, "Unable to create flavour.");
  }
}
