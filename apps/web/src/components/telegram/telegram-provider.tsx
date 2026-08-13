"use client";

import { useEffect } from "react";

export function TelegramProvider() {
  useEffect(() => {
    const webApp = window.Telegram?.WebApp;

    if (!webApp) {
      console.info("Telegram WebApp API is not available.");
      return;
    }

    webApp.ready();
    webApp.expand();

    const applyTheme = () => {
      const html = document.documentElement;
      const { colorScheme, themeParams } = webApp;

      html.style.setProperty("--tg-color-scheme", colorScheme);
      html.style.setProperty(
        "--tg-bg-color",
        themeParams.bg_color || colorScheme === "dark" ? "#0f0f0f" : "#ffffff",
      );
      html.style.setProperty(
        "--tg-text-color",
        themeParams.text_color || colorScheme === "dark" ? "#ffffff" : "#000000",
      );
      html.style.setProperty(
        "--tg-hint-color",
        themeParams.hint_color || "#71717a",
      );
      html.style.setProperty(
        "--tg-link-color",
        themeParams.link_color || "#2563eb",
      );
      html.style.setProperty(
        "--tg-button-color",
        themeParams.button_color || "#09090b",
      );
      html.style.setProperty(
        "--tg-button-text-color",
        themeParams.button_text_color || "#ffffff",
      );
      html.style.setProperty(
        "--tg-secondary-bg-color",
        themeParams.secondary_bg_color || colorScheme === "dark" ? "#181818" : "#f4f4f5",
      );
      html.style.setProperty(
        "--tg-header-bg-color",
        themeParams.header_bg_color || colorScheme === "dark" ? "#0f0f0f" : "#ffffff",
      );
      html.style.setProperty(
        "--tg-section-bg-color",
        themeParams.section_bg_color || colorScheme === "dark" ? "#181818" : "#ffffff",
      );
      html.style.setProperty(
        "--tg-border-color",
        themeParams.secondary_bg_color || colorScheme === "dark" ? "#27272a" : "#e4e4e7",
      );
      html.style.setProperty(
        "--tg-destructive-text-color",
        themeParams.destructive_text_color || "#ef4444",
      );

      if (colorScheme === "dark") {
        html.classList.add("dark");
      } else {
        html.classList.remove("dark");
      }
    };

    applyTheme();
    webApp.onEvent("themeChanged", applyTheme);

    return () => {
      webApp.offEvent("themeChanged", applyTheme);
    };
  }, []);

  return null;
}