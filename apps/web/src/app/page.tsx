import { StatusCard } from "@/components/dashboard/status-card";
import { SpeedChart } from "@/components/dashboard/speed-chart";
import { ConfigCard } from "@/components/dashboard/config-card";
import { ServerPreview } from "@/components/dashboard/server-preview";

export default function Home() {
  return (
    <div className="space-y-4 p-4">
      <StatusCard />

      <SpeedChart data={[]} label="Speed (Mbps)" />

      <div className="rounded-2xl border border-[#2b394a] bg-[#242f3d] p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#f5f5f5]">Data Quota Usage</h3>
          <span className="text-xs font-semibold text-[#7f8c99]">Not available</span>
        </div>

        <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-[#1f2936]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#2aabee] to-[#5288c1] transition-all duration-500"
            style={{ width: "0%" }}
          />
        </div>

        <div className="mt-2 flex justify-between text-xs text-[#7f8c99]">
          <span>No data available</span>
          <span>—</span>
        </div>
      </div>

      <ConfigCard />

      <ServerPreview />
    </div>
  );
}