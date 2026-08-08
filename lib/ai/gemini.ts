// lib/ai/gemini.ts
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "google/gemini-2.5-flash-image";

export type GeminiImageResult = {
  base64: string;
  mimeType: string;
};

export async function generateImage(prompt: string): Promise<GeminiImageResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not set in environment variables");
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      modalities: ["image", "text"],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  const imageUrl = data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;

  if (!imageUrl) {
    throw new Error("No image returned from OpenRouter response");
  }

  const match = imageUrl.match(/^data:(.+);base64,(.+)$/);

  if (!match) {
    throw new Error("Unexpected image URL format from OpenRouter");
  }

  return { mimeType: match[1], base64: match[2] };
}
