"use client";

export function StatusCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#2b394a] bg-[#242f3d] p-5 shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#7f8c99]">
            Subscription
          </span>
          <h2 className="mt-1 text-xl font-bold text-[#f5f5f5]">No active subscription</h2>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#7f8c99]/30 bg-[#7f8c99]/10 px-3 py-1 text-xs font-bold text-[#7f8c99]">
          INACTIVE
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#2b394a] pt-4">
        <div>
          <p className="text-xs text-[#7f8c99]">Expiration</p>
          <p className="mt-0.5 text-sm font-semibold text-[#7f8c99]">Not available</p>
        </div>

        <div>
          <p className="text-xs text-[#7f8c99]">Connection Speed</p>
          <p className="mt-0.5 text-sm font-semibold text-[#7f8c99]">Not available</p>
        </div>
      </div>
    </div>
  );
}