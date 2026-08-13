export default function StorePage() {
  return (
    <main className="px-5 pt-8">
      <p className="text-sm" style={{ color: "var(--tg-hint-color)" }}>
        VPN Config Hub
      </p>

      <h1 className="mt-1 text-2xl font-bold" style={{ color: "var(--tg-text-color)" }}>
        Store
      </h1>

      <p style={{ color: "var(--tg-hint-color)" }}>
        Choose the service that fits your needs.
      </p>

      <div className="mt-8 space-y-3">
        {["Basic", "Standard", "Pro"].map((plan) => (
          <div
            key={plan}
            className="rounded-2xl border p-5"
            style={{
              borderColor: "var(--tg-section-bg-color)",
              backgroundColor: "var(--tg-secondary-bg-color)",
              color: "var(--tg-text-color)",
            }}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{plan}</h2>

              <span style={{ color: "var(--tg-hint-color)" }}>30 days</span>
            </div>

            <p style={{ color: "var(--tg-hint-color)" }}>
              VPN access with secure configuration.
            </p>

            <button
              className="mt-5 w-full rounded-xl px-4 py-3 text-sm font-semibold cursor-pointer"
              style={{
                backgroundColor: "var(--tg-destructive-text-color)",
                color: "var(--tg-button-color)",
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