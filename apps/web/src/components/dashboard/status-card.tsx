"use client";

export function StatusCard({ subscription }: { subscription?: { name: string; status: string; quotaBytes: number; usedBytes: number; daysRemaining: number; speedMbps: number } }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#2b394a] bg-[#242f3d] p-5 shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#7f8c99]">
            Subscription
          </span>
            <h2 className="mt-1 text-xl font-bold text-[#f5f5f5]">{subscription?.name ?? "Subscription unavailable"}</h2>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#7f8c99]/30 bg-[#7f8c99]/10 px-3 py-1 text-xs font-bold text-[#7f8c99]">
          {subscription ? "DEMO DATA" : "UNAVAILABLE"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#2b394a] pt-4">
        <div>
          <p className="text-xs text-[#7f8c99]">Expiration</p>
          <p className="mt-0.5 text-sm font-semibold text-[#7f8c99]">{subscription ? `${subscription.daysRemaining} days remaining` : "Not available"}</p>
        </div>

        <div>
          <p className="text-xs text-[#7f8c99]">Connection Speed</p>
          <p className="mt-0.5 text-sm font-semibold text-[#7f8c99]">{subscription ? `${subscription.speedMbps} Mbps` : "Not available"}</p>
        </div>
      </div>
      {subscription ? <div className="mt-4 border-t border-[#2b394a] pt-4">
        <div className="flex justify-between text-xs text-[#7f8c99]"><span>Quota used</span><span>{formatBytes(subscription.usedBytes)} / {formatBytes(subscription.quotaBytes)}</span></div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#1f2936]"><div className="h-full rounded-full bg-[#2aabee]" style={{ width: `${Math.min(100, Math.max(0, subscription.usedBytes / subscription.quotaBytes * 100))}%` }} /></div>
      </div> : null}
    </div>
  );
}

function formatBytes(value: number) {
  if (value >= 1024 ** 3) return `${(value / 1024 ** 3).toFixed(1)} GB`;
  if (value >= 1024 ** 2) return `${(value / 1024 ** 2).toFixed(1)} MB`;
  return `${value} B`;
}
