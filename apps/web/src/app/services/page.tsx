export default function ServicesPage() {
  return (
    <main className="px-5 pt-8">
      <p className="text-sm text-zinc-500">VPN Config Hub</p>

      <h1 className="mt-1 text-2xl font-bold">Services</h1>

      <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
        <div className="text-3xl">◇</div>

        <h2 className="mt-4 font-semibold">No active services</h2>

        <p className="mt-2 text-sm text-zinc-500">
          Your purchased VPN services will appear here.
        </p>
      </div>
    </main>
  );
}
