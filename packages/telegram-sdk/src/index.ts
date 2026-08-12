import { createHmac, timingSafeEqual } from "node:crypto";

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_bot?: boolean;
  allows_write_to_pm?: boolean;
  photo_url?: string;
}

export interface ParsedInitData {
  user: TelegramUser;
  auth_date: number;
  query_id?: string;
  start_param?: string;
  chat_type?: string;
  chat_instance?: string;
  raw: Record<string, string>;
}

export function parseInitData(initData: string): ParsedInitData {
  const params = new URLSearchParams(initData);
  const raw: Record<string, string> = {};
  for (const [k, v] of params) raw[k] = v;
  const user = JSON.parse(raw.user ?? "{}") as TelegramUser;
  return {
    user,
    auth_date: Number(raw.auth_date),
    query_id: raw.query_id,
    start_param: raw.start_param,
    chat_type: raw.chat_type,
    chat_instance: raw.chat_instance,
    raw,
  };
}

export function verifyTelegramInitData(initData: string, botToken: string, maxAgeSeconds = 86400): boolean {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return false;
  params.delete("hash");

  const dataCheckString = [...params.entries()]
    .map(([k, v]) => `${k}=${v}`)
    .sort()
    .join("\n");

  const secretKey = createHmac("sha256", "WebAppData").update(botToken).digest();
  const computed = createHmac("sha256", secretKey).update(dataCheckString).digest();

  const a = Buffer.from(computed);
  const b = Buffer.from(hash, "hex");
  if (a.length !== b.length) return false;
  if (!timingSafeEqual(a, b)) return false;

  const authDate = Number(params.get("auth_date") ?? 0);
  if (!authDate) return false;
  return Date.now() / 1000 - authDate <= maxAgeSeconds;
}

export interface StarsInvoicePayload {
  title: string;
  description: string;
  payload: string;
  provider_token: string;
  currency: string;
  prices: Array<{ label: string; amount: number }>;
}

export function buildStarsInvoiceLink(p: StarsInvoicePayload): string {
  return `https://t.me/${
    process.env.TELEGRAM_BOT_USERNAME ?? "bot"
  }?startattach=${encodeURIComponent(p.payload)}`;
}
