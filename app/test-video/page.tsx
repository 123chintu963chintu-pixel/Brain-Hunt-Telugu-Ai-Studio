"use client";

import { useState, useRef } from "react";

export default function TestVideoPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function stopPolling() {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setVideoUrl(null);
    setStatusText("Submitting job...");

    try {
      const res = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      const jobId = data.jobId;
      setStatusText("Processing... this can take a few minutes");

      pollRef.current = setInterval(async () => {
        try {
          const statusRes = await fetch(`/api/generate-video/status?jobId=${jobId}`);
          const statusData = await statusRes.json();

          if (!statusRes.ok) {
            throw new Error(statusData.error || "Status check failed");
          }

          if (statusData.status === "completed") {
            stopPolling();
            setVideoUrl(statusData.videoUrl);
            setStatusText("Done!");
            setLoading(false);
          } else if (statusData.status === "failed") {
            stopPolling();
            setError("Video generation failed");
            setLoading(false);
          } else {
            setStatusText(`Status: ${statusData.status}`);
          }
        } catch (err) {
          stopPolling();
          setError(err instanceof Error ? err.message : "Unknown error");
          setLoading(false);
        }
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 500, margin: "0 auto" }}>
      <h1>🎬 Test Video Generation</h1>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe the video you want..."
        rows={4}
        style={{ width: "100%", padding: 8, marginTop: 16 }}
      />

      <button
        onClick={handleGenerate}
        disabled={loading || !prompt}
        style={{ marginTop: 12, padding: "10px 20px" }}
      >
        {loading ? "Generating..." : "Generate Video"}
      </button>

      {statusText && <p style={{ marginTop: 16 }}>⏳ {statusText}</p>}

      {error && (
        <p style={{ color: "red", marginTop: 16 }}>❌ {error}</p>
      )}

      {videoUrl && (
        <div style={{ marginTop: 16 }}>
          <p>✅ Generated:</p>
          <video src={videoUrl} controls style={{ width: "100%" }} />
        </div>
      )}
    </div>
  );
}
