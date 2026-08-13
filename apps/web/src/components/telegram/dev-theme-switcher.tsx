"use client";

import { useState } from "react";

export function DevThemeSwitcher() {
  const [dark, setDark] = useState(false);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  function toggle() {
    const root = document.documentElement;

    if (!dark) {
      root.style.setProperty("--tg-bg-color", "#18222d");
      root.style.setProperty("--tg-text-color", "#ffffff");
      root.style.setProperty("--tg-hint-color", "#aaaaaa");
      root.style.setProperty("--tg-button-color", "#5288c1");
      root.style.setProperty("--tg-button-text-color", "#ffffff");
      root.style.setProperty("--tg-secondary-bg-color", "#17212b");
      root.style.setProperty("--tg-section-bg-color", "#18222d");
    } else {
      root.style.setProperty("--tg-bg-color", "#ffffff");
      root.style.setProperty("--tg-text-color", "#18181b");
      root.style.setProperty("--tg-hint-color", "#71717a");
      root.style.setProperty("--tg-button-color", "#18181b");
      root.style.setProperty("--tg-button-text-color", "#ffffff");
      root.style.setProperty("--tg-secondary-bg-color", "#f4f4f5");
      root.style.setProperty("--tg-section-bg-color", "#ffffff");
    }

    setDark(!dark);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="fixed right-4 top-4 z-[100] rounded-full px-3 py-2 text-xs font-semibold shadow"
      style={{
        backgroundColor: "var(--tg-button-color)",
        color: "var(--tg-button-text-color)",
      }}
    >
      {dark ? "Light" : "Dark"}
    </button>
  );
}