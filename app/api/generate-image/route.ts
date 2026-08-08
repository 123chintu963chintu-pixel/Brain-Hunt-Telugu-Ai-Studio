// app/api/generate-image/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/lib/ai/gemini";
import { uploadBase64Image } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const prompt = body?.prompt;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'prompt' in request body" },
        { status: 400 }
      );
    }

    const { base64, mimeType } = await generateImage(prompt);
    const imageUrl = await uploadBase64Image(base64, mimeType);

    return NextResponse.json({ imageUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("generate-image error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
  }
