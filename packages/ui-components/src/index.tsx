// React + Tailwind. Later: swap for shadcn/ui or radix primitives.
export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={`rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 ${props.className ?? ""}`} />;
}

export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${props.className ?? ""}`} />;
}
