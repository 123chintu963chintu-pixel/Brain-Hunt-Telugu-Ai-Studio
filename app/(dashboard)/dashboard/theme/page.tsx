"use client";
import { useEffect, useState } from "react";

export default function ThemeStudioPage() {
  const [theme, setTheme] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/theme")
      .then((r) => r.json())
      .then((d) => setTheme(d.theme))
      .catch(() => setMessage("Failed to load theme"));
  }, []);

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(theme),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setMessage("✅ Saved!");
    } catch (e: any) {
      setMessage("❌ " + e.message);
    } finally {
      setSaving(false);
    }
  }

  if (!theme) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-md">
      <h1 className="text-2xl font-bold mb-4">🎨 Theme Studio</h1>

      <label className="block mb-2 text-sm">App Name</label>
      <input
        className="border w-full p-2 mb-4"
        value={theme.appName || ""}
        onChange={(e) => setTheme({ ...theme, appName: e.target.value })}
      />

      <label className="block mb-2 text-sm">Primary Color</label>
      <input
        type="color"
        className="mb-4 h-10 w-20"
        value={theme.primaryColor || "#000000"}
        onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
      />

      <label className="block mb-2 text-sm">Secondary Color</label>
      <input
        type="color"
        className="mb-4 h-10 w-20"
        value={theme.secondaryColor || "#ffffff"}
        onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
      />

      <button
        onClick={save}
        disabled={saving}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {saving ? "Saving..." : "Save Theme"}
      </button>

      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}
