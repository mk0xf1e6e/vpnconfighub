import React from "react";
import { useQuery } from "@tanstack/react-query";

declare global {
  interface Window { Telegram?: { WebApp: { initData: string; ready: () => void; openInvoice: (url: string) => void } } }
}

export function App() {
  React.useEffect(() => { window.Telegram?.WebApp.ready(); }, []);
  const subs = useQuery({ queryKey: ["subs"], queryFn: async () => {
    const res = await fetch("/api/subscriptions", { headers: { "x-telegram-init-data": window.Telegram?.WebApp.initData ?? "" } });
    return res.json();
  } });

  return <main className="p-4"><h1 className="text-2xl font-bold">VPN Config Hub</h1><pre>{JSON.stringify(subs.data, null, 2)}</pre></main>;
}
