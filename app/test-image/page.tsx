"use client";

import { useState } from "react";

export default function TestImagePage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setImageUrl(data.imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 500, margin: "0 auto" }}>
      <h1>🧪 Test Image Generation</h1>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe the image you want..."
        rows={4}
        style={{ width: "100%", padding: 8, marginTop: 16 }}
      />

      <button
        onClick={handleGenerate}
        disabled={loading || !prompt}
        style={{ marginTop: 12, padding: "10px 20px" }}
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: 16 }}>❌ {error}</p>
      )}

      {imageUrl && (
        <div style={{ marginTop: 16 }}>
          <p>✅ Generated:</p>
          <img src={imageUrl} alt="Generated" style={{ width: "100%" }} />
        </div>
      )}
    </div>
  );
}
