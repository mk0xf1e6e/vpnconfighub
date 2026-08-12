import { getHealth } from "@/lib/api/client";

export default async function HealthPage() {
  const health = await getHealth().catch(() => null);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="rounded-xl border p-8">
        <h1 className="text-2xl font-bold">VPN Config Hub</h1>
        <p className="mt-4">
          API status:{" "}
          <strong>{health ? health.status : "unavailable"}</strong>
        </p>
      </div>
    </main>
  );
}
