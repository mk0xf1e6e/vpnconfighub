import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().uuid(),
  telegramId: z.string(),
  username: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  languageCode: z.string().nullable(),
  isAdmin: z.boolean().default(false),
  referredById: z.string().uuid().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type User = z.infer<typeof UserSchema>;

export const PlanSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  durationDays: z.number().int().positive(),
  trafficQuotaBytes: z.number().int().nonnegative(),
  priceStars: z.number().int().nonnegative(),
  priceTon: z.string().nullable(),
  priceUsd: z.number().nullable(),
  isActive: z.boolean().default(true),
});
export type Plan = z.infer<typeof PlanSchema>;

export const VpnConfigSchema = z.object({
  protocol: z.enum(["vless", "trojan", "vmess", "shadowsocks"]),
  host: z.string(),
  port: z.number().int().positive(),
  uuid: z.string().optional(),
  password: z.string().optional(),
  path: z.string().optional(),
  sni: z.string().optional(),
  fingerprint: z.string().optional(),
  publicKey: z.string().optional(),
  shortId: z.string().optional(),
  flow: z.string().optional(),
});
export type VpnConfig = z.infer<typeof VpnConfigSchema>;
