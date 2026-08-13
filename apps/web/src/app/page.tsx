import Link from "next/link";

export default function Home() {
  return (
    <main className="px-5 pt-8">
      <header>
        <p
          className="text-sm"
          style={{ color: "var(--tg-theme-hint-color, #71717a)" }}
        >
          Welcome back
        </p>

        <h1
          className="mt-1 text-2xl font-bold tracking-tight"
          style={{ color: "var(--tg-theme-text-color, #000000)" }}
        >
          VPN Config Hub
        </h1>
      </header>

      <section
        className="mt-8 rounded-3xl border p-6 shadow-sm"
        style={{
          borderColor: "var(--tg-theme-section-separator-color, var(--tg-theme-secondary-bg-color, #f4f4f5))",
          backgroundColor: "var(--tg-theme-button-color, #18181b)",
          color: "var(--tg-theme-button-text-color, #ffffff)",
        }}
      >
        <p style={{ color: "var(--tg-theme-hint-color, #71717a)" }}>
          Current subscription
        </p>

        <h2 className="mt-2 text-xl font-semibold">No active subscription</h2>

        <p style={{ color: "var(--tg-theme-hint-color, #71717a)", opacity: 0.8 }}>
          Get secure and reliable access with one of our plans.
        </p>

        <Link
          href="/store"
          className="mt-6 inline-flex rounded-xl px-5 py-3 text-sm font-semibold"
          style={{
            backgroundColor: "var(--tg-theme-button-text-color, #ffffff)",
            color: "var(--tg-theme-button-color, #18181b)",
          }}
        >
          Browse plans
        </Link>
      </section>

      <section className="mt-8">
        <h2
          className="text-lg font-semibold"
          style={{ color: "var(--tg-theme-text-color, #000000)" }}
        >
          Quick actions
        </h2>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Link
            href="/store"
            className="rounded-2xl border p-5 cursor-pointer"
            style={{
              borderColor:
                "var(--tg-theme-section-separator-color, var(--tg-theme-secondary-bg-color, #f4f4f5))",
              backgroundColor:
                "var(--tg-theme-section-bg-color, #ffffff)",
              color: "var(--tg-theme-text-color, #000000)",
            }}
          >
            <div style={{ color: "var(--tg-theme-link-color, #2563eb)" }}>▣</div>
            <div className="mt-4 font-semibold">Store</div>
            <div
              className="mt-1 text-sm"
              style={{ color: "var(--tg-theme-hint-color, #71717a)" }}
            >
              Browse plans
            </div>
          </Link>

          <Link
            href="/services"
            className="rounded-2xl border p-5 cursor-pointer"
            style={{
              borderColor:
                "var(--tg-theme-section-separator-color, var(--tg-theme-secondary-bg-color, #f4f4f5))",
              backgroundColor:
                "var(--tg-theme-section-bg-color, #ffffff)",
              color: "var(--tg-theme-text-color, #000000)",
            }}
          >
            <div style={{ color: "var(--tg-theme-link-color, #2563eb)" }}>◇</div>
            <div className="mt-4 font-semibold">Services</div>
            <div
              className="mt-1 text-sm"
              style={{ color: "var(--tg-theme-hint-color, #71717a)" }}
            >
              Your connections
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}