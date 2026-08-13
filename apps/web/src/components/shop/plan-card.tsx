"use client";

export interface SubscriptionPlan {
  id: string;
  name: string;
  popular?: boolean;
  starsPriceMonthly: number;
  starsPriceAnnual: number;
  usdEquivalentMonthly: number;
  speed: string;
  quota: string;
  devices: number;
  protocols: string[];
  features: string[];
}

interface PlanCardProps {
  plan: SubscriptionPlan;
  billingPeriod: "monthly" | "annual";
  onSelectPlan: (plan: SubscriptionPlan) => void;
}

export function PlanCard({ plan, billingPeriod, onSelectPlan }: PlanCardProps) {
  const isAnnual = billingPeriod === "annual";
  const stars = isAnnual ? plan.starsPriceAnnual : plan.starsPriceMonthly;
  const originalStars = isAnnual ? plan.starsPriceMonthly * 12 : plan.starsPriceMonthly;
  const discountPercent = isAnnual ? 20 : 0;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-5 shadow-lg transition-all ${
        plan.popular
          ? "border-[#2aabee] bg-[#242f3d] ring-1 ring-[#2aabee]"
          : "border-[#2b394a] bg-[#242f3d]"
      }`}
    >
      {/* Popular badge */}
      {plan.popular && (
        <div className="absolute right-4 top-0 rounded-b-lg bg-[#2aabee] px-3 py-1 text-[10px] font-bold text-white shadow-md uppercase tracking-wider">
          ★ Best Value
        </div>
      )}

      {/* Plan Title & Speed */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-[#f5f5f5]">{plan.name}</h3>
          <p className="text-xs text-[#2aabee] font-medium">{plan.speed} Uncapped Speed</p>
        </div>
      </div>

      {/* Price section */}
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-2xl font-extrabold text-[#eac035]">⭐ {stars}</span>
        <span className="text-xs text-[#7f8c99]">Stars / {isAnnual ? "year" : "month"}</span>

        {isAnnual && (
          <span className="text-xs text-[#7f8c99] line-through">
            ⭐ {originalStars}
          </span>
        )}
      </div>

      {isAnnual && (
        <p className="mt-1 text-[11px] font-semibold text-[#4cd964]">
          Save {discountPercent}% with annual billing
        </p>
      )}

      {/* Specs Grid */}
      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[#2b394a] pt-4 text-xs">
        <div className="rounded-xl bg-[#1f2936] p-2.5">
          <span className="text-[#7f8c99] block text-[10px]">Data Quota</span>
          <span className="font-bold text-[#f5f5f5]">{plan.quota}</span>
        </div>

        <div className="rounded-xl bg-[#1f2936] p-2.5">
          <span className="text-[#7f8c99] block text-[10px]">Simultaneous Devices</span>
          <span className="font-bold text-[#f5f5f5]">{plan.devices} Devices</span>
        </div>
      </div>

      {/* Feature Bullet List */}
      <ul className="mt-4 space-y-2 border-t border-[#2b394a] pt-3 text-xs text-[#f5f5f5]">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <span className="text-[#4cd964] font-bold">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Supported Protocols Badges */}
      <div className="mt-4 flex flex-wrap gap-1.5 border-t border-[#2b394a] pt-3">
        {plan.protocols.map((proto) => (
          <span
            key={proto}
            className="rounded-md bg-[#1f2936] border border-[#2b394a] px-2 py-0.5 text-[10px] font-semibold text-[#7f8c99]"
          >
            {proto}
          </span>
        ))}
      </div>

      {/* Select Plan Button */}
      <button
        type="button"
        onClick={() => onSelectPlan(plan)}
        className={`mt-5 w-full rounded-xl py-3 text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-[#2aabee] ${
          plan.popular
            ? "bg-[#2aabee] text-white hover:bg-[#229ed9]"
            : "bg-[#5288c1] text-white hover:bg-[#4172a5]"
        }`}
      >
        Choose {plan.name}
      </button>
    </div>
  );
}
