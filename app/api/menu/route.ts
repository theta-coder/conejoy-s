import { NextResponse } from "next/server";
import { serializeFirestore } from "@/lib/api-helpers";
import { defaultMenu } from "@/lib/defaults";
import { getAdminDb } from "@/lib/firebase/admin";

export async function GET() {
  try {
    const snapshot = await getAdminDb().collection("menu_pricing").get();
    const data = structuredClone(defaultMenu);

    snapshot.docs.forEach((document) => {
      if (document.id === "cones" || document.id === "cups" || document.id === "shakes") {
        const stored = serializeFirestore(document.data());
        if (document.id === "cups" && stored.normalCups && !stored.sizes) {
          stored.sizes = stored.normalCups;
          delete stored.normalCups;
        }
        Object.assign(data[document.id], stored);
      }
    });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: true, data: defaultMenu, fallback: true });
  }
}
