"use client";

import Link from "next/link";

interface ServerNode {
  id: string;
  country: string;
  flag: string;
  city: string;
  pingMs: number;
  loadPercent: number;
  protocol: string;
}

const SERVERS: ServerNode[] = [
  {
    id: "de-01",
    country: "Germany",
    flag: "🇩🇪",
    city: "Frankfurt",
    pingMs: 24,
    loadPercent: 32,
    protocol: "VLESS REALITY",
  },
  {
    id: "nl-01",
    country: "Netherlands",
    flag: "🇳🇱",
    city: "Amsterdam",
    pingMs: 29,
    loadPercent: 45,
    protocol: "VLESS REALITY",
  },
  {
    id: "fi-01",
    country: "Finland",
    flag: "🇫🇮",
    city: "Helsinki",
    pingMs: 38,
    loadPercent: 18,
    protocol: "Hysteria 2",
  },
];

export function ServerPreview() {
  return (
    <div className="rounded-2xl border border-[#2b394a] bg-[#242f3d] p-5 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#f5f5f5]">Top Active Nodes</h3>
        <Link
          href="/nodes"
          className="text-xs font-semibold text-[#2aabee] hover:underline"
        >
          View All Nodes →
        </Link>
      </div>

      <div className="mt-3 space-y-2.5">
        {SERVERS.map((server) => (
          <div
            key={server.id}
            className="flex items-center justify-between rounded-xl border border-[#2b394a] bg-[#1f2936] p-3 transition hover:border-[#2aabee]/50"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl" role="img" aria-label={server.country}>
                {server.flag}
              </span>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#f5f5f5]">{server.city}</span>
                  <span className="rounded bg-[#2b394a] px-1.5 py-0.2 text-[10px] text-[#7f8c99]">
                    {server.protocol}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#17212b]">
                    <div
                      className="h-full rounded-full bg-[#4cd964]"
                      style={{ width: `${server.loadPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[#7f8c99]">
                    {server.loadPercent}% load
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 rounded-md bg-[#4cd964]/10 px-2 py-0.5 text-xs font-semibold text-[#4cd964]">
                ⚡ {server.pingMs} ms
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
