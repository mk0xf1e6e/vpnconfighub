"use client";

import { useState } from "react";
import { PlanCard, type SubscriptionPlan } from "@/components/shop/plan-card";
import { CheckoutModal } from "@/components/shop/checkout-modal";

const PLANS: SubscriptionPlan[] = [
  {
    id: "basic",
    name: "Basic Shield",
    starsPriceMonthly: 50,
    starsPriceAnnual: 480,
    usdEquivalentMonthly: 1.0,
    speed: "100 Mbps",
    quota: "50 GB / mo",
    devices: 2,
    protocols: ["VLESS REALITY", "Shadowsocks"],
    features: [
      "Standard Speed (100 Mbps)",
      "2 Active Devices",
      "Germany & Netherlands Nodes",
      "24/7 Server Uptime",
    ],
  },
  {
    id: "standard",
    name: "Standard Turbo",
    popular: true,
    starsPriceMonthly: 100,
    starsPriceAnnual: 960,
    usdEquivalentMonthly: 2.0,
    speed: "500 Mbps",
    quota: "150 GB / mo",
    devices: 4,
    protocols: ["VLESS REALITY", "Hysteria 2", "Shadowsocks"],
    features: [
      "High Speed (500 Mbps)",
      "4 Active Devices",
      "All EU & US Server Nodes",
      "Low Latency Gaming Optimization",
      "Telegram MTProto Proxy Included",
    ],
  },
  {
    id: "pro",
    name: "Pro Ultra 5G",
    starsPriceMonthly: 150,
    starsPriceAnnual: 1440,
    usdEquivalentMonthly: 3.0,
    speed: "1 Gbps",
    quota: "500 GB / mo",
    devices: 10,
    protocols: ["VLESS REALITY", "Hysteria 2", "TUIC v5", "Shadowsocks"],
    features: [
      "Uncapped Dedicated Speed (1 Gbps)",
      "10 Active Devices",
      "Global Premium Server Nodes",
      "Priority Traffic Routing",
    ],
  },
];

export default function StorePage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  const handleConfirmPurchase = () => {
    setSelectedPlan(null);
  };

  return (
    <div className="p-4 space-y-5">
      <header>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#f5f5f5]">Subscription Store</h1>
            <p className="text-xs text-[#7f8c99]">Choose the plan that fits your needs</p>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center">
        <div className="flex rounded-xl border border-[#2b394a] bg-[#1f2936] p-1 text-xs">
          <button
            type="button"
            onClick={() => setBillingPeriod("monthly")}
            className={`rounded-lg px-4 py-1.5 font-bold transition ${
              billingPeriod === "monthly"
                ? "bg-[#5288c1] text-white shadow"
                : "text-[#7f8c99] hover:text-[#f5f5f5]"
            }`}
          >
            Monthly
          </button>

          <button
            type="button"
            onClick={() => setBillingPeriod("annual")}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 font-bold transition ${
              billingPeriod === "annual"
                ? "bg-[#2aabee] text-white shadow"
                : "text-[#7f8c99] hover:text-[#f5f5f5]"
            }`}
          >
            <span>Annual</span>
            <span className="rounded bg-[#4cd964] px-1.5 py-0.2 text-[9px] font-extrabold text-black">
              -20%
            </span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            billingPeriod={billingPeriod}
            onSelectPlan={(p) => setSelectedPlan(p)}
          />
        ))}
      </div>

      {selectedPlan && (
        <CheckoutModal
          plan={selectedPlan}
          billingPeriod={billingPeriod}
          onClose={() => setSelectedPlan(null)}
          onConfirmPurchase={handleConfirmPurchase}
        />
      )}
    </div>
  );
}