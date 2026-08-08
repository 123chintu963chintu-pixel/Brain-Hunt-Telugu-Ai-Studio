import { redirect } from "next/navigation";
import { getOwnerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    <main style={{ maxWidth: 600, margin: "60px auto", padding: 24, fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>🧠 Owner Dashboard</h1>
      <p style={{ color: "#666" }}>Logged in as {owner?.email}</p>
      <p style={{ marginTop: 24, color: "#16a34a" }}>
        ✅ Part 2 (auth + database) working. Part 3 next.
      </p>
    </main>
  );
}
