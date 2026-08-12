import Link from "next/link";

export default function Home() {
  return (
    <main className="px-5 pt-8">
      <header>
        <p className="text-sm text-zinc-500">Welcome back</p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          VPN Config Hub
        </h1>
      </header>

      <section className="mt-8 rounded-3xl bg-zinc-950 p-6 text-white shadow-sm dark:bg-white dark:text-zinc-950">
        <p className="text-sm opacity-60">Current subscription</p>

        <h2 className="mt-2 text-xl font-semibold">
          No active subscription
        </h2>

        <p className="mt-2 text-sm opacity-60">
          Get secure and reliable access with one of our plans.
        </p>

        <Link
          href="/store"
          className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 dark:bg-zinc-950 dark:text-white"
        >
          Browse plans
        </Link>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Quick actions</h2>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Link
            href="/store"
            className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="text-2xl">▣</div>
            <div className="mt-4 font-semibold">Store</div>
            <div className="mt-1 text-sm text-zinc-500">
              Browse plans
            </div>
          </Link>

          <Link
            href="/services"
            className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="text-2xl">◇</div>
            <div className="mt-4 font-semibold">Services</div>
            <div className="mt-1 text-sm text-zinc-500">
              Your connections
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
