"use client";

import { useState } from "react";
import { purchaseDemoVPS, type DemoVPSPurchaseResponse } from "@/lib/api/client";

export default function ServicesPage() {
  const [result, setResult] = useState<DemoVPSPurchaseResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const buy = async () => {
    setLoading(true); setError(false);
    try { setResult(await purchaseDemoVPS("demo-europe")); } catch { setError(true); } finally { setLoading(false); }
  };
  return <main className="space-y-5 p-4 pb-28">
    <header><p className="text-xs text-[#7f8c99]">VPN Config Hub</p><h1 className="mt-1 text-2xl font-bold text-[#f5f5f5]">Services</h1></header>
    <section className="rounded-2xl border border-[#2b394a] bg-[#17212b] p-4">
      <div className="flex items-center justify-between"><div><h2 className="font-bold text-[#f5f5f5]">Demo wallet</h2><p className="text-xs text-[#7f8c99]">Fake balance for testing only</p></div><strong className="text-[#2aabee]">1,000 DEMO</strong></div>
    </section>
    <section className="rounded-2xl border border-[#2b394a] bg-[#242f3d] p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#7f8c99]">Demo product</p><h2 className="mt-1 text-lg font-bold text-[#f5f5f5]">VPS Starter</h2><p className="mt-1 text-sm text-[#7f8c99]">Demo Europe region · 50 DEMO</p>
      <p className="mt-3 rounded-xl border border-[#eac035]/30 bg-[#eac035]/10 p-3 text-xs text-[#eac035]">Fake money and fake VPS. No real charge or server provisioning.</p>
      <button type="button" onClick={buy} disabled={loading || Boolean(result)} className="mt-4 min-h-12 w-full rounded-xl bg-[#2aabee] px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{loading ? "Provisioning demo VPS..." : result ? "Demo VPS purchased" : "Buy VPS with demo money"}</button>
      {error ? <p className="mt-3 text-center text-xs text-[#eac035]">Demo purchase failed. Try again.</p> : null}
    </section>
    {result ? <section className="rounded-2xl border border-[#2aabee]/40 bg-[#17212b] p-4 text-xs text-[#7f8c99]"><h2 className="font-bold text-[#2aabee]">Demo VPS ready</h2><p className="mt-2 break-all">Address: {result.vps.address}</p><p>Username: {result.vps.username}</p><p>Password: {result.vps.password}</p><p className="mt-2 text-[#eac035]">{result.vps.note}</p></section> : null}
  </main>;
}
