import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import {
  ApiError,
  handleApiError,
  parseJson,
  serializeFirestore,
  verifyAdmin,
} from "@/lib/api-helpers";
import { getAdminDb } from "@/lib/firebase/admin";
import { orderUpdateSchema } from "@/lib/validation";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    await verifyAdmin(request);
    const { id } = await params;
    const snapshot = await getAdminDb().collection("orders").doc(id).get();
    if (!snapshot.exists) throw new ApiError(404, "Order not found.");
    return NextResponse.json({
      success: true,
      data: serializeFirestore({ orderId: snapshot.id, ...snapshot.data() }),
    });
  } catch (error) {
    return handleApiError(error, "Unable to load order details.");
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    await verifyAdmin(request);
    const { id } = await params;
    const input = await parseJson(request, orderUpdateSchema);
    const reference = getAdminDb().collection("orders").doc(id);
    if (!(await reference.get()).exists) throw new ApiError(404, "Order not found.");

    await reference.update({ ...input, updatedAt: FieldValue.serverTimestamp() });
    return NextResponse.json({
      success: true,
      data: { orderId: id, ...input, updatedAt: new Date().toISOString() },
    });
  } catch (error) {
    return handleApiError(error, "Unable to update order.");
  }
}
