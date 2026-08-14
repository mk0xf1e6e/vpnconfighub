"use client";

import Link from "next/link";

export function ServerPreview({ nodes = [] }: { nodes?: unknown[] }) {
  return (
    <div className="rounded-2xl border border-[#2b394a] bg-[#242f3d] p-5 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#f5f5f5]">Server Nodes</h3>
        <Link
          href="/nodes"
          className="text-xs font-semibold text-[#2aabee] hover:underline"
        >
          View All →
        </Link>
      </div>

      <div className="mt-3 rounded-xl border border-dashed border-[#2b394a] p-4 text-center text-xs text-[#7f8c99]">
         {nodes.length === 0 ? "No server nodes available. Provisioning is not connected." : `${nodes.length} server node${nodes.length === 1 ? "" : "s"} available.`}
      </div>
    </div>
  );
}
