"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/store", label: "Store", icon: "▣" },
  { href: "/services", label: "Services", icon: "◇" },
  { href: "/profile", label: "Profile", icon: "○" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t"
      style={{
        backgroundColor:
          "var(--tg-theme-bottom-bar-bg-color, var(--tg-theme-bg-color, #ffffff))",
        borderColor:
          "var(--tg-theme-section-separator-color, var(--tg-theme-secondary-bg-color, #f4f4f5))",
        paddingBottom: "var(--tg-safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {items.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-w-16 flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs"
              style={{
                color: active
                  ? "var(--tg-theme-text-color, #000000)"
                  : "var(--tg-theme-hint-color, #71717a)",
              }}
            >
              <span className="text-xl">{item.icon}</span>

              <span className={active ? "font-semibold" : undefined}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}