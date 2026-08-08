// lib/ai/video.ts
const OPENROUTER_VIDEOS_URL = "https://openrouter.ai/api/v1/videos";
const VIDEO_MODEL = "google/veo-3.1-fast";

function getApiKey(): string {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not set in environment variables");
  }
  return apiKey;
}

export async function submitVideoJob(prompt: string): Promise<string> {
  const apiKey = getApiKey();

  const response = await fetch(OPENROUTER_VIDEOS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: VIDEO_MODEL,
      prompt,
      duration: 4,
      resolution: "720p",
      aspect_ratio: "16:9",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter video submit error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  if (!data?.id) {
    throw new Error("No job id returned from OpenRouter video submission");
  }

  return data.id;
}

export type VideoJobStatus = {
  status: "pending" | "processing" | "completed" | "failed" | string;
  raw: any;
};

export async function getVideoJobStatus(jobId: string): Promise<VideoJobStatus> {
  const apiKey = getApiKey();

  const response = await fetch(`${OPENROUTER_VIDEOS_URL}/${jobId}`, {
    headers: {
      "Authorization": `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter video status error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  return { status: data?.status, raw: data };
}

export async function downloadVideoContent(
  jobId: string
): Promise<{ buffer: Buffer; mimeType: string }> {
  const apiKey = getApiKey();

  const response = await fetch(`${OPENROUTER_VIDEOS_URL}/${jobId}/content?index=0`, {
    headers: {
      "Authorization": `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter video download error: ${response.status} - ${errorText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const mimeType = response.headers.get("content-type") || "video/mp4";

  return { buffer: Buffer.from(arrayBuffer), mimeType };
}
