// lib/storage.ts
import { randomUUID } from "crypto";
import { createSupabaseAdminClient } from "./supabase";

const BUCKET_NAME = "brain-hunt-media";

export async function uploadBuffer(
  buffer: Buffer,
  mimeType: string,
  folder: string
): Promise<string> {
  const admin = createSupabaseAdminClient();
  const extension = mimeType.split("/")[1] || "bin";
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

export async function uploadBase64Image(
  base64: string,
  mimeType: string,
  folder: string = "generated"
): Promise<string> {
  const buffer = Buffer.from(base64, "base64");
  return uploadBuffer(buffer, mimeType, folder);
}
