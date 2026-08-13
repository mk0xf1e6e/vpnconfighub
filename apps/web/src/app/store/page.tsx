export default function StorePage() {
  return (
    <div className="p-4 space-y-4">
      <header>
        <h1 className="text-xl font-bold text-[#f5f5f5]">Subscription Store</h1>
        <p className="text-xs text-[#7f8c99]">Select a high-speed plan for your devices</p>
      </header>

      <div className="space-y-3">
        {[
          { name: "Basic", price: "50 ⭐", period: "30 days", speed: "100 Mbps", quota: "50 GB" },
          { name: "Standard", price: "100 ⭐", period: "30 days", speed: "500 Mbps", quota: "150 GB" },
          { name: "Pro Ultra 5G", price: "150 ⭐", period: "30 days", speed: "1 Gbps", quota: "200 GB" },
        ].map((plan) => (
          <div
            key={plan.name}
            className="rounded-2xl border border-[#2b394a] bg-[#242f3d] p-5 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#f5f5f5]">{plan.name}</h2>
              <span className="rounded-full border border-[#2aabee]/30 bg-[#2aabee]/10 px-2.5 py-0.5 text-xs font-bold text-[#2aabee]">
                {plan.price}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-4 text-xs text-[#7f8c99]">
              <span>Duration: {plan.period}</span>
              <span>Speed: {plan.speed}</span>
              <span>Traffic: {plan.quota}</span>
            </div>

            <button
              type="button"
              className="mt-4 w-full rounded-xl bg-[#5288c1] py-2.5 text-xs font-bold text-white transition hover:bg-[#4172a5] focus:outline-none focus:ring-2 focus:ring-[#2aabee]"
            >
              Select Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
