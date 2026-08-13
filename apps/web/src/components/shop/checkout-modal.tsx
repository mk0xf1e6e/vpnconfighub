"use client";

import type { SubscriptionPlan } from "@/components/shop/plan-card";

interface CheckoutModalProps {
  plan: SubscriptionPlan;
  billingPeriod: "monthly" | "annual";
  onClose: () => void;
}

export function CheckoutModal({
  plan,
  billingPeriod,
  onClose,
}: CheckoutModalProps) {
  const isAnnual = billingPeriod === "annual";
  const starsPrice = isAnnual ? plan.starsPriceAnnual : plan.starsPriceMonthly;

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
            <h3 className="text-lg font-bold text-[#f5f5f5]">Checkout Order</h3>
            <p className="text-xs text-[#7f8c99]">Confirm your subscription tier</p>
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
            <span className="font-bold text-[#f5f5f5]">{plan.name} Plan</span>
            <span className="rounded bg-[#2aabee]/10 px-2 py-0.5 text-xs font-semibold text-[#2aabee]">
              {isAnnual ? "1 Year Access" : "30 Days Access"}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-[#7f8c99]">
            <span>Speed: {plan.speed}</span>
            <span>Devices: {plan.devices}</span>
          </div>
        </div>

        <div className="mt-4 space-y-2 rounded-xl bg-[#1f2936] p-4 text-xs">
          <div className="flex justify-between text-[#7f8c99]">
            <span>Plan Price</span>
            <span className="text-[#f5f5f5]">⭐ {starsPrice} Stars</span>
          </div>

          <div className="border-t border-[#2b394a] pt-2 flex justify-between text-sm font-bold">
            <span className="text-[#f5f5f5]">Total Due</span>
            <span className="text-[#eac035]">⭐ {starsPrice} Stars</span>
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-[#eac035]/30 bg-[#eac035]/10 p-3 text-xs text-[#eac035]">
          ⚠️ Payment processing is not yet configured. Please try again later.
        </div>

        <div className="mt-6 space-y-2">
          <button
            type="button"
            disabled
            className="w-full rounded-xl bg-[#2aabee]/50 py-3.5 text-xs font-bold text-white/50 cursor-not-allowed"
          >
            Payment Unavailable
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
