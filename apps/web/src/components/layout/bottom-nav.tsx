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
      className="fixed inset-x-0 bottom-0 z-50 border-t backdrop-blur"
      style={{
        backgroundColor: "color-mix(in srgb, var(--tg-bg-color) 95%, transparent)",
        borderColor: "color-mix(in srgb, var(--tg-text-color) 10%, transparent)",
      }}
    >
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {items.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-16 flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs transition ${
                active ? "font-semibold text-black dark:text-white" : ""
              }`}
              style={{
                color: active ? "var(--tg-button-text-color)" : "var(--tg-hint-color)",
              }}
            >
              <span style={{ color: "inherit", fontSize: "1.25rem" }}>
                {item.icon}
              </span>
              <span style={{ color: "inherit" }}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}