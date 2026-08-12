import React from "react";
import { useQuery } from "@tanstack/react-query";

export function RevenuePanel() {
  const { data } = useQuery({ queryKey: ["revenue"], queryFn: async () => {
    const res = await fetch("/api/admin/revenue", { credentials: "include" });
    return res.json();
  }});
  return <section className="p-4"><h2 className="text-xl">Revenue</h2><pre>{JSON.stringify(data, null, 2)}</pre></section>;
}
