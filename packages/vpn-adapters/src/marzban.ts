import type { IVpnAdapter, VpnTraffic, VpnUserConfig } from "./types.js";
import { VpnAdapterError } from "./types.js";

export interface MarzbanCredentials {
  baseUrl: string;
  username: string;
  password: string;
}

export class MarzbanAdapter implements IVpnAdapter {
  private token: string | null = null;

  constructor(private readonly creds: MarzbanCredentials) {}

  private async getToken(): Promise<string> {
    if (this.token) return this.token;
    const res = await fetch(`${this.creds.baseUrl}/api/admin/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username: this.creds.username, password: this.creds.password }),
    });
    if (!res.ok) throw new VpnAdapterError("marzban", `token ${res.status}`);
    const data = (await res.json()) as { access_token: string };
    this.token = data.access_token;
    return this.token;
  }

  private async authed(path: string, init: RequestInit = {}): Promise<Response> {
    const token = await this.getToken();
    return fetch(`${this.creds.baseUrl}${path}`, {
      ...init,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...(init.headers ?? {}) },
    });
  }

  async createUser(inboundId: number, email: string, quotaBytes: number): Promise<VpnUserConfig> {
    const res = await this.authed("/api/user", {
      method: "POST",
      body: JSON.stringify({ username: email, data_limit: quotaBytes, status: "active" }),
    });
    if (!res.ok) throw new VpnAdapterError("marzban", `createUser ${res.status}`);
    const data = (await res.json()) as { subscription_url: string };
    return { email, clientId: email, configUri: data.subscription_url };
  }

  async deleteUser(_inboundId: number, email: string): Promise<boolean> {
    const res = await this.authed(`/api/user/${email}`, { method: "DELETE" });
    return res.ok;
  }

  async getUserTraffic(email: string): Promise<VpnTraffic> {
    const res = await this.authed(`/api/user/${email}`);
    if (!res.ok) throw new VpnAdapterError("marzban", `getUserTraffic ${res.status}`);
    const data = (await res.json()) as { used_traffic: number };
    return { up: 0, down: data.used_traffic };
  }

  async resetUserQuota(email: string): Promise<boolean> {
    const res = await this.authed(`/api/user/${email}/reset`, { method: "POST" });
    return res.ok;
  }

  async getUserStatus(email: string): Promise<{ active: boolean; quotaBytesUsed: number; quotaBytesTotal: number }> {
    const res = await this.authed(`/api/user/${email}`);
    const data = (await res.json()) as { status: string; used_traffic: number; data_limit: number };
    return { active: data.status === "active", quotaBytesUsed: data.used_traffic, quotaBytesTotal: data.data_limit };
  }
}
