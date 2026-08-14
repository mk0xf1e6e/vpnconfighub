"use client";

import type { ProductFamilyDefinition } from "@/components/shop/catalog";

interface PlanCardProps {
  product: ProductFamilyDefinition;
  selected: boolean;
  onSelect: () => void;
}

export function PlanCard({ product, selected, onSelect }: PlanCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-2xl border p-4 text-left shadow-lg transition focus:outline-none focus:ring-2 focus:ring-[#2aabee] ${
        selected
          ? "border-[#2aabee] bg-[#242f3d] ring-1 ring-[#2aabee]"
          : "border-[#2b394a] bg-[#242f3d] hover:border-[#5288c1]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-[#f5f5f5]">{product.name}</h3>
          <p className="mt-1 text-xs leading-5 text-[#7f8c99]">{product.description}</p>
        </div>
        <span className="rounded-full border border-[#2b394a] bg-[#1f2936] px-2 py-1 text-[10px] font-semibold text-[#eac035]">
          {product.availability === "planned" ? "Coming soon" : "Available"}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {product.protocols.map((protocol) => (
          <span key={protocol} className="rounded-md bg-[#1f2936] px-2 py-1 text-[10px] font-semibold text-[#7f8c99]">
            {protocol}
          </span>
        ))}
      </div>
    </button>
  );
}
