const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://vch-api.milad-karami.ir";

export interface DemoDailyUsage { date: string; bytes: number }
export interface DemoUsage { demo: true; totalBytes: number; daily: DemoDailyUsage[] }
export interface DemoDashboard {
  demo: true;
  subscription: { name: string; status: string; quotaBytes: number; usedBytes: number; durationDays: number; daysRemaining: number; speedMbps: number; devices: number };
  usage: DemoUsage;
  configuration: null;
  nodes: unknown[];
}
export interface DemoCatalogItem { id: string; name: string; description: string; availability: "planned" | "available"; protocols: string[]; draftPricing: boolean; prices: Record<string, number | null> }
export interface DemoCatalog { demo: true; items: DemoCatalogItem[] }
export interface PlanEntitlements {
  trafficBytes: number | null;
  trafficUnlimited: boolean;
  speedMbps: number | null;
  speedUncapped: boolean;
  activeUsers: number | null;
  maxDevices: number | null;
  maxConnections: number | null;
  connectionsUnlimited: boolean;
  durationDays: number;
  limits: Record<string, unknown>;
}
export interface Plan {
  id: string;
  productFamily: string;
  name: string;
  description: string;
  protocols: string[];
  availability: { status: "draft" | "available" | "sold_out" | "disabled" | "coming_soon"; purchasable: boolean; reason?: string };
  pricing: { currency: string; amount: number | null; draft: boolean };
  entitlements: PlanEntitlements;
}
export interface PlansResponse { plans: Plan[] }

export async function getHealth(): Promise<{ status: string }> {
  const response = await fetch(`${API_URL}/health`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

async function getDemo<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  const body: unknown = await response.json();
  if (!body || typeof body !== "object" || !("demo" in body) || body.demo !== true) throw new Error("Invalid demo API response");
  return body as T;
}

export const getDemoDashboard = () => getDemo<DemoDashboard>("/api/demo/dashboard");
export const getDemoUsage = () => getDemo<DemoUsage>("/api/demo/usage");
export const getDemoCatalog = () => getDemo<DemoCatalog>("/api/demo/catalog");

export async function getPlans(): Promise<PlansResponse> {
  const response = await fetch(`${API_URL}/api/plans`, { cache: "no-store" });
  if (!response.ok) throw new Error(`Plans request failed: ${response.status}`);
  const body: unknown = await response.json();
  if (!body || typeof body !== "object" || !Array.isArray((body as PlansResponse).plans)) throw new Error("Invalid plans response");
  return body as PlansResponse;
}
