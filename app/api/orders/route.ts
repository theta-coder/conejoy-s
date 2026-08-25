import { randomInt } from "node:crypto";
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
import { orderCreateSchema } from "@/lib/validation";
import type { OrderStatus } from "@/types/order";

const statuses: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "delivered",
  "cancelled",
];

function createOrderId() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `CJ-${date}-${randomInt(1000, 10000)}`;
}

export async function GET(request: NextRequest) {
  try {
    await verifyAdmin(request);
    const page = Math.max(1, Number(request.nextUrl.searchParams.get("page") ?? 1));
    const limit = Math.min(
      100,
      Math.max(1, Number(request.nextUrl.searchParams.get("limit") ?? 20)),
    );
    const statusParam = request.nextUrl.searchParams.get("status");
    if (statusParam && !statuses.includes(statusParam as OrderStatus)) {
      throw new ApiError(400, "Invalid order status filter.");
    }

    let query: FirebaseFirestore.Query = getAdminDb().collection("orders");
    if (statusParam) query = query.where("status", "==", statusParam);

    const [countSnapshot, pageSnapshot] = await Promise.all([
      query.count().get(),
      query
        .orderBy("createdAt", "desc")
        .offset((page - 1) * limit)
        .limit(limit)
        .get(),
    ]);
    const total = countSnapshot.data().count;
    const data = pageSnapshot.docs.map((document) =>
      serializeFirestore({ orderId: document.id, ...document.data() }),
    );

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    return handleApiError(error, "Unable to load orders.");
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyAdmin(request);
    const input = await parseJson(request, orderCreateSchema);
    let orderId = createOrderId();
    let reference = getAdminDb().collection("orders").doc(orderId);
    while ((await reference.get()).exists) {
      orderId = createOrderId();
      reference = getAdminDb().collection("orders").doc(orderId);
    }

    await reference.set({
      ...input,
      orderId,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    return NextResponse.json(
      {
        success: true,
        data: {
          ...input,
          orderId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error, "Unable to create order.");
  }
}
