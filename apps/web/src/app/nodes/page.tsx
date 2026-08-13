"use client";

export default function NodesPage() {
  return (
    <div className="p-4 space-y-4">
      <header>
        <h1 className="text-xl font-bold text-[#f5f5f5]">Server Nodes</h1>
        <p className="text-xs text-[#7f8c99]">Available server locations</p>
      </header>

      <div className="rounded-2xl border border-dashed border-[#2b394a] bg-[#242f3d] p-8 text-center shadow-lg">
        <span className="text-3xl">⚡</span>
        <h2 className="mt-2 text-base font-bold text-[#f5f5f5]">No Nodes Available</h2>
        <p className="mt-1 text-xs text-[#7f8c99]">
          Server nodes will appear here once you have an active subscription.
        </p>
      </div>
    </div>
  );
}