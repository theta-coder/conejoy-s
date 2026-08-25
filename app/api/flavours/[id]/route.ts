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
import { deleteStoredFile, getAdminDb } from "@/lib/firebase/admin";
import { flavourUpdateSchema } from "@/lib/validation";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  try {
    const snapshot = await getAdminDb().collection("flavours").doc(id).get();
    if (snapshot.exists) {
      return NextResponse.json({
        success: true,
        data: serializeFirestore({ id: snapshot.id, ...snapshot.data() }),
      });
    }
  } catch {
    // Static data remains available before Firebase is connected.
  }

  const fallback = defaultFlavours.find((flavour) => flavour.id === id);
  return fallback
    ? NextResponse.json({ success: true, data: fallback, fallback: true })
    : NextResponse.json({ success: false, error: "Flavour not found." }, { status: 404 });
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    await verifyAdmin(request);
    const { id } = await params;
    const input = await parseJson(request, flavourUpdateSchema);
    const reference = getAdminDb().collection("flavours").doc(id);
    if (!(await reference.get()).exists) {
      throw new ApiError(404, "Flavour not found.");
    }
    await reference.update({ ...input, updatedAt: FieldValue.serverTimestamp() });
    return NextResponse.json({
      success: true,
      data: { id, ...input, updatedAt: new Date().toISOString() },
    });
  } catch (error) {
    return handleApiError(error, "Unable to update flavour.");
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    await verifyAdmin(request);
    const { id } = await params;
    const reference = getAdminDb().collection("flavours").doc(id);
    const snapshot = await reference.get();
    if (!snapshot.exists) throw new ApiError(404, "Flavour not found.");

    const images = snapshot.data()?.images;
    const urls = [
      images?.cone?.png,
      images?.cone?.webp,
      images?.cup?.png,
      images?.cup?.webp,
      images?.shake?.png,
      images?.shake?.webp,
    ].filter((value): value is string => typeof value === "string");
    await Promise.allSettled(urls.map((url) => deleteStoredFile(url)));
    await reference.delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, "Unable to delete flavour.");
  }
}
