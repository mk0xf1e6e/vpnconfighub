"use client";

export function ConfigCard() {
  return (
    <div className="rounded-2xl border border-[#2b394a] bg-[#242f3d] p-5 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#f5f5f5]">Configuration</h3>
        <span className="rounded bg-[#7f8c99]/10 px-2 py-0.5 text-[11px] font-bold text-[#7f8c99]">
          Not configured
        </span>
      </div>

      <div className="mt-3 overflow-hidden rounded-xl border border-[#2b394a] bg-[#1f2936] p-3 font-mono text-xs text-[#7f8c99]">
        <p className="text-[#7f8c99]">No configuration available. Subscribe to a plan to get started.</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <button
          type="button"
          disabled
          className="flex items-center justify-center gap-1.5 rounded-xl bg-[#5288c1]/50 px-4 py-2.5 text-xs font-semibold text-white/50 cursor-not-allowed"
        >
          <span>📋</span>
          <span>Copy Config</span>
        </button>

        <button
          type="button"
          disabled
          className="flex items-center justify-center gap-1.5 rounded-xl border border-[#2b394a] bg-[#1f2936] px-4 py-2.5 text-xs font-semibold text-[#7f8c99] cursor-not-allowed"
        >
          <span>📱</span>
          <span>QR Code</span>
        </button>
      </div>
    </div>
  );
}