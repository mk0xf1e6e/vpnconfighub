"use client";

import type { ProductSelection } from "@/components/shop/catalog";
import { purchaseDemoProxy, type DemoPurchaseResponse } from "@/lib/api/client";
import { useState } from "react";

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
  const [result, setResult] = useState<DemoPurchaseResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const buy = async () => {
    setLoading(true); setError(false);
    try { setResult(await purchaseDemoProxy({ family: productName, protocol, quota: selection.quota, speed: selection.speed, durationDays: selection.durationDays, devices: selection.devices })); }
    catch { setError(true); }
    finally { setLoading(false); }
  };
  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center overflow-y-auto bg-black/75 p-3 pb-20 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-md overflow-y-auto rounded-3xl border border-[#2b394a] bg-[#17212b] p-6 text-[#f5f5f5] shadow-2xl transition-all sm:max-h-[calc(100dvh-2rem)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#2b394a] pb-4">
          <div>
            <h3 className="text-lg font-bold text-[#f5f5f5]">Configuration Summary</h3>
            <p className="text-xs text-[#7f8c99]">Demo purchase only</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2b394a] bg-[#1f2936] text-sm text-[#7f8c99] hover:text-white"
          >
            ✕
          </button>
        </div>

        {result ? <div className="mt-4 space-y-2 rounded-xl border border-[#2aabee]/40 bg-[#242f3d] p-4 text-xs">
          <p className="font-bold text-[#2aabee]">Demo payment complete</p>
          <p className="text-[#7f8c99]">Payment ID: {result.payment.paymentId}</p>
          <p className="font-semibold text-[#f5f5f5]">Fake proxy credentials</p>
          <p className="break-all text-[#7f8c99]">Address: {result.proxy.address}:{result.proxy.port}</p>
          <p className="break-all text-[#7f8c99]">Username: {result.proxy.username}</p>
          <p className="break-all text-[#7f8c99]">Password: {result.proxy.password}</p>
          <p className="pt-2 text-[#eac035]">{result.proxy.note}</p>
        </div> : <div className="mt-4 rounded-xl border border-[#2b394a] bg-[#242f3d] p-4 space-y-2">
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
        </div>}

        <div className="mt-4 space-y-2 rounded-xl bg-[#1f2936] p-4 text-xs">
          <div className="flex justify-between text-[#7f8c99]"><span>Price</span><span className="text-[#eac035]">Unavailable</span></div>
          <div className="border-t border-[#2b394a] pt-2 text-xs text-[#7f8c99]">Draft catalog only. No payment or provisioning is connected.</div>
        </div>

        <div className="mt-3 rounded-xl border border-[#eac035]/30 bg-[#eac035]/10 p-3 text-xs text-[#eac035]">
          Demo mode: fake payment and fake credentials. No real charge or live proxy.
        </div>

        <div className="mt-6 space-y-2">
          <button
            type="button"
            disabled={loading || Boolean(result)}
            onClick={buy}
            className="w-full rounded-xl bg-[#2aabee] py-3.5 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Generating demo proxy..." : result ? "Demo proxy generated" : "Pay with demo payment"}
          </button>
          {error ? <p className="text-center text-xs text-[#eac035]">Demo purchase failed. Try again.</p> : null}

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
