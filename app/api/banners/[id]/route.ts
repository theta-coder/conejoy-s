import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { ApiError, handleApiError, parseJson, verifyAdmin } from "@/lib/api-helpers";
import { deleteStoredFile, getAdminDb } from "@/lib/firebase/admin";
import { bannerUpdateSchema } from "@/lib/validation";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    await verifyAdmin(request);
    const { id } = await params;
    const input = await parseJson(request, bannerUpdateSchema);
    const reference = getAdminDb().collection("banners").doc(id);
    if (!(await reference.get()).exists) throw new ApiError(404, "Banner not found.");

    await reference.update({ ...input, updatedAt: FieldValue.serverTimestamp() });
    return NextResponse.json({
      success: true,
      data: { id, ...input, updatedAt: new Date().toISOString() },
    });
  } catch (error) {
    return handleApiError(error, "Unable to update banner.");
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    await verifyAdmin(request);
    const { id } = await params;
    const reference = getAdminDb().collection("banners").doc(id);
    const snapshot = await reference.get();
    if (!snapshot.exists) throw new ApiError(404, "Banner not found.");

    const data = snapshot.data();
    await deleteStoredFile(String(data?.storagePath ?? data?.imageUrl ?? "")).catch(() => undefined);
    await reference.delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, "Unable to delete banner.");
  }
}
