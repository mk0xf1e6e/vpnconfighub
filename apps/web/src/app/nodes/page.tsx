"use client";

import { useState } from "react";
import { NodeCard, type ServerNode } from "@/components/nodes/node-card";

const INITIAL_NODES: ServerNode[] = [
  {
    id: "de-frankfurt-1",
    name: "Frankfurt #1",
    country: "Germany",
    flag: "🇩🇪",
    city: "Frankfurt",
    pingMs: 32,
    loadPercent: 24,
    protocol: "VLESS REALITY",
    configUrl:
      "vless://7f9c8a21-4b10-482a-93bd@de-frankfurt.v2hub.net:443?type=tcp&security=reality#Frankfurt-1",
  },
  {
    id: "nl-amsterdam-2",
    name: "Amsterdam #2",
    country: "Netherlands",
    flag: "🇳🇱",
    city: "Amsterdam",
    pingMs: 45,
    loadPercent: 38,
    protocol: "Trojan TLS",
    configUrl:
      "trojan://9b128a34-2c11-491a-82ef@nl-amsterdam.v2hub.net:443?security=tls#Amsterdam-2",
  },
  {
    id: "fi-helsinki-1",
    name: "Helsinki #1",
    country: "Finland",
    flag: "🇫🇮",
    city: "Helsinki",
    pingMs: 38,
    loadPercent: 18,
    protocol: "Hysteria 2",
    configUrl:
      "hysteria2://de918234-11ab-4223@fi-helsinki.v2hub.net:443?obfs=salamander#Helsinki-1",
  },
  {
    id: "sg-singapore-1",
    name: "Singapore #1",
    country: "Singapore",
    flag: "🇸🇬",
    city: "Singapore",
    pingMs: 110,
    loadPercent: 15,
    protocol: "VLESS REALITY",
    configUrl:
      "vless://2a3b4c5d-6e7f-8a9b-0c1d@sg-singapore.v2hub.net:443?type=tcp&security=reality#Singapore-1",
  },
  {
    id: "jp-tokyo-3",
    name: "Tokyo #3",
    country: "Japan",
    flag: "🇯🇵",
    city: "Tokyo",
    pingMs: 142,
    loadPercent: 62,
    protocol: "VMess WS",
    configUrl:
      "vmess://eyJ2IjoyLCJwcyI6IlRva3lvLTMiLCJhZGQiOiJqcC10b2t5by52Mmh1Yi5uZXQiLCJwb3J0Ijo0NDN9#Tokyo-3",
  },
  {
    id: "us-newyork-1",
    name: "New York #1",
    country: "United States",
    flag: "🇺🇸",
    city: "New York",
    pingMs: 98,
    loadPercent: 40,
    protocol: "VLESS REALITY",
    configUrl:
      "vless://8c9d0e1f-2a3b-4c5d-6e7f@us-newyork.v2hub.net:443?type=tcp&security=reality#NewYork-1",
  },
  {
    id: "gb-london-2",
    name: "London #2",
    country: "United Kingdom",
    flag: "🇬🇧",
    city: "London",
    pingMs: 38,
    loadPercent: 29,
    protocol: "Trojan TLS",
    configUrl:
      "trojan://12345678-9abc-def0-1234@gb-london.v2hub.net:443?security=tls#London-2",
  },
];

const PROTOCOLS = ["All", "VLESS REALITY", "Trojan TLS", "Hysteria 2", "VMess WS"];

export default function NodesPage() {
  const [nodes, setNodes] = useState<ServerNode[]>(INITIAL_NODES);
  const [selectedProtocol, setSelectedProtocol] = useState("All");
  const [isTesting, setIsTesting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredNodes =
    selectedProtocol === "All"
      ? nodes
      : nodes.filter((n) => n.protocol === selectedProtocol);

  const handleTestPing = () => {
    setIsTesting(true);
    setTimeout(() => {
      setNodes((prev) =>
        prev.map((node) => ({
          ...node,
          pingMs: Math.floor(Math.random() * 40) + 20,
        }))
      );
      setIsTesting(false);
      showToast("Latency test completed!");
    }, 600);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-full border border-[#2aabee]/50 bg-[#17212b] px-4 py-2 text-xs font-bold text-[#f5f5f5] shadow-2xl animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Page Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#f5f5f5]">Global Server Nodes</h1>
          <p className="text-xs text-[#7f8c99]">3X-UI Managed Edge Routing</p>
        </div>

        <button
          type="button"
          onClick={handleTestPing}
          disabled={isTesting}
          className="flex items-center gap-1.5 rounded-xl border border-[#2b394a] bg-[#1f2936] px-3 py-2 text-xs font-bold text-[#2aabee] transition hover:bg-[#2b394a] disabled:opacity-50"
        >
          <span>⚡</span>
          <span>{isTesting ? "Testing..." : "Test Ping"}</span>
        </button>
      </header>

      {/* Protocol Filters */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {PROTOCOLS.map((proto) => (
          <button
            key={proto}
            type="button"
            onClick={() => setSelectedProtocol(proto)}
            className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              selectedProtocol === proto
                ? "bg-[#2aabee] text-white"
                : "border border-[#2b394a] bg-[#1f2936] text-[#7f8c99] hover:text-[#f5f5f5]"
            }`}
          >
            {proto}
          </button>
        ))}
      </div>

      {/* Nodes List */}
      <div className="space-y-3">
        {filteredNodes.map((node) => (
          <NodeCard
            key={node.id}
            node={node}
            onSelect={(n) => showToast(`Selected node: ${n.name}`)}
          />
        ))}
      </div>
    </div>
  );
}
