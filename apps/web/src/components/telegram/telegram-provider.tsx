"use client";

import { useEffect } from "react";
import type { TelegramThemeParams } from "@/types/telegram";

const TELEGRAM_SCRIPT_URL = "https://telegram.org/js/telegram-web-app.js?59";

const themeVariables: Record<keyof TelegramThemeParams, string> = {
  bg_color: "--tg-bg-color",
  text_color: "--tg-text-color",
  hint_color: "--tg-hint-color",
  link_color: "--tg-link-color",
  button_color: "--tg-button-color",
  button_text_color: "--tg-button-text-color",
  secondary_bg_color: "--tg-secondary-bg-color",
  header_bg_color: "--tg-header-bg-color",
  accent_text_color: "--tg-accent-text-color",
  section_bg_color: "--tg-section-bg-color",
  section_header_text_color: "--tg-section-header-text-color",
  subtitle_text_color: "--tg-subtitle-text-color",
  destructive_text_color: "--tg-destructive-text-color",
};

function applyTheme(theme: TelegramThemeParams) {
  const root = document.documentElement;

  for (const [key, variable] of Object.entries(themeVariables)) {
    const value = theme[key as keyof TelegramThemeParams];

    if (value) {
      root.style.setProperty(variable, value);
    } else {
      root.style.removeProperty(variable);
    }
  }
}

function initWebApp() {
  const webApp = window.Telegram?.WebApp;

  if (!webApp) {
    return;
  }

  webApp.ready();
  webApp.expand();

  const onThemeChanged = () => applyTheme(webApp.themeParams);

  applyTheme(webApp.themeParams);
  webApp.onEvent("themeChanged", onThemeChanged);

  return () => webApp.offEvent("themeChanged", onThemeChanged);
}

export function TelegramProvider() {
  useEffect(() => {
    const existing = document.getElementById("telegram-web-app");

    if (existing) {
      return initWebApp();
    }

    const script = document.createElement("script");
    script.id = "telegram-web-app";
    script.src = TELEGRAM_SCRIPT_URL;
    script.async = true;
    script.onload = initWebApp;
    document.head.appendChild(script);
  }, []);

  return null;
}