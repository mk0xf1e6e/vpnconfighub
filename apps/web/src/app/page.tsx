import { StatusCard } from "@/components/dashboard/status-card";
import { SpeedChart } from "@/components/dashboard/speed-chart";
import { ConfigCard } from "@/components/dashboard/config-card";
import { ServerPreview } from "@/components/dashboard/server-preview";
import { UsageSummary } from "@/components/dashboard/usage-summary";
import type { UsageState } from "@/components/shop/catalog";

const unavailableUsage: UsageState = {
  status: "empty",
  totalBytes: null,
  daily: [],
};

export default function Home() {
  return (
    <div className="space-y-4 p-4">
      <StatusCard />

      <SpeedChart data={[]} label="Speed (Mbps)" />

      <UsageSummary usage={unavailableUsage} />

      <ConfigCard />

      <ServerPreview />
    </div>
  );
}
