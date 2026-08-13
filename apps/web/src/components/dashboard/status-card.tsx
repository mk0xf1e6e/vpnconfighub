"use client";

export function StatusCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#2b394a] bg-[#242f3d] p-5 shadow-lg">
      {/* Background glow decoration */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#2aabee]/10 blur-2xl" />

      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#7f8c99]">
            Active Subscription
          </span>
          <h2 className="mt-1 text-xl font-bold text-[#f5f5f5]">Pro Ultra 5G Plan</h2>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#4cd964]/30 bg-[#4cd964]/10 px-3 py-1 text-xs font-bold text-[#4cd964]">
          <span className="h-2 w-2 rounded-full bg-[#4cd964] animate-pulse" />
          ACTIVE
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#2b394a] pt-4">
        <div>
          <p className="text-xs text-[#7f8c99]">Expiration</p>
          <p className="mt-0.5 text-sm font-semibold text-[#f5f5f5]">Sep 10, 2026</p>
          <p className="text-[11px] text-[#2aabee]">28 days remaining</p>
        </div>

        <div>
          <p className="text-xs text-[#7f8c99]">Connection Speed</p>
          <p className="mt-0.5 text-sm font-semibold text-[#f5f5f5]">1 Gbps Uncapped</p>
          <p className="text-[11px] text-[#4cd964]">Dedicated Line</p>
        </div>
      </div>
    </div>
  );
}
