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
export interface DemoPurchaseResponse { demo: true; payment: { demo: true; status: "paid"; provider: "demo"; paymentId: string }; proxy: { demo: true; status: "active"; protocol: string; address: string; port: number; username: string; password: string; note: string } }
export interface DemoVPSPurchaseResponse { demo: true; payment: { paymentId: string; amount: number; currency: "DEMO" }; wallet: { balance: number; currency: "DEMO" }; vps: { address: string; username: string; password: string; region: string; note: string } }

export async function purchaseDemoVPS(region: string): Promise<DemoVPSPurchaseResponse> {
  const response = await fetch("/api/demo/vps-purchase", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ region }) });
  if (!response.ok) {
    if (response.status === 403) return createLocalDemoVPS(region);
    throw new Error(`Demo VPS purchase failed: ${response.status}`);
  }
  return response.json();
}

function createLocalDemoVPS(region: string): DemoVPSPurchaseResponse {
  const token = crypto.randomUUID().replaceAll("-", "").slice(0, 20);
  return {
    demo: true,
    payment: { paymentId: `demo_vps_local_${token}`, amount: 50, currency: "DEMO" },
    wallet: { balance: 950, currency: "DEMO" },
    vps: {
      address: `demo-vps-${token}.vpnconfighub.local`, username: "demo", password: token, region,
      note: "Cloudflare blocked the demo backend request. Local demo fallback only; no real server was provisioned.",
    },
  };
}

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
  const response = await fetch("/api/plans", { cache: "no-store" });
  if (!response.ok) throw new Error(`Plans request failed: ${response.status}`);
  const body: unknown = await response.json();
  if (!body || typeof body !== "object" || !Array.isArray((body as PlansResponse).plans)) throw new Error("Invalid plans response");
  return body as PlansResponse;
}

export async function purchaseDemoProxy(selection: { family: string; protocol: string; quota: string | number; speed: string | number; durationDays: number; devices: number }): Promise<DemoPurchaseResponse> {
  const response = await fetch("/api/demo/purchase", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productFamily: selection.family, ...selection }) });
  if (!response.ok) throw new Error(`Demo purchase failed: ${response.status}`);
  const body: unknown = await response.json();
  if (!body || typeof body !== "object" || (body as DemoPurchaseResponse).demo !== true) throw new Error("Invalid demo purchase response");
  return body as DemoPurchaseResponse;
}
