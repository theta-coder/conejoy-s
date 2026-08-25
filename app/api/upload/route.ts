import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { ApiError, handleApiError, verifyAdmin } from "@/lib/api-helpers";
import { getAdminBucket } from "@/lib/firebase/admin";

const allowedFolders = new Set(["cones", "cups", "shakes", "banners"]);
const allowedTypes = new Map([
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/jpeg", "jpg"],
]);
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function hasValidSignature(buffer: Buffer, mime: string) {
  if (mime === "image/png") {
    return buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  }
  if (mime === "image/jpeg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (mime === "image/webp") {
    return buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP";
  }
  return false;
}

export async function POST(request: NextRequest) {
  try {
    await verifyAdmin(request);
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = String(formData.get("folder") ?? "");

    if (!(file instanceof File)) throw new ApiError(400, "Choose an image to upload.");
    if (!allowedFolders.has(folder)) throw new ApiError(400, "Invalid upload folder.");
    const extension = allowedTypes.get(file.type);
    if (!extension) throw new ApiError(400, "Only PNG, WebP, and JPEG images are allowed.");
    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      throw new ApiError(400, "Image must be smaller than 5 MB.");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (!hasValidSignature(buffer, file.type)) {
      throw new ApiError(400, "The file content does not match its image type.");
    }

    const downloadToken = randomUUID();
    const objectPath = `${folder}/${Date.now()}-${randomUUID()}.${extension}`;
    const bucket = getAdminBucket();
    await bucket.file(objectPath).save(buffer, {
      resumable: false,
      metadata: {
        contentType: file.type,
        cacheControl: "public,max-age=31536000,immutable",
        metadata: { firebaseStorageDownloadTokens: downloadToken },
      },
    });
    const url = `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(bucket.name)}/o/${encodeURIComponent(objectPath)}?alt=media&token=${downloadToken}`;

    return NextResponse.json({ success: true, url, path: objectPath }, { status: 201 });
  } catch (error) {
    return handleApiError(error, "Unable to upload image.");
  }
}
