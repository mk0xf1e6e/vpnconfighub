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
      <p className="mt-2 text-xs text-[#7f8c99]">Traffic data available from the backend.</p>
    </section>
  );
}

function StateCard({ title, message }: { title: string; message: string }) {
  return (
    <section className="rounded-2xl border border-[#2b394a] bg-[#242f3d] p-5 shadow-lg">
      <h3 className="text-sm font-bold text-[#f5f5f5]">{title}</h3>
      <p className="mt-3 text-xs text-[#7f8c99]">{message}</p>
    </section>
  );
}
