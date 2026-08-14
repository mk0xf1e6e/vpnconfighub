"use client";

import { useMemo, useState } from "react";
import { CheckoutModal } from "@/components/shop/checkout-modal";
import {
  createDefaultSelection,
  DEVICE_OPTIONS,
  DURATION_OPTIONS,
  getFamily,
  PRODUCT_FAMILIES,
  QUOTA_OPTIONS,
  SPEED_OPTIONS,
  type DeviceOption,
  type DurationOption,
  type ProductFamily,
  type ProductSelection,
  type QuotaOption,
  type SpeedOption,
} from "@/components/shop/catalog";
import { PlanCard } from "@/components/shop/plan-card";

function OptionGroup<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Array<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-xs font-semibold text-[#7f8c99]">{label}</legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {options.map((option) => (
          <button
            key={String(option.value)}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
              value === option.value
                ? "border-[#2aabee] bg-[#2aabee]/15 text-[#f5f5f5]"
                : "border-[#2b394a] bg-[#1f2936] text-[#7f8c99] hover:border-[#5288c1]"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export default function StorePage() {
  const [selection, setSelection] = useState<ProductSelection>(createDefaultSelection);
  const [selectedForCheckout, setSelectedForCheckout] = useState(false);
  const family = useMemo(() => getFamily(selection.family), [selection.family]);

  const changeFamily = (familyId: ProductFamily) => {
    const nextFamily = getFamily(familyId);
    setSelection((current) => ({ ...current, family: familyId, protocol: nextFamily.protocols[0] }));
  };

  const update = <K extends keyof ProductSelection>(key: K, value: ProductSelection[K]) => {
    setSelection((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="space-y-5 p-4">
      <header>
        <h1 className="text-xl font-bold text-[#f5f5f5]">Build Your Connection</h1>
        <p className="text-xs text-[#7f8c99]">Choose the proxy or config you want to create.</p>
        <p className="mt-3 rounded-xl border border-[#eac035]/30 bg-[#eac035]/10 px-3 py-2 text-xs text-[#eac035]">
          Frontend catalog only. Prices, payments, and provisioning are not connected.
        </p>
      </header>

      <section>
        <h2 className="mb-3 text-sm font-bold text-[#f5f5f5]">1. Choose a service</h2>
        <div className="space-y-3">
          {PRODUCT_FAMILIES.map((product) => (
            <PlanCard key={product.id} product={product} selected={product.id === selection.family} onSelect={() => changeFamily(product.id)} />
          ))}
        </div>
      </section>

      <section className="space-y-5 rounded-2xl border border-[#2b394a] bg-[#242f3d] p-4">
        <h2 className="text-sm font-bold text-[#f5f5f5]">2. Configure entitlements</h2>

        <OptionGroup label="Protocol" options={family.protocols.map((protocol) => ({ value: protocol, label: protocol }))} value={selection.protocol} onChange={(value) => update("protocol", value)} />
        <OptionGroup label="Traffic quota" options={QUOTA_OPTIONS} value={selection.quota} onChange={(value) => update("quota", value as QuotaOption)} />
        <OptionGroup label="Speed cap" options={SPEED_OPTIONS} value={selection.speed} onChange={(value) => update("speed", value as SpeedOption)} />
        <OptionGroup label="Duration" options={DURATION_OPTIONS} value={selection.durationDays} onChange={(value) => update("durationDays", value as DurationOption)} />
        <OptionGroup label="Allowed devices" options={DEVICE_OPTIONS} value={selection.devices} onChange={(value) => update("devices", value as DeviceOption)} />

        <div className="rounded-xl border border-[#2aabee]/40 bg-[#1f2936] p-3 text-xs text-[#7f8c99]">
          <p className="font-bold text-[#f5f5f5]">Selection summary</p>
          <p className="mt-1">{family.name} · {selection.protocol}</p>
          <p>{selection.quota === "unlimited" ? "Unlimited traffic" : `${selection.quota} GB traffic`} · {selection.speed === "uncapped" ? "Uncapped speed" : `${selection.speed} Mbps cap`}</p>
          <p>{selection.durationDays} days · {selection.devices} device{selection.devices === 1 ? "" : "s"}</p>
          <p className="mt-2 text-[#eac035]">Draft pricing: unavailable until pricing is approved.</p>
        </div>

        <button type="button" onClick={() => setSelectedForCheckout(true)} className="w-full rounded-xl bg-[#2aabee] py-3 text-xs font-bold text-white transition hover:bg-[#229ed9]">
          Review configuration
        </button>
      </section>

      {selectedForCheckout && (
        <CheckoutModal selection={selection} productName={family.name} protocol={selection.protocol} onClose={() => setSelectedForCheckout(false)} />
      )}
    </div>
  );
}
