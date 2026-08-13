import { StatusCard } from "@/components/dashboard/status-card";
import { BandwidthCard } from "@/components/dashboard/bandwidth-card";
import { ConfigCard } from "@/components/dashboard/config-card";
import { ServerPreview } from "@/components/dashboard/server-preview";

export default function Home() {
  return (
    <div className="space-y-4 p-4">
      {/* Active Subscription Status */}
      <StatusCard />

      {/* Data Quota / Bandwidth Usage */}
      <BandwidthCard />

      {/* VLESS Configuration & Connection Actions */}
      <ConfigCard />

      {/* Top Active Server Nodes */}
      <ServerPreview />
    </div>
  );
}
