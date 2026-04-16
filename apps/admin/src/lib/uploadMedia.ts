import { supabase } from "./supabase";

const MEDIA_UPLOAD_URL = import.meta.env.VITE_MEDIA_UPLOAD_URL;

/**
 * Upload a file to Cloudflare R2 via the media worker.
 * Authenticates using the current Supabase session JWT.
 * Returns the public CDN URL of the uploaded file.
 */
export async function uploadMedia(
  file: Blob,
  folder: string,
  contentType = "image/webp",
): Promise<string> {
  if (!MEDIA_UPLOAD_URL) {
    throw new Error("Media upload not configured (VITE_MEDIA_UPLOAD_URL)");
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error("Not authenticated — please sign in again");
  }

  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
  const url = `${MEDIA_UPLOAD_URL.replace(/\/$/, "")}/${filename}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
      Authorization: `Bearer ${session.access_token}`,
    },
    body: file,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed: ${text}`);
  }

  const data = await res.json() as { url: string };
  return data.url;
}
