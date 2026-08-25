import { NextRequest, NextResponse } from "next/server";
import { handleApiError, verifyAdmin } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);
    return NextResponse.json({ success: true, user });
  } catch (error) {
    return handleApiError(error, "Unable to verify the admin session.");
  }
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ success: true });

  try {
    await verifyAdmin(request);
  } catch {
    // A stale or invalid cookie should still be removable.
  }

  response.cookies.set("admin-session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
    path: "/",
  });
  return response;
}
