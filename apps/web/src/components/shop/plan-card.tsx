"use client";

import type { ProductFamilyDefinition } from "@/components/shop/catalog";
import type { ReactNode } from "react";

interface PlanCardProps {
  product: ProductFamilyDefinition;
  selected: boolean;
  onSelect: () => void;
  children?: ReactNode;
  cardRef?: (node: HTMLDivElement | null) => void;
}

export function PlanCard({ product, selected, onSelect, children, cardRef }: PlanCardProps) {
  return (
    <div
      ref={cardRef}
      className={`w-full rounded-2xl border p-4 text-left shadow-lg transition ${
        selected
          ? "border-[#2aabee] bg-[#242f3d]"
          : "border-[#2b394a] bg-[#242f3d] hover:border-[#5288c1]"
      }`}
    >
      <button type="button" onClick={onSelect} className="w-full text-left focus:outline-none">
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
      {selected ? <div className="mt-4 border-t border-[#2b394a] pt-4">{children}</div> : null}
    </div>
  );
}
