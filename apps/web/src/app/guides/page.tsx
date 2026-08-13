"use client";

import { useState } from "react";

const guides = {
  android: {
    title: "Setup with v2rayNG (Recommended)",
    steps: [
      "Download <strong>v2rayNG</strong> from Google Play Store or GitHub.",
      "In VPN Config Hub, tap <strong>Copy Config Key</strong>.",
      "Open v2rayNG, tap the <strong>+</strong> button top-right.",
      "Select <strong>Import config from Clipboard</strong>.",
      "Tap the V2Ray logo button at bottom-right to connect!"
    ]
  },
  ios: {
    title: "Setup with Shadowrocket / Streisand",
    steps: [
      "Install <strong>Shadowrocket</strong> or <strong>Streisand</strong> from App Store.",
      "Copy your config key or open the <strong>QR Code</strong> modal.",
      "In Shadowrocket, tap <strong>+</strong> and scan QR code.",
      "Toggle the <strong>Not Connected</strong> switch to start VPN."
    ]
  },
  windows: {
    title: "Setup with v2rayN / NekoRay",
    steps: [
      "Download <strong>v2rayN</strong> or <strong>NekoBox</strong> for Windows.",
      "Copy your VLESS configuration link.",
      "Press <strong>Ctrl + V</strong> inside v2rayN to import.",
      "Right-click tray icon & select <strong>Set System Proxy</strong>."
    ]
  }
};

export default function GuidesPage() {
  const [selectedOs, setSelectedOs] = useState<"android" | "ios" | "windows">("android");

  return (
    <div className="p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#f5f5f5]">Setup Guides</h1>
        <p className="text-xs text-[#7f8c99]">How to connect on Android, iOS & Windows</p>
      </header>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {Object.keys(guides).map((os) => (
          <button
            key={os}
            type="button"
            onClick={() => setSelectedOs(os as "android" | "ios" | "windows")}
            style={{
              border: `2px solid ${selectedOs === os ? "#2aabee" : "#2b394a"}`,
              backgroundColor: selectedOs === os ? "#2aabee" : "#1f2936",
              color: "#f5f5f5",
            }}
            className="flex flex-col items-center justify-center p-3 rounded-xl transition"
          >
            <div className="text-xs font-semibold">
              {os.charAt(0).toUpperCase() + os.slice(1)}
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-[#2b394a] bg-[#242f3d] p-6">
        <h2 className="text-lg font-bold text-[#f5f5f5] mb-3">
          {guides[selectedOs].title}
        </h2>
        <ol className="space-y-3 text-[#f5f5f5]">
          {guides[selectedOs].steps.map((step, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex-shrink-0 text-[12px] font-bold text-[#2aabee]">
                {index + 1}.
              </span>
              <div className="flex-1" dangerouslySetInnerHTML={{ __html: step }} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}