export default function NodesPage() {
  return (
    <div className="p-4 space-y-4">
      <header>
        <h1 className="text-xl font-bold text-[#f5f5f5]">Server Nodes</h1>
        <p className="text-xs text-[#7f8c99]">Available high-speed VPN locations</p>
      </header>

      <div className="rounded-2xl border border-[#2b394a] bg-[#242f3d] p-5 text-center shadow-lg">
        <span className="text-3xl">⚡</span>
        <h2 className="mt-2 text-base font-bold text-[#f5f5f5]">Server Locations</h2>
        <p className="mt-1 text-xs text-[#7f8c99]">
          Detailed node list and latency test will be available in Step 3.
        </p>
      </div>
    </div>
  );
}
