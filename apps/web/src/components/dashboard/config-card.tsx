"use client";

import { useState } from "react";

const MOCK_VLESS_CONFIG =
  "vless://8a3f2c91-9e7b-482f-b204-123456789abc@de.vpnconfighub.com:443?type=tcp&security=reality&pbk=7x98abc123...#VPNConfigHub-Pro";

const MOCK_TELEGRAM_PROXY =
  "https://t.me/proxy?server=tg.vpnconfighub.com&port=443&secret=dd1234567890abcdef1234567890abcdef";

export function ConfigCard() {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(MOCK_VLESS_CONFIG);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API unavailable
    }
  };

  return (
    <div className="rounded-2xl border border-[#2b394a] bg-[#242f3d] p-5 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#f5f5f5]">VLESS Configuration</h3>
        <span className="rounded bg-[#2aabee]/10 px-2 py-0.5 text-[11px] font-bold text-[#2aabee]">
          REALITY
        </span>
      </div>

      <div className="mt-3 overflow-hidden rounded-xl border border-[#2b394a] bg-[#1f2936] p-3 font-mono text-xs text-[#7f8c99]">
        <p className="truncate text-[#f5f5f5]">{MOCK_VLESS_CONFIG}</p>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-[#5288c1] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#4172a5] focus:outline-none focus:ring-2 focus:ring-[#2aabee]"
        >
          <span>{copied ? "✓" : "📋"}</span>
          <span>{copied ? "Copied!" : "Copy Config"}</span>
        </button>

        <button
          type="button"
          onClick={() => setShowQR(true)}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-[#2b394a] bg-[#1f2936] px-4 py-2.5 text-xs font-semibold text-[#f5f5f5] transition hover:bg-[#2b394a] focus:outline-none focus:ring-2 focus:ring-[#2aabee]"
        >
          <span>📱</span>
          <span>QR Code</span>
        </button>
      </div>

      {/* Telegram MTProto Proxy button */}
      <a
        href={MOCK_TELEGRAM_PROXY}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#2aabee]/40 bg-[#2aabee]/10 px-4 py-2.5 text-xs font-bold text-[#2aabee] transition hover:bg-[#2aabee]/20 focus:outline-none focus:ring-2 focus:ring-[#2aabee]"
      >
        <span>✈️</span>
        <span>Connect Telegram Proxy</span>
      </a>

      {/* QR Code Modal */}
      {showQR && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setShowQR(false)}
        >
          <div
            className="w-full max-w-xs rounded-2xl border border-[#2b394a] bg-[#17212b] p-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-base font-bold text-[#f5f5f5]">VLESS QR Code</h4>
            <p className="mt-1 text-xs text-[#7f8c99]">
              Scan with v2rayNG, Streisand, or Shadowrocket
            </p>

            <div className="my-5 flex justify-center rounded-xl bg-white p-4">
              {/* SVG Mock QR Code */}
              <svg className="h-44 w-44 text-black" viewBox="0 0 100 100" fill="currentColor">
                <rect x="0" y="0" width="30" height="30" />
                <rect x="5" y="5" width="20" height="20" fill="white" />
                <rect x="10" y="10" width="10" height="10" />

                <rect x="70" y="0" width="30" height="30" />
                <rect x="75" y="5" width="20" height="20" fill="white" />
                <rect x="80" y="10" width="10" height="10" />

                <rect x="0" y="70" width="30" height="30" />
                <rect x="5" y="75" width="20" height="20" fill="white" />
                <rect x="10" y="80" width="10" height="10" />

                <rect x="40" y="10" width="10" height="20" />
                <rect x="10" y="40" width="20" height="10" />
                <rect x="40" y="40" width="20" height="20" />
                <rect x="70" y="40" width="15" height="15" />
                <rect x="40" y="70" width="15" height="25" />
                <rect x="65" y="70" width="25" height="15" />
              </svg>
            </div>

            <button
              type="button"
              onClick={() => setShowQR(false)}
              className="w-full rounded-xl bg-[#5288c1] py-2.5 text-xs font-bold text-white transition hover:bg-[#4172a5]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
