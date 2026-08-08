// app/(dashboard)/dashboard/tools/page.tsx
import { redirect } from "next/navigation";
import { getOwnerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ToolsManager from "./ToolsManager";

export default async function ToolsPage() {
  const session = await getOwnerSession();
  if (!session) {
    redirect("/login");
  }

  const tools = await prisma.aITool.findMany({
    orderBy: { createdAt: "desc" },
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
          marginBottom: 24,
          paddingBottom: 16,
          borderBottom: "1px solid #eee",
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
          🛠️ AI Tool Builder
        </h1>
        <p style={{ color: "#666", margin: 0, fontSize: 13 }}>
          Create and manage AI tools
        </p>
      </header>

      <ToolsManager initialTools={tools} />
    </main>
  );
}
