"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Home", icon: "fa-shield-alt" },
  { href: "/store", label: "Store", icon: "fa-store" },
  { href: "/nodes", label: "Nodes", icon: "fa-server" },
  { href: "/guides", label: "Guides", icon: "fa-book" },
  { href: "/support", label: "Help", icon: "fa-headset" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[#2b394a] bg-[#17212b]/95 backdrop-blur"
      style={{
        paddingBottom: "var(--tg-safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="mx-auto flex w-full max-w-3xl items-center justify-around px-2 py-2">
        {items.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-11 min-w-14 flex-col items-center justify-center rounded-xl px-2 py-1 transition"
              style={{
                color: active ? "#2aabee" : "#7f8c99",
              }}
              aria-current={active ? "page" : undefined}
            >
              <i className={`fas ${item.icon} text-base mb-0.5`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
