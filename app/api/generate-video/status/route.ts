// app/api/generate-video/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getVideoJobStatus, downloadVideoContent } from "@/lib/ai/video";
import { uploadBuffer } from "@/lib/storage";

export async function GET(request: NextRequest) {
  try {
    const jobId = request.nextUrl.searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json(
        { error: "Missing 'jobId' query parameter" },
        { status: 400 }
      );
    }

    const { status } = await getVideoJobStatus(jobId);

    if (status === "completed") {
      const { buffer, mimeType } = await downloadVideoContent(jobId);
      const videoUrl = await uploadBuffer(buffer, mimeType, "videos");
      return NextResponse.json({ status: "completed", videoUrl });
    }

    if (status === "failed") {
      return NextResponse.json({ status: "failed" });
    }

    return NextResponse.json({ status: status || "processing" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("generate-video status error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
