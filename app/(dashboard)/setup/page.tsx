"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SetupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Setup failed.");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main style={{ maxWidth: 400, margin: "60px auto", padding: 24, fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>🧠 Owner Setup</h1>
      <p style={{ color: "#666", marginBottom: 24 }}>
        మొదటి Owner account create చేయండి. ఇది ఒక్కసారి మాత్రమే పని చేస్తుంది.
      </p>

      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", marginBottom: 4 }}>Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 16, borderRadius: 8, border: "1px solid #ccc" }}
        />

        <label style={{ display: "block", marginBottom: 4 }}>Password (min 8 chars)</label>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 16, borderRadius: 8, border: "1px solid #ccc" }}
        />

        {error && <p style={{ color: "crimson", marginBottom: 16 }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 8,
            border: "none",
            background: "#111",
            color: "#fff",
            fontWeight: 600,
          }}
        >
          {loading ? "Creating..." : "Create Owner Account"}
        </button>
      </form>
    </main>
  );
}
