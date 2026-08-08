// lib/storage.ts
import { randomUUID } from "crypto";
import { createSupabaseAdminClient } from "./supabase";

const BUCKET_NAME = "brain-hunt-media";

export async function uploadBase64Image(
  base64: string,
  mimeType: string,
  folder: string = "generated"
): Promise<string> {
  const admin = createSupabaseAdminClient();
  const buffer = Buffer.from(base64, "base64");
  const extension = mimeType.split("/")[1] || "png";
  const fileName = `${folder}/${randomUUID()}.${extension}`;

  const { error } = await admin.storage
    .from(BUCKET_NAME)
    .upload(fileName, buffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) {
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  const { data } = admin.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName);

  return data.publicUrl;
}
