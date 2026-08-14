import type { UsageState } from "@/components/shop/catalog";

export function UsageSummary({ usage }: { usage: UsageState }) {
  if (usage.status === "loading") {
    return <StateCard title="Usage" message="Loading usage data..." />;
  }

  if (usage.status === "error") {
    return <StateCard title="Usage" message="Usage data is currently unavailable." />;
  }

  if (usage.status === "empty" || usage.totalBytes === null) {
    return <StateCard title="Usage" message="No traffic data available." />;
  }

  return (
    <section className="rounded-2xl border border-[#2b394a] bg-[#242f3d] p-5 shadow-lg">
      <h3 className="text-sm font-bold text-[#f5f5f5]">Usage</h3>
      <p className="mt-2 text-xs text-[#7f8c99]">Demo data · {formatBytes(usage.totalBytes)} total</p>
      <div className="mt-4 space-y-2">
        {usage.daily.length === 0 ? <p className="text-xs text-[#7f8c99]">No traffic data available.</p> : usage.daily.map((item) => (
          <div key={item.date} className="flex justify-between text-xs text-[#7f8c99]"><span>{item.date}</span><span>{formatBytes(item.bytes)}</span></div>
        ))}
      </div>
    </section>
  );
}

function formatBytes(value: number): string {
  if (value < 1024) return `${value} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let amount = value;
  let unit = -1;
  while (amount >= 1024 && unit < units.length - 1) { amount /= 1024; unit += 1; }
  return `${amount.toFixed(amount >= 10 ? 0 : 1)} ${units[unit]}`;
}

function StateCard({ title, message }: { title: string; message: string }) {
  return (
    <section className="rounded-2xl border border-[#2b394a] bg-[#242f3d] p-5 shadow-lg">
      <h3 className="text-sm font-bold text-[#f5f5f5]">{title}</h3>
      <p className="mt-3 text-xs text-[#7f8c99]">{message}</p>
    </section>
  );
}
