import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateTelegramInitData } from '@twa-dev/sdk';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN is not defined in environment variables');
}

export async function middleware(req: NextRequest) {
  // Only validate API routes
  if (req.nextUrl.pathname.startsWith('/api')) {
    const initData = req.headers.get('x-telegram-init-data');

    if (!initData) {
      return NextResponse.json(
        { error: 'Missing Telegram initData' },
        { status: 401 }
      );
    }

    try {
      // Validate the initData using the bot token
      const validated = validateTelegramInitData(BOT_TOKEN, initData);
      
      // If validation fails, validated will be null
      if (!validated) {
        return NextResponse.json(
          { error: 'Invalid Telegram initData' },
          { status: 401 }
        );
      }

      // Optionally, you can attach the validated user to the request for use in API routes
      // req.headers.set('x-telegram-user', JSON.stringify(validated.user));
    } catch (error) {
      console.error('Telegram initData validation error:', error);
      return NextResponse.json(
        { error: 'Failed to validate Telegram initData' },
        { status: 401 }
      );
    }
  }

  // Continue with the request
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/api/:path*',
};
