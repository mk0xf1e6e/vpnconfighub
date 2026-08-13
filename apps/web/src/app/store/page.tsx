export default function StorePage() {
  return (
    <main className="px-5 pt-8">
      <p
        className="text-sm"
        style={{ color: "var(--tg-theme-hint-color, #71717a)" }}
      >
        VPN Config Hub
      </p>

      <h1
        className="mt-1 text-2xl font-bold"
        style={{ color: "var(--tg-theme-text-color, #000000)" }}
      >
        Store
      </h1>

      <p style={{ color: "var(--tg-theme-hint-color, #71717a)" }}>
        Choose the service that fits your needs.
      </p>

      <div className="mt-8 space-y-3">
        {["Basic", "Standard", "Pro"].map((plan) => (
          <div
            key={plan}
            className="rounded-2xl border p-5"
            style={{
              borderColor:
                "var(--tg-theme-section-separator-color, var(--tg-theme-secondary-bg-color, #f4f4f5))",
              backgroundColor:
                "var(--tg-theme-section-bg-color, #ffffff)",
              color: "var(--tg-theme-text-color, #000000)",
            }}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{plan}</h2>

              <span style={{ color: "var(--tg-theme-hint-color, #71717a)" }}>
                30 days
              </span>
            </div>

            <p style={{ color: "var(--tg-theme-hint-color, #71717a)" }}>
              VPN access with secure configuration.
            </p>

            <button
              className="mt-5 w-full rounded-xl px-4 py-3 text-sm font-semibold cursor-pointer"
              style={{
                backgroundColor: "var(--tg-theme-button-color, #18181b)",
                color: "var(--tg-theme-button-text-color, #ffffff)",
              }}
            >
              Choose plan
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}