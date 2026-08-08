// app/api/generate-video/route.ts
import { NextRequest, NextResponse } from "next/server";
import { submitVideoJob } from "@/lib/ai/video";

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

    const jobId = await submitVideoJob(prompt);

    return NextResponse.json({ jobId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("generate-video error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
