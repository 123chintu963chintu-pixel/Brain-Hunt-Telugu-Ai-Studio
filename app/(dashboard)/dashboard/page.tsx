// app/(dashboard)/dashboard/page.tsx
import { redirect } from "next/navigation";
import { getOwnerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import LogoutButton from "./LogoutButton";

export default async function DashboardPage() {
  const session = await getOwnerSession();
  if (!session) {
    redirect("/login");
  }

  const owner = await prisma.owner.findUnique({
    where: { id: session!.ownerId },
    select: { email: true, createdAt: true },
  });

  return (
    <main
      style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: 24,
        fontFamily: "sans-serif",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 32,
          paddingBottom: 16,
          borderBottom: "1px solid #eee",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src="/logo.png"
            alt="Brain Hunt Telugu"
            style={{ width: 48, height: 48, borderRadius: "50%" }}
          />
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
              Brain Hunt Telugu
            </h1>
            <p style={{ color: "#666", margin: 0, fontSize: 13 }}>
              Owner Dashboard
            </p>
          </div>
        </div>
        <LogoutButton />
      </header>

      <p style={{ color: "#666", marginBottom: 24 }}>
        Logged in as <strong>{owner?.email}</strong>
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        }}
      >
        <a
          href="/test-image"
          style={{
            display: "block",
            padding: 20,
            borderRadius: 12,
            border: "1px solid #eee",
            textDecoration: "none",
            color: "#111",
            background: "#fafafa",
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 8 }}>🎨</div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            Image Generation
          </div>
          <div style={{ fontSize: 13, color: "#666" }}>
            Create AI-generated images
          </div>
        </a>

        <a
          href="/test-video"
          style={{
            display: "block",
            padding: 20,
            borderRadius: 12,
            border: "1px solid #eee",
            textDecoration: "none",
            color: "#111",
            background: "#fafafa",
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 8 }}>🎬</div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            Video Generation
          </div>
          <div style={{ fontSize: 13, color: "#666" }}>
            Create AI-generated videos
          </div>
        </a>
      </div>

      <p style={{ marginTop: 32, color: "#16a34a", fontSize: 14 }}>
        ✅ Part 5 (Dashboard UI) in progress.
      </p>
    </main>
  );
}
