"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/store", label: "Store", icon: "▣" },
  { href: "/nodes", label: "Nodes", icon: "⚡" },
  { href: "/guides", label: "Guides", icon: "📖" },
  { href: "/support", label: "Help", icon: "💬" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[#2b394a] bg-[#17212b]"
      style={{
        paddingBottom: "var(--tg-safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="mx-auto flex max-w-lg items-center justify-around px-1 py-2">
        {items.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-w-[60px] flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-xs transition focus:outline-none focus:ring-2 focus:ring-[#2aabee]"
              style={{
                color: active ? "#2aabee" : "#7f8c99",
              }}
              aria-current={active ? "page" : undefined}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span
                className={`text-[10px] tracking-tight ${
                  active ? "font-bold text-[#2aabee]" : "font-medium text-[#7f8c99]"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
