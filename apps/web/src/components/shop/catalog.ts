export type ProductFamily = "mtproto" | "socks5" | "http" | "v2ray";
export type QuotaOption = 2 | 5 | 10 | 25 | 50 | 100 | "unlimited";
export type SpeedOption = 10 | 25 | 50 | 100 | 250 | "uncapped";
export type DurationOption = 7 | 30 | 90 | 365;
export type DeviceOption = 1 | 2 | 3 | 5 | 10;

export interface ProductFamilyDefinition {
  id: ProductFamily;
  name: string;
  description: string;
  protocols: string[];
  availability: "planned" | "available";
}

export interface ProductSelection {
  family: ProductFamily;
  protocol: string;
  quota: QuotaOption;
  speed: SpeedOption;
  durationDays: DurationOption;
  devices: DeviceOption;
}

export interface UsageState {
  status: "loading" | "empty" | "available" | "error";
  totalBytes: number | null;
  daily: Array<{ date: string; bytes: number }>;
}

export const PRODUCT_FAMILIES: ProductFamilyDefinition[] = [
  {
    id: "mtproto",
    name: "MTProto Proxy",
    description: "Telegram-focused proxy access.",
    protocols: ["MTProto"],
    availability: "planned",
  },
  {
    id: "socks5",
    name: "SOCKS5 Proxy",
    description: "General-purpose proxy endpoint.",
    protocols: ["SOCKS5"],
    availability: "planned",
  },
  {
    id: "http",
    name: "HTTP / HTTPS Proxy",
    description: "HTTP proxy access for supported clients.",
    protocols: ["HTTP", "HTTPS"],
    availability: "planned",
  },
  {
    id: "v2ray",
    name: "V2Ray / Xray Config",
    description: "Choose a client protocol for a future generated config.",
    protocols: ["VLESS + Reality", "VMess", "Shadowsocks", "Trojan", "Hysteria2", "TUIC"],
    availability: "planned",
  },
];

export const QUOTA_OPTIONS: Array<{ value: QuotaOption; label: string }> = [
  { value: 2, label: "2 GB" },
  { value: 5, label: "5 GB" },
  { value: 10, label: "10 GB" },
  { value: 25, label: "25 GB" },
  { value: 50, label: "50 GB" },
  { value: 100, label: "100 GB" },
  { value: "unlimited", label: "Unlimited" },
];

export const SPEED_OPTIONS: Array<{ value: SpeedOption; label: string }> = [
  { value: 10, label: "10 Mbps" },
  { value: 25, label: "25 Mbps" },
  { value: 50, label: "50 Mbps" },
  { value: 100, label: "100 Mbps" },
  { value: 250, label: "250 Mbps" },
  { value: "uncapped", label: "Uncapped" },
];

export const DURATION_OPTIONS: Array<{ value: DurationOption; label: string }> = [
  { value: 7, label: "7 days" },
  { value: 30, label: "30 days" },
  { value: 90, label: "90 days" },
  { value: 365, label: "365 days" },
];

export const DEVICE_OPTIONS: Array<{ value: DeviceOption; label: string }> = [
  { value: 1, label: "1 device" },
  { value: 2, label: "2 devices" },
  { value: 3, label: "3 devices" },
  { value: 5, label: "5 devices" },
  { value: 10, label: "10 devices" },
];

export function getFamily(family: ProductFamily) {
  return PRODUCT_FAMILIES.find((item) => item.id === family) ?? PRODUCT_FAMILIES[0];
}

export function createDefaultSelection(): ProductSelection {
  const family = PRODUCT_FAMILIES[0];

  return {
    family: family.id,
    protocol: family.protocols[0],
    quota: 10,
    speed: 50,
    durationDays: 30,
    devices: 2,
  };
}
