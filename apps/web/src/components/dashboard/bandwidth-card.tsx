"use client";

export function BandwidthCard() {
  const usedGB = 45.2;
  const totalGB = 200;
  const percent = Math.min(100, Math.round((usedGB / totalGB) * 100));

  return (
    <div className="rounded-2xl border border-[#2b394a] bg-[#242f3d] p-5 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#f5f5f5]">Data Quota Usage</h3>
        <span className="text-xs font-semibold text-[#2aabee]">{percent}% used</span>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-[#1f2936]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#2aabee] to-[#5288c1] transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="mt-2 flex justify-between text-xs text-[#7f8c99]">
        <span>{usedGB} GB used</span>
        <span>{totalGB} GB limit</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#2b394a] pt-3 text-xs">
        <div className="flex items-center gap-2 rounded-xl bg-[#1f2936] p-2.5">
          <span className="text-base text-[#4cd964]">↓</span>
          <div>
            <p className="text-[#7f8c99]">Downloaded</p>
            <p className="font-bold text-[#f5f5f5]">38.6 GB</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-[#1f2936] p-2.5">
          <span className="text-base text-[#2aabee]">↑</span>
          <div>
            <p className="text-[#7f8c99]">Uploaded</p>
            <p className="font-bold text-[#f5f5f5]">6.6 GB</p>
          </div>
        </div>
      </div>
    </div>
  );
}
