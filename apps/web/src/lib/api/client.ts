const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export interface TelegramAccount {
  id: number;
  telegramId: number;
  firstName: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
}

export interface TelegramAuthResponse {
  user?: TelegramAccount;
  account?: TelegramAccount;
  session?: string;
  token?: string;
}

export async function authenticateTelegram(initData: string): Promise<TelegramAuthResponse> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}/api/auth/telegram`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      credentials: "include",
      body: JSON.stringify({ initData }),
    });
  } catch {
    throw new Error(`Cannot reach authentication API at ${API_URL}`);
  }

  if (!response.ok) {
    const detail = (await response.text()).trim();
    throw new Error(detail || `Telegram auth failed: ${response.status}`);
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
