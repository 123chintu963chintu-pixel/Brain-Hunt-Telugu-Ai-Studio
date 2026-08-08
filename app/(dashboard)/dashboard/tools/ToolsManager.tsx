"use client";

import { useState } from "react";

type Tool = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  icon: string | null;
  promptTemplate: string;
  provider: string;
  isActive: boolean;
};

export default function ToolsManager({ initialTools }: { initialTools: Tool[] }) {
  const [tools, setTools] = useState<Tool[]>(initialTools);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("image");
  const [icon, setIcon] = useState("");
  const [promptTemplate, setPromptTemplate] = useState("");
  const [provider, setProvider] = useState("openai");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          description,
          category,
          icon,
          promptTemplate,
          provider,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create tool");
      }

      const newTool = await res.json();
      setTools([newTool, ...tools]);
      setShowForm(false);
      setName("");
      setSlug("");
      setDescription("");
      setIcon("");
      setPromptTemplate("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("ఈ tool ని delete చేయాలా?")) return;

    const res = await fetch(`/api/tools/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTools(tools.filter((t) => t.id !== id));
    }
  }

  return (
    <div>
      <button
        onClick={() => setShowForm(!showForm)}
        style={{
          padding: "10px 16px",
          borderRadius: 8,
          border: "none",
          background: "#111",
          color: "#fff",
          fontSize: 14,
          marginBottom: 20,
          cursor: "pointer",
        }}
      >
        {showForm ? "Cancel" : "+ New Tool"}
      </button>

      {showForm && (
        <form
          onSubmit={handleCreate}
          style={{
            border: "1px solid #eee",
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <input
            placeholder="Tool name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            placeholder="Slug (e.g. cartoon-style)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={inputStyle}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={inputStyle}
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="text">Text</option>
          </select>
          <input
            placeholder="Icon (emoji, optional)"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            style={inputStyle}
          />
          <textarea
            placeholder="Prompt template (use {input})"
            value={promptTemplate}
            onChange={(e) => setPromptTemplate(e.target.value)}
            required
            rows={3}
            style={inputStyle}
          />
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            style={inputStyle}
          >
            <option value="openai">OpenAI</option>
            <option value="google">Google</option>
            <option value="fal">Fal.ai</option>
            <option value="runway">Runway</option>
          </select>

          {error && <p style={{ color: "red", fontSize: 13 }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "none",
              background: "#111",
              color: "#fff",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            {loading ? "Creating..." : "Create Tool"}
          </button>
        </form>
      )}

      {tools.length === 0 && (
        <p style={{ color: "#666" }}>ఇంకా tools లేవు. కొత్తది add చేయండి.</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {tools.map((tool) => (
          <div
            key={tool.id}
            style={{
              border: "1px solid #eee",
              borderRadius: 12,
              padding: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>
                {tool.icon || "🔧"} {tool.name}
              </div>
              <div style={{ fontSize: 13, color: "#666" }}>
                {tool.category} · {tool.provider}
              </div>
              {tool.description && (
                <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>
                  {tool.description}
                </div>
              )}
            </div>
            <button
              onClick={() => handleDelete(tool.id)}
              style={{
                border: "none",
                background: "transparent",
                color: "#c00",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ddd",
  fontSize: 14,
  fontFamily: "inherit",
};
