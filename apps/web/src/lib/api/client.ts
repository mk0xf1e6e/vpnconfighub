const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

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
