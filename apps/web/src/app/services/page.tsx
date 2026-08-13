export default function ServicesPage() {
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
        Services
      </h1>

      <div
        className="mt-8 rounded-2xl border border-dashed p-8 text-center"
        style={{
          borderColor:
            "var(--tg-theme-section-separator-color, var(--tg-theme-hint-color, #71717a))",
          backgroundColor:
            "var(--tg-theme-section-bg-color, #ffffff)",
          color: "var(--tg-theme-hint-color, #71717a)",
        }}
      >
        <div style={{ color: "var(--tg-theme-link-color, #2563eb)" }}>◇</div>

        <h2 className="mt-4 font-semibold">No active services</h2>

        <p className="mt-2 text-sm">
          Your purchased VPN services will appear here.
        </p>
      </div>
    </main>
  );
}