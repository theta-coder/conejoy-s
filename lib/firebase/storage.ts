import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
  type UploadTaskSnapshot,
} from "firebase/storage";
import { getFirebaseStorage } from "./config";

export async function uploadImage(
  file: File | Blob,
  path: string,
  onProgress?: (progress: number) => void,
): Promise<string> {
  const task = uploadBytesResumable(ref(getFirebaseStorage(), path), file);
  return new Promise((resolve, reject) => {
    task.on(
      "state_changed",
      (snapshot: UploadTaskSnapshot) => {
        if (onProgress && snapshot.totalBytes > 0) {
          onProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
        }
      },
      reject,
      async () => resolve(await getDownloadURL(task.snapshot.ref)),
    );
  });
}

export async function deleteImage(pathOrUrl: string): Promise<void> {
  if (!pathOrUrl) return;
  await deleteObject(ref(getFirebaseStorage(), pathOrUrl));
}

export async function getFileDownloadURL(path: string): Promise<string> {
  return getDownloadURL(ref(getFirebaseStorage(), path));
}
