import type { IVpnAdapter, VpnTraffic, VpnUserConfig } from "./types.js";
import { VpnAdapterError } from "./types.js";

export interface ThreeXUICredentials {
  baseUrl: string;
  username: string;
  password: string;
}

export class ThreeXUIAdapter implements IVpnAdapter {
  private sessionCookie: string | null = null;

  constructor(private readonly creds: ThreeXUICredentials) {}

  private async login(): Promise<string> {
    if (this.sessionCookie) return this.sessionCookie;
    const form = new URLSearchParams({ username: this.creds.username, password: this.creds.password });
    const res = await fetch(`${this.creds.baseUrl}/login`, { method: "POST", body: form });
    if (!res.ok) throw new VpnAdapterError("3x-ui", `login failed: ${res.status}`);
    const setCookie = res.headers.get("set-cookie");
    if (!setCookie) throw new VpnAdapterError("3x-ui", "no session cookie");
    this.sessionCookie = setCookie.split(";")[0]!;
    return this.sessionCookie;
  }

  async createUser(inboundId: number, email: string, quotaBytes: number): Promise<VpnUserConfig> {
    const cookie = await this.login();
    const uuid = crypto.randomUUID();
    const res = await fetch(`${this.creds.baseUrl}/panel/api/inbounds/addClient`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify({ id: inboundId, settings: JSON.stringify({ clients: [{ id: uuid, email, enable: true, totalGB: quotaBytes / 1e9 }] }) }),
    });
    if (!res.ok) throw new VpnAdapterError("3x-ui", `createUser ${res.status}`);
    return { email, clientId: uuid, configUri: `vless://${uuid}@${this.creds.baseUrl}` };
  }

  async deleteUser(inboundId: number, email: string): Promise<boolean> {
    const cookie = await this.login();
    const res = await fetch(`${this.creds.baseUrl}/panel/api/inbounds/delClientByEmail/${email}`, {
      method: "POST",
      headers: { Cookie: cookie },
    });
    return res.ok;
  }

  async getUserTraffic(email: string): Promise<VpnTraffic> {
    const cookie = await this.login();
    const res = await fetch(`${this.creds.baseUrl}/panel/api/inbounds/getClientTraffics/${email}`, { headers: { Cookie: cookie } });
    if (!res.ok) throw new VpnAdapterError("3x-ui", `getUserTraffic ${res.status}`);
    const data = (await res.json()) as { obj: { up: number; down: number } };
    return { up: data.obj.up, down: data.obj.down };
  }

  async resetUserQuota(email: string): Promise<boolean> {
    const cookie = await this.login();
    const res = await fetch(`${this.creds.baseUrl}/panel/api/inbounds/resetClientTraffic/${email}`, {
      method: "POST",
      headers: { Cookie: cookie },
    });
    return res.ok;
  }

  async getUserStatus(email: string): Promise<{ active: boolean; quotaBytesUsed: number; quotaBytesTotal: number }> {
    const traffic = await this.getUserTraffic(email);
    return { active: true, quotaBytesUsed: traffic.up + traffic.down, quotaBytesTotal: 0 };
  }
}
