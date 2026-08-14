import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const response = await fetch(`${process.env.API_INTERNAL_URL ?? "http://api:4000"}/api/demo/vps-purchase`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: await request.text(), cache: "no-store",
    });
    return NextResponse.json(await response.json(), { status: response.status, headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ error: "Demo VPS service unavailable" }, { status: 503 }); }
}
