export default function ServicesPage() {
  return (
    <main className="px-5 pt-8">
      <p className="text-sm" style={{ color: "var(--tg-hint-color)" }}>
        VPN Config Hub
      </p>

      <h1 className="mt-1 text-2xl font-bold" style={{ color: "var(--tg-text-color)" }}>
        Services
      </h1>

      <div
        className="mt-8 rounded-2xl border border-dashed p-8 text-center"
        style={{
          borderColor: "var(--tg-hint-color)",
          opacity: 0.6,
          backgroundColor: "var(--tg-section-bg-color)",
          color: "var(--tg-hint-color)",
        }}
      >
        <div style={{ color: "var(--tg-link-color)" }}>◇</div>

        <h2 className="mt-4 font-semibold">No active services</h2>

        <p className="mt-2 text-sm">
          Your purchased VPN services will appear here.
        </p>
      </div>
    </main>
  );
}