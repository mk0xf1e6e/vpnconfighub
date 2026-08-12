export interface VpnTraffic {
  up: number;
  down: number;
}

export interface VpnUserConfig {
  email: string;
  clientId: string;
  configUri: string;
  expiryTimestamp?: number;
}

export interface IVpnAdapter {
  createUser(inboundId: number, email: string, quotaBytes: number): Promise<VpnUserConfig>;
  deleteUser(inboundId: number, email: string): Promise<boolean>;
  getUserTraffic(email: string): Promise<VpnTraffic>;
  resetUserQuota(email: string): Promise<boolean>;
  getUserStatus(email: string): Promise<{ active: boolean; quotaBytesUsed: number; quotaBytesTotal: number }>;
}

export class VpnAdapterError extends Error {
  constructor(public readonly panel: string, message: string, public readonly cause?: unknown) {
    super(`[${panel}] ${message}`);
    this.name = "VpnAdapterError";
  }
}
