const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export interface TelegramAccount {
  id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  stars?: number;
  plan_name?: string;
  planName?: string;
}

export interface TelegramAuthResponse {
  user?: TelegramAccount;
  account?: TelegramAccount;
  session?: string;
  token?: string;
}

export async function authenticateTelegram(initData: string): Promise<TelegramAuthResponse> {
  const response = await fetch(`${API_URL}/api/auth/telegram`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({ initData }),
  });

  if (!response.ok) {
    throw new Error(`Telegram auth failed: ${response.status}`);
  }

  return response.json();
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
