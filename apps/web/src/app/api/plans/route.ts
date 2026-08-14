import { NextResponse } from "next/server";

const API_ORIGIN = process.env.API_INTERNAL_URL ?? "http://api:4000";

export async function GET() {
  try {
    const response = await fetch(`${API_ORIGIN}/api/plans`, { cache: "no-store" });
    const body = await response.json();
    return NextResponse.json(body, {
      status: response.status,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ error: "Plans service unavailable" }, { status: 503 });
  }
}
