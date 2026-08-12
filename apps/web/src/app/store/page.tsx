export default function StorePage() {
  return (
    <main className="px-5 pt-8">
      <p className="text-sm text-zinc-500">VPN Config Hub</p>

      <h1 className="mt-1 text-2xl font-bold">Store</h1>

      <p className="mt-2 text-sm text-zinc-500">
        Choose the service that fits your needs.
      </p>

      <div className="mt-8 space-y-3">
        {["Basic", "Standard", "Pro"].map((plan) => (
          <div
            key={plan}
            className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{plan}</h2>

              <span className="text-sm text-zinc-500">30 days</span>
            </div>

            <p className="mt-2 text-sm text-zinc-500">
              VPN access with secure configuration.
            </p>

            <button className="mt-5 w-full rounded-xl bg-zinc-950 px-4 py-3 text-sm font-semibold text-white dark:bg-white dark:text-zinc-950">
              Choose plan
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
