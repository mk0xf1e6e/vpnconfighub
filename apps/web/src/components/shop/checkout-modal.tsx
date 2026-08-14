"use client";

import type { ProductSelection } from "@/components/shop/catalog";

interface CheckoutModalProps {
  selection: ProductSelection;
  productName: string;
  protocol: string;
  onClose: () => void;
}

export function CheckoutModal({
  selection,
  productName,
  protocol,
  onClose,
}: CheckoutModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 p-0 sm:p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl sm:rounded-2xl border border-[#2b394a] bg-[#17212b] p-6 text-[#f5f5f5] shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#2b394a] pb-4">
          <div>
            <h3 className="text-lg font-bold text-[#f5f5f5]">Configuration Summary</h3>
            <p className="text-xs text-[#7f8c99]">Review the future entitlement</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2b394a] bg-[#1f2936] text-sm text-[#7f8c99] hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 rounded-xl border border-[#2b394a] bg-[#242f3d] p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#f5f5f5]">{productName}</span>
            <span className="rounded bg-[#2aabee]/10 px-2 py-0.5 text-xs font-semibold text-[#2aabee]">
              {selection.durationDays} days
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-[#7f8c99]">
            <span>Protocol: {protocol}</span>
            <span>Devices: {selection.devices}</span>
          </div>
          <div className="mt-2 text-xs text-[#7f8c99]">
            {selection.quota === "unlimited" ? "Unlimited traffic" : `${selection.quota} GB traffic`} · {selection.speed === "uncapped" ? "Uncapped speed" : `${selection.speed} Mbps cap`}
          </div>
        </div>

        <div className="mt-4 space-y-2 rounded-xl bg-[#1f2936] p-4 text-xs">
          <div className="flex justify-between text-[#7f8c99]"><span>Price</span><span className="text-[#eac035]">Unavailable</span></div>
          <div className="border-t border-[#2b394a] pt-2 text-xs text-[#7f8c99]">Draft catalog only. No payment or provisioning is connected.</div>
        </div>

        <div className="mt-3 rounded-xl border border-[#eac035]/30 bg-[#eac035]/10 p-3 text-xs text-[#eac035]">
          Payment and configuration generation are not connected yet.
        </div>

        <div className="mt-6 space-y-2">
          <button
            type="button"
            disabled
            className="w-full rounded-xl bg-[#2aabee]/50 py-3.5 text-xs font-bold text-white/50 cursor-not-allowed"
          >
            Provisioning Unavailable
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-[#2b394a] bg-[#1f2936] py-3 text-xs font-semibold text-[#7f8c99] hover:text-[#f5f5f5]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
