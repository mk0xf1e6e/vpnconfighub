"use client";

import { useEffect, useState } from "react";
import { StatusCard } from "@/components/dashboard/status-card";
import { SpeedChart } from "@/components/dashboard/speed-chart";
import { ConfigCard } from "@/components/dashboard/config-card";
import { ServerPreview } from "@/components/dashboard/server-preview";
import { UsageSummary } from "@/components/dashboard/usage-summary";
import type { UsageState } from "@/components/shop/catalog";
import { getDemoDashboard, type DemoDashboard } from "@/lib/api/client";

export default function Home() {
  const [dashboard, setDashboard] = useState<DemoDashboard | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => { getDemoDashboard().then(setDashboard).catch(() => setError(true)); }, []);
  if (error) return <div className="p-4"><StateMessage message="Demo dashboard is currently unavailable." /></div>;
  if (!dashboard) return <div className="p-4"><StateMessage message="Loading demo dashboard..." /></div>;
  const usage: UsageState = { status: dashboard.usage.daily.length ? "available" : "empty", totalBytes: dashboard.usage.totalBytes, daily: dashboard.usage.daily };
  return (
    <div className="space-y-4 p-4">
      <StatusCard subscription={dashboard.subscription} />

      <SpeedChart data={dashboard.usage.daily.map((item) => item.bytes)} label="Daily usage" />

      <UsageSummary usage={usage} />

      <ConfigCard configured={dashboard.configuration !== null} />

      <ServerPreview nodes={dashboard.nodes} />
    </div>
  );
}

function StateMessage({ message }: { message: string }) { return <div className="rounded-2xl border border-[#2b394a] bg-[#242f3d] p-5 text-sm text-[#7f8c99]">{message}</div>; }
