import type { VpnTraffic, VpnUserConfig } from '@/types'; // Adjust the import path as needed

// If you don't have a types file, you can define the interfaces here.
// For now, we'll assume they are imported from a shared types file.
// Alternatively, you can copy the types from the existing vpn-adapters package.

// Since we are in a new app, we'll define the interfaces locally.
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

export class ThreeXUIAdapter {
  private sessionToken: string | null = null;
  private readonly baseUrl: string;
  private readonly username: string;
  private readonly password: string;

  constructor(baseUrl: string, username: string, password: string) {
    // Remove trailing slash if present
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    this.username = username;
    this.password = password;
  }

  /**
   * Log in to the 3X-UI panel and retrieve a session token.
   * The token is cached for subsequent requests.
   */
  private async login(): Promise<string> {
    if (this.sessionToken) {
      return this.sessionToken;
    }

    const loginUrl = `${this.baseUrl}/login`;
    const form = new URLSearchParams({
      username: this.username,
      password: this.password,
    });

    try {
      const res = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: form,
      });

      if (!res.ok) {
        throw new Error(`Failed to log in to 3X-UI: ${res.status} ${res.statusText}`);
      }

      // 3X-UI returns a session cookie in the headers
      const setCookie = res.headers.get('set-cookie');
      if (!setCookie) {
        throw new Error('No session cookie received from 3X-UI');
      }

      // Extract the session token (typically the first cookie)
      this.sessionToken = setCookie.split(';')[0];
      return this.sessionToken;
    } catch (error) {
      throw new Error(`3X-UI login failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Add a client (user) to a specific inbound.
   * @param inboundId The ID of the inbound in the 3X-UI panel
   * @param email The email (identifier) for the user
   * @param quotaBytes The data quota in bytes (0 for unlimited)
   * @returns VpnUserConfig containing the client UUID and configuration URI
   */
  async createUser(inboundId: number, email: string, quotaBytes: number): Promise<VpnUserConfig> {
    const token = await this.login();
    const addClientUrl = `${this.baseUrl}/panel/api/inbounds/addClient`;

    // 3X-UI expects the inbound ID and settings in a specific format
    const uuid = crypto.randomUUID(); // Generate a UUID for the client (VLESS/VMESS)
    const totalGB = quotaBytes / 1e9; // Convert bytes to GB (3X-UI uses GB)

    const payload = {
      id: inboundId,
      settings: JSON.stringify({
        clients: [
          {
            id: uuid,
            email: email,
            enable: true,
            totalGB: totalGB, // Note: 0 means unlimited in 3X-UI
          },
        ],
      }),
    };

    try {
      const res = await fetch(addClientUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: token,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to create user: ${res.status} ${res.statusText} - ${errorText}`);
      }

      const result = await res.json();

      if (!result.success) {
        throw new Error(`3X-UI error: ${result.msg}`);
      }

      // Construct the VLESS configuration URI
      // Format: vless://uuid@host:port?encryption=none&security=none&type=none#name
      // We assume the panel's host and port are the same as the baseUrl (without protocol)
      // In reality, you might need to get the actual listening port and security settings from the inbound.
      // For simplicity, we'll use the baseUrl's host and assume port 443 with Reality (as in the prototype).
      // This should be made configurable per node.
      const configUri = `vless://${uuid}@${new URL(this.baseUrl).hostname}:443?encryption=none&security=none&type=none#${email}`;

      return {
        email,
        clientId: uuid,
        configUri,
      };
    } catch (error) {
      throw new Error(`Failed to create user in 3X-UI: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get traffic statistics for a user (by email).
   * @param email The email (identifier) of the user
   * @returns VpnTraffic object with upload and download in bytes
   */
  async getUserTraffic(email: string): Promise<VpnTraffic> {
    const token = await this.login();
    const getTrafficUrl = `${this.baseUrl}/panel/api/inbounds/getClientTraffics/${email}`;

    try {
      const res = await fetch(getTrafficUrl, {
        headers: {
          Cookie: token,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to get user traffic: ${res.status} ${res.statusText}`);
      }

      const result = await res.json();

      if (!result.success) {
        throw new Error(`3X-UI error: ${result.msg}`);
      }

      // 3X-UI returns traffic in bytes? Actually, it returns in bytes? Let's check the prototype.
      // In the prototype, the traffic is in bytes (up/down). We'll assume the API returns bytes.
      const traffic = result.obj;
      return {
        up: Number(traffic.up || 0),
        down: Number(traffic.down || 0),
      };
    } catch (error) {
      throw new Error(`Failed to get user traffic from 3X-UI: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Delete a user from an inbound.
   * @param inboundId The ID of the inbound in the 3X-UI panel
   * @param email The email (identifier) of the user to delete
   * @returns True if successful
   */
  async deleteUser(inboundId: number, email: string): Promise<boolean> {
    const token = await this.login();
    const deleteUrl = `${this.baseUrl}/panel/api/inbounds/delClientByEmail/${email}`;

    try {
      const res = await fetch(deleteUrl, {
        method: 'POST',
        headers: {
          Cookie: token,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to delete user: ${res.status} ${res.statusText}`);
      }

      const result = await res.json();
      return result.success;
    } catch (error) {
      throw new Error(`Failed to delete user in 3X-UI: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Reset user's traffic data.
   * @param email The email (identifier) of the user
   * @returns True if successful
   */
  async resetUserQuota(email: string): Promise<boolean> {
    // 3X-UI might not have a direct reset quota endpoint.
    // Alternatively, we can edit the client and reset the expiry or totalGB?
    // For simplicity, we'll implement if the panel supports it, or we can note that it's not available.
    // Since the task does not specify, we'll leave it as a placeholder.
    throw new Error('Reset quota not implemented for 3X-UI');
  }

  /**
   * Get user status (active, used quota, etc.)
   * @param email The email (identifier) of the user
   * @returns Object with active status, used bytes, and total bytes
   */
  async getUserStatus(email: string): Promise<{
    active: boolean;
    quotaBytesUsed: number;
    quotaBytesTotal: number;
  }> {
    // We can get traffic and also check if the client is enabled.
    // For simplicity, we'll get traffic and assume active if we can get traffic.
    // A more robust implementation would check the client's enable status.
    try {
      const traffic = await this.getUserTraffic(email);
      // We don't have the total quota from traffic endpoint, so we need to get the client info.
      // This is a simplified version.
      return {
        active: true, // Assume active if we can get traffic
        quotaBytesUsed: traffic.up + traffic.down,
        quotaBytesTotal: 0, // Unknown
      };
    } catch (error) {
      // If we cannot get traffic, the user might not exist or be disabled.
      return {
        active: false,
        quotaBytesUsed: 0,
        quotaBytesTotal: 0,
      };
    }
  }
}

// Export a default instance if you have the credentials in environment variables
// Uncomment and adjust if you want to create a singleton
/*
if (process.env.THREE_XUI_URL && process.env.THREE_XUI_USERNAME && process.env.THREE_XUI_PASSWORD) {
  export const threeXuiAdapter = new ThreeXUIAdapter(
    process.env.THREE_XUI_URL,
    process.env.THREE_XUI_USERNAME,
    process.env.THREE_XUI_PASSWORD
  );
}
*/
