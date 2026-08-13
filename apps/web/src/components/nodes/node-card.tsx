"use client";

import { useState } from "react";

export interface ServerNode {
  id: string;
  name: string;
  country: string;
  flag: string;
  city: string;
  pingMs: number;
  loadPercent: number;
  protocol: string;
  configUrl: string;
}

interface NodeCardProps {
  node: ServerNode;
  onSelect?: (node: ServerNode) => void;
}

export function NodeCard({ node, onSelect }: NodeCardProps) {
  const [copied, setCopied] = useState(false);

  const getPingColorClass = (ping: number) => {
    if (ping < 60) return "text-[#4cd964] bg-[#4cd964]/10 border-[#4cd964]/20";
    if (ping < 120) return "text-[#eac035] bg-[#eac035]/10 border-[#eac035]/20";
    return "text-[#f87171] bg-[#f87171]/10 border-[#f87171]/20";
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(node.configUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="rounded-2xl border border-[#2b394a] bg-[#242f3d] p-4 shadow-lg transition hover:border-[#2aabee]/50">
      <div className="flex items-center justify-between gap-3">
        {/* Flag & Location */}
        <div className="flex items-center gap-3">
          <span className="text-2xl" role="img" aria-label={node.country}>
            {node.flag}
          </span>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-[#f5f5f5] text-sm">{node.name}</h4>
              <span className="rounded bg-[#1f2936] border border-[#2b394a] px-1.5 py-0.2 text-[10px] text-[#7f8c99]">
                {node.protocol}
              </span>
            </div>
            <p className="text-xs text-[#7f8c99]">{node.city}, {node.country}</p>
          </div>
        </div>

        {/* Ping status */}
        <div className="text-right">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${getPingColorClass(
              node.pingMs
            )}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                node.pingMs < 60
                  ? "bg-[#4cd964] animate-pulse"
                  : node.pingMs < 120
                  ? "bg-[#eac035]"
                  : "bg-[#f87171]"
              }`}
            />
            {node.pingMs} ms
          </span>
        </div>
      </div>

      {/* Load & Actions Bar */}
      <div className="mt-4 flex items-center justify-between border-t border-[#2b394a] pt-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#17212b]">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                node.loadPercent < 50
                  ? "bg-[#4cd964]"
                  : node.loadPercent < 80
                  ? "bg-[#eac035]"
                  : "bg-[#f87171]"
              }`}
              style={{ width: `${node.loadPercent}%` }}
            />
          </div>
          <span className="text-[11px] text-[#7f8c99]">
            {node.loadPercent}% load
          </span>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-lg border border-[#2b394a] bg-[#1f2936] px-3 py-1.5 text-[11px] font-semibold text-[#f5f5f5] transition hover:bg-[#2b394a]"
          >
            {copied ? "✓ Copied" : "Copy VLESS"}
          </button>

          {onSelect && (
            <button
              type="button"
              onClick={() => onSelect(node)}
              className="rounded-lg bg-[#5288c1] px-3 py-1.5 text-[11px] font-bold text-white transition hover:bg-[#4172a5]"
            >
              Connect
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
