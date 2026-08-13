import Link from "next/link";

export default function Home() {
  return (
    <main className="px-5 pt-8">
      <header>
        <p className="text-sm" style={{ color: "var(--tg-hint-color)" }}>
          Welcome back
        </p>

        <h1
          className="mt-1 text-2xl font-bold tracking-tight"
          style={{ color: "var(--tg-text-color)" }}
        >
          VPN Config Hub
        </h1>
      </header>

      <section
        className="mt-8 rounded-3xl border p-6 text-white shadow-sm"
        style={{
          borderColor: "var(--tg-section-bg-color)",
          backgroundColor: "var(--tg-button-color)",
          color: "var(--tg-button-text-color)",
        }}
      >
        <p style={{ color: "var(--tg-hint-color)" }}>Current subscription</p>

        <h2 className="mt-2 text-xl font-semibold">No active subscription</h2>

        <p style={{ color: "var(--tg-hint-color)", opacity: 0.6 }}>
          Get secure and reliable access with one of our plans.
        </p>

        <Link
          href="/store"
          className="mt-6 inline-flex rounded-xl px-5 py-3 text-sm font-semibold"
          style={{
            backgroundColor: "var(--tg-button-text-color)",
            color: "var(--tg-button-color)",
          }}
        >
          Browse plans
        </Link>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold" style={{ color: "var(--tg-text-color)" }}>
          Quick actions
        </h2>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Link
            href="/store"
            className="rounded-2xl border p-5 cursor-pointer"
            style={{
              borderColor: "var(--tg-section-bg-color)",
              backgroundColor: "var(--tg-secondary-bg-color)",
              color: "var(--tg-text-color)",
            }}
          >
            <div style={{ color: "var(--tg-link-color)" }}>▣</div>
            <div className="mt-4 font-semibold">Store</div>
            <div className="mt-1 text-sm" style={{ color: "var(--tg-hint-color)" }}>
              Browse plans
            </div>
          </Link>

          <Link
            href="/services"
            className="rounded-2xl border p-5 cursor-pointer"
            style={{
              borderColor: "var(--tg-section-bg-color)",
              backgroundColor: "var(--tg-secondary-bg-color)",
              color: "var(--tg-text-color)",
            }}
          >
            <div style={{ color: "var(--tg-link-color)" }}>◇</div>
            <div className="mt-4 font-semibold">Services</div>
            <div className="mt-1 text-sm" style={{ color: "var(--tg-hint-color)" }}>
              Your connections
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}