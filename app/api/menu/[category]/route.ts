import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { ApiError, handleApiError, parseJson, verifyAdmin } from "@/lib/api-helpers";
import { getAdminDb } from "@/lib/firebase/admin";
import { menuSchemas } from "@/lib/validation";

type Category = keyof typeof menuSchemas;
type RouteContext = { params: Promise<{ category: string }> };

function isCategory(value: string): value is Category {
  return value === "cones" || value === "cups" || value === "shakes";
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    await verifyAdmin(request);
    const { category } = await params;
    if (!isCategory(category)) throw new ApiError(400, "Invalid menu category.");

    const input = category === "cones"
      ? await parseJson(request, menuSchemas.cones)
      : category === "cups"
        ? await parseJson(request, menuSchemas.cups)
        : await parseJson(request, menuSchemas.shakes);
    const payload = {
      category,
      ...input,
      ...(category === "cones" && "originalPrice" in input && "price" in input
        ? { saving: Math.max(0, input.originalPrice - input.price) }
        : {}),
      updatedAt: FieldValue.serverTimestamp(),
    };
    await getAdminDb().collection("menu_pricing").doc(category).set(payload, { merge: true });
    return NextResponse.json({
      success: true,
      data: { ...payload, updatedAt: new Date().toISOString() },
    });
  } catch (error) {
    return handleApiError(error, "Unable to update menu pricing.");
  }
}
