import type { IVpnAdapter, VpnTraffic, VpnUserConfig } from "./types.js";
import { VpnAdapterError } from "./types.js";

export interface HiddifyCredentials {
  baseUrl: string;
  apiKey: string;
}

export class HiddifyAdapter implements IVpnAdapter {
  constructor(private readonly creds: HiddifyCredentials) {}

  private async authed(path: string, init: RequestInit = {}): Promise<Response> {
    return fetch(`${this.creds.baseUrl}${path}`, {
      ...init,
      headers: { "Hiddify-API-Key": this.creds.apiKey, "Content-Type": "application/json", ...(init.headers ?? {}) },
    });
  }

  async createUser(_inboundId: number, email: string, quotaBytes: number): Promise<VpnUserConfig> {
    const res = await this.authed("/api/v2/user/", {
      method: "POST",
      body: JSON.stringify({ name: email, usage_limit_GB: quotaBytes / 1e9, package_days: 30 }),
    });
    if (!res.ok) throw new VpnAdapterError("hiddify", `createUser ${res.status}`);
    return { email, clientId: email, configUri: `${this.creds.baseUrl}/api/v2/user/link/${email}` };
  }

  async deleteUser(_inboundId: number, email: string): Promise<boolean> {
    const res = await this.authed(`/api/v2/user/${email}`, { method: "DELETE" });
    return res.ok;
  }

  async getUserTraffic(email: string): Promise<VpnTraffic> {
    const res = await this.authed(`/api/v2/user/${email}/usage`);
    if (!res.ok) throw new VpnAdapterError("hiddify", `getUserTraffic ${res.status}`);
    const data = (await res.json()) as { up: number; down: number };
    return { up: data.up, down: data.down };
  }

  async resetUserQuota(email: string): Promise<boolean> {
    const res = await this.authed(`/api/v2/user/${email}/reset`, { method: "POST" });
    return res.ok;
  }

  async getUserStatus(email: string): Promise<{ active: boolean; quotaBytesUsed: number; quotaBytesTotal: number }> {
    const traffic = await this.getUserTraffic(email);
    return { active: true, quotaBytesUsed: traffic.up + traffic.down, quotaBytesTotal: 0 };
  }
}
