import React, { useState, useEffect, useRef } from 'react';


// Default mock state for Telegram User and Active Configs
const DEFAULT_USER = {
  name: "Alex Johnson",
  username: "@alex_v2ray",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  stars: 450,
  activePlan: "Pro Unlimited XTLS",
  dataUsed: 18.4,
  dataTotal: 50.0,
  daysLeft: 22,
  configString: "vless://7f9c8a21-4b10-482a-93bd@de-frankfurt.v2hub.net:443?type=tcp&security=reality&fp=chrome&pbk=8xYzQ123&sni=de-frankfurt.v2hub.net#Premium-DE-Frankfurt"
};

const INITIAL_NODES = [
  { id: 1, name: "Frankfurt #1", country: "Germany", flag: "🇩🇪", ping: 32, protocol: "VLESS Reality", load: "24%", status: "online" },
  { id: 2, name: "Amsterdam #2", country: "Netherlands", flag: "🇳🇱", ping: 45, protocol: "Trojan TLS", load: "38%", status: "online" },
  { id: 3, name: "Singapore #1", country: "Singapore", flag: "🇸🇬", ping: 110, protocol: "VLESS Reality", load: "15%", status: "online" },
  { id: 4, name: "Tokyo #3", country: "Japan", flag: "🇯🇵", ping: 142, protocol: "VMess WS", load: "62%", status: "online" },
  { id: 5, name: "New York #1", country: "USA", flag: "🇺🇸", ping: 98, protocol: "VLESS Reality", load: "40%", status: "online" },
  { id: 6, name: "London #2", country: "UK", flag: "🇬🇧", ping: 38, protocol: "Trojan TLS", load: "29%", status: "online" }
];

const SHOP_PLANS = [
  {
    id: "starter",
    title: "Starter V2Ray",
    badge: null,
    desc: "Perfect for lightweight browsing & social media",
    priceUsd: 3.99,
    priceStars: 200,
    dataQuota: "50 GB",
    features: ["50 GB Monthly High-Speed Data", "2 Concurrent Connections", "VLESS + Reality Protocol", "Standard Support"]
  },
  {
    id: "pro",
    title: "Pro Unlimited XTLS",
    badge: "Most Popular",
    desc: "Maximum speed for streaming 4K & zero-lag gaming",
    priceUsd: 7.99,
    priceStars: 400,
    dataQuota: "Unlimited",
    features: ["Unlimited High-Speed Traffic", "5 Device Connections", "Includes Premium Telegram Proxy Key", "Access to all Global Nodes", "24/7 Priority Support"]
  },
  {
    id: "tg_proxy",
    title: "TG Proxy Only Pass",
    badge: "Telegram Only",
    desc: "Dedicated MTProto Proxy key directly inside Telegram",
    priceUsd: 1.99,
    priceStars: 100,
    dataQuota: "TG Unlimited",
    features: ["Native Telegram MTProto Protocol", "No Third-party VPN App Required", "Instant Connection", "Bypass ISP Throttling"]
  }
];

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs font-semibold px-4 py-2.5 rounded-full border border-sky-500/40 shadow-xl backdrop-blur-md flex items-center space-x-2 animate-bounce">
      <span className="w-2 h-2 rounded-full bg-sky-400"></span>
      <span>{message}</span>
    </div>
  );
};

const TrafficChart = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const data = [18, 42, 68, 120, 95, 140, 110, 155];
    let offset = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;

      // Gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'rgba(42, 171, 238, 0.35)');
      gradient.addColorStop(1, 'rgba(42, 171, 238, 0.0)');

      ctx.beginPath();
      const step = width / (data.length - 1);
      
      for (let i = 0; i < data.length; i++) {
        const x = i * step;
        const val = data[i] + Math.sin(offset + i) * 8;
        const y = height - (val / 180) * height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Stroke line
      ctx.beginPath();
      for (let i = 0; i < data.length; i++) {
        const x = i * step;
        const val = data[i] + Math.sin(offset + i) * 8;
        const y = height - (val / 180) * height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#2aabee';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      offset += 0.04;
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="w-full h-28 relative">
      <canvas ref={canvasRef} width={360} height={110} className="w-full h-full" />
    </div>
  );
};

const Header = ({ user, onOpenDev, onOpenShop }) => {
  return (
    <header className="bg-slate-900/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-800/80 sticky top-0 z-30">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img src={user.avatar} alt="User Avatar" className="w-9 h-9 rounded-full border border-sky-400 object-cover" />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
        </div>
        <div>
          <div className="flex items-center space-x-1">
            <h2 className="font-semibold text-sm leading-tight text-white">{user.name}</h2>
            <svg className="w-3.5 h-3.5 text-sky-400 fill-current" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
            </svg>
          </div>
          <p className="text-xs text-slate-400">{user.username}</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div 
          onClick={onOpenShop}
          className="bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full flex items-center space-x-1.5 cursor-pointer hover:bg-amber-500/20 transition-all shadow-sm"
        >
          <span className="text-amber-400 text-xs">⭐</span>
          <span className="text-xs font-bold text-amber-300">{user.stars} Stars</span>
        </div>

        <button 
          onClick={onOpenDev}
          className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition"
          title="Open 3X-UI & API Inspector"
        >
          <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </button>
      </div>
    </header>
  );
};

const DashboardTab = ({ user, nodes, onPing, onCopyConfig, onCopyTgProxy, onOpenQr, onViewAllNodes }) => {
  const percentage = Math.min(100, Math.round((user.dataUsed / user.dataTotal) * 100));

  return (
    <div className="space-y-4">
      {/* Active Subscription Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-4 border border-sky-500/30 relative overflow-hidden shadow-lg">
        <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-sky-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex justify-between items-start mb-3">
          <div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span> Active Plan
            </span>
            <h3 className="text-lg font-bold text-white mt-1">{user.activePlan}</h3>
          </div>
          <button 
            onClick={onPing}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 rounded-lg border border-slate-700 flex items-center space-x-1.5 transition"
          >
            <span className="text-amber-400">⚡</span>
            <span>Test Ping</span>
          </button>
        </div>

        {/* Quota Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Data Quota Usage</span>
            <span className="font-semibold text-white">{user.dataUsed} GB / {user.dataTotal} GB</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-700/50">
            <div 
              className="bg-gradient-to-r from-sky-400 to-emerald-400 h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 pt-1">
            <span>Expires in: <strong className="text-slate-200">{user.daysLeft} Days</strong></span>
            <span>Speed: <strong className="text-emerald-400">Up to 1 Gbps</strong></span>
          </div>
        </div>
      </div>

      {/* Config Key Action Box */}
      <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-semibold text-white flex items-center">
            <span className="text-sky-400 mr-1.5">🔑</span> Active Config Link
          </h4>
          <span className="text-[10px] bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded-full font-mono border border-sky-500/20">VLESS + Reality</span>
        </div>

        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between font-mono text-xs overflow-hidden">
          <span className="truncate mr-2 text-slate-400">{user.configString}</span>
          <button 
            onClick={onCopyConfig}
            className="bg-sky-500 hover:bg-sky-400 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition flex items-center space-x-1"
          >
            <span>Copy</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button 
            onClick={onOpenQr}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-2.5 rounded-xl border border-slate-700/80 text-xs font-medium flex items-center justify-center space-x-1.5 transition"
          >
            <span className="text-sky-400">📱</span>
            <span>Show QR Code</span>
          </button>
          <button 
            onClick={onCopyTgProxy}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-2.5 rounded-xl border border-slate-700/80 text-xs font-medium flex items-center justify-center space-x-1.5 transition"
          >
            <span className="text-sky-400">✈️</span>
            <span>TG MTProto Key</span>
          </button>
        </div>
      </div>

      {/* Live Bandwidth Monitor */}
      <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-2">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-semibold text-white flex items-center">
            <span className="text-emerald-400 mr-1.5">📈</span> Real-time Bandwidth
          </h4>
          <span className="text-xs text-emerald-400 flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1 animate-ping"></span> Live
          </span>
        </div>
        <TrafficChart />
      </div>

      {/* Top Active Nodes Preview */}
      <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-semibold text-white">Top Active Servers</h4>
          <button onClick={onViewAllNodes} className="text-xs text-sky-400 hover:underline font-medium">View All ({nodes.length})</button>
        </div>
        <div className="space-y-2">
          {nodes.slice(0, 3).map((node) => (
            <div key={node.id} className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2.5">
                <span className="text-base">{node.flag}</span>
                <div>
                  <div className="font-semibold text-white flex items-center">
                    <span>{node.name}</span>
                    <span className="ml-2 text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded border border-slate-700">{node.protocol}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Server Load: {node.load}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`font-mono text-[11px] ${node.ping < 60 ? 'text-emerald-400' : node.ping < 120 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {node.ping} ms
                </span>
                <span className={`w-2 h-2 rounded-full ${node.ping < 60 ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ShopTab = ({ onSelectPlan }) => {
  const [duration, setDuration] = useState(1);

  const getMultiplier = () => {
    if (duration === 3) return 0.85;
    if (duration === 12) return 0.65;
    return 1.0;
  };

  return (
    <div className="space-y-4">
      {/* Duration Switcher */}
      <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
        <button 
          onClick={() => setDuration(1)} 
          className={`flex-1 py-1.5 rounded-lg font-semibold transition ${duration === 1 ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
        >
          1 Month
        </button>
        <button 
          onClick={() => setDuration(3)} 
          className={`flex-1 py-1.5 rounded-lg font-semibold transition ${duration === 3 ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
        >
          3 Mos (-15%)
        </button>
        <button 
          onClick={() => setDuration(12)} 
          className={`flex-1 py-1.5 rounded-lg font-semibold transition ${duration === 12 ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
        >
          1 Year (-35%)
        </button>
      </div>

      {/* Subscription Plans List */}
      <div className="space-y-3">
        {SHOP_PLANS.map((plan) => {
          const finalUsd = (plan.priceUsd * duration * getMultiplier()).toFixed(2);
          const finalStars = Math.round(plan.priceStars * duration * getMultiplier());

          return (
            <div 
              key={plan.id}
              className={`rounded-2xl p-4 transition relative overflow-hidden ${
                plan.badge 
                  ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-sky-400 shadow-lg' 
                  : 'bg-slate-900/80 border border-slate-800 hover:border-sky-500/50'
              }`}
            >
              {plan.badge && (
                <div className="absolute top-0 right-0 bg-sky-500 text-slate-950 text-[10px] font-extrabold px-3 py-0.5 rounded-bl-xl uppercase tracking-wider">
                  {plan.badge}
                </div>
              )}

              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-base font-bold text-white">{plan.title}</h3>
                  <p className="text-xs text-slate-400">{plan.desc}</p>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <div className="text-lg font-black text-white">${finalUsd} <span className="text-xs font-normal text-slate-400">/period</span></div>
                  <div className="text-xs text-amber-400 font-semibold flex items-center justify-end">
                    <span className="mr-1">⭐</span> {finalStars} Stars
                  </div>
                </div>
              </div>

              <ul className="text-xs text-slate-300 space-y-1.5 py-2.5 border-t border-b border-slate-800/80 my-2">
                {plan.features.map((ft, idx) => (
                  <li key={idx} className="flex items-center">
                    <span className="text-emerald-400 mr-2 font-bold text-[10px]">✓</span>
                    <span>{ft}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => onSelectPlan({ ...plan, priceUsd: parseFloat(finalUsd), priceStars: finalStars, duration })}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center space-x-2 ${
                  plan.badge 
                    ? 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-md' 
                    : 'bg-slate-800 hover:bg-sky-500 hover:text-slate-950 text-white border border-slate-700'
                }`}
              >
                <span>Select Plan</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const NodesTab = ({ nodes, onRefreshPing }) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center px-1">
        <h3 className="text-xs font-bold text-white">Global Nodes (3X-UI Cluster)</h3>
        <button 
          onClick={onRefreshPing}
          className="text-xs text-sky-400 hover:text-sky-300 flex items-center space-x-1 font-semibold"
        >
          <span>🔄 Refresh Latency</span>
        </button>
      </div>

      <div className="space-y-2">
        {nodes.map((node) => (
          <div key={node.id} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs hover:border-slate-700 transition">
            <div className="flex items-center space-x-3">
              <span className="text-xl">{node.flag}</span>
              <div>
                <div className="font-bold text-white flex items-center space-x-2">
                  <span>{node.name}</span>
                  <span className="text-[9px] bg-slate-800 text-sky-300 px-1.5 py-0.2 rounded border border-slate-700 font-mono">{node.protocol}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Country: {node.country} • Load: {node.load}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2.5">
              <span className={`font-mono font-semibold text-xs ${node.ping < 60 ? 'text-emerald-400' : node.ping < 120 ? 'text-amber-400' : 'text-rose-400'}`}>
                {node.ping} ms
              </span>
              <span className={`w-2.5 h-2.5 rounded-full ${node.ping < 60 ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const GuidesTab = ({ onShowToast }) => {
  const [selectedOs, setSelectedOs] = useState('android');

  const guides = {
    android: {
      appName: "v2rayNG",
      icon: "🤖",
      color: "text-emerald-400",
      steps: [
        "Download v2rayNG from Google Play Store or GitHub.",
        "In VPN Config Hub, click Copy Config Key on the Home tab.",
        "Open v2rayNG and tap the + button at top-right.",
        "Select Import config from Clipboard.",
        "Tap the V2Ray logo button at bottom-right to establish connection!"
      ]
    },
    ios: {
      appName: "Shadowrocket / Streisand",
      icon: "🍏",
      color: "text-slate-200",
      steps: [
        "Install Shadowrocket or Streisand from the App Store.",
        "Copy your config key or open the QR Code modal on Home tab.",
        "In Shadowrocket, tap + and scan the QR code.",
        "Toggle the Not Connected switch at top to start your VPN."
      ]
    },
    windows: {
      appName: "v2rayN / NekoBox",
      icon: "🪟",
      color: "text-sky-400",
      steps: [
        "Download v2rayN or NekoBox for Windows desktop.",
        "Copy your VLESS configuration string.",
        "Press Ctrl + V inside v2rayN window to paste and import.",
        "Right-click system tray icon & select Set System Proxy -> Enable."
      ]
    }
  };

  const current = guides[selectedOs];

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold text-white px-1">Select Client Platform</h3>

      {/* OS Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <button 
          onClick={() => setSelectedOs('android')}
          className={`p-3 rounded-xl border text-center transition ${selectedOs === 'android' ? 'bg-slate-800 border-sky-400' : 'bg-slate-900 border-slate-800'}`}
        >
          <div className="text-2xl mb-1">🤖</div>
          <div className="text-xs font-semibold text-white">Android</div>
        </button>
        <button 
          onClick={() => setSelectedOs('ios')}
          className={`p-3 rounded-xl border text-center transition ${selectedOs === 'ios' ? 'bg-slate-800 border-sky-400' : 'bg-slate-900 border-slate-800'}`}
        >
          <div className="text-2xl mb-1">🍏</div>
          <div className="text-xs font-semibold text-white">iOS / Mac</div>
        </button>
        <button 
          onClick={() => setSelectedOs('windows')}
          className={`p-3 rounded-xl border text-center transition ${selectedOs === 'windows' ? 'bg-slate-800 border-sky-400' : 'bg-slate-900 border-slate-800'}`}
        >
          <div className="text-2xl mb-1">🪟</div>
          <div className="text-xs font-semibold text-white">Windows</div>
        </button>
      </div>

      {/* Dynamic Instruction Card */}
      <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-3">
        <h4 className={`text-xs font-bold flex items-center ${current.color}`}>
          <span className="mr-1.5">{current.icon}</span> Setup with {current.appName}
        </h4>
        <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside pl-1 leading-relaxed">
          {current.steps.map((step, idx) => (
            <li key={idx} className="bg-slate-950/40 p-2 rounded-lg border border-slate-800/50">
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

const SupportTab = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello Alex! 👋 How can I help you with your V2Ray config, Reality keys, or server latency today?' }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const newMsgs = [...messages, { sender: 'user', text }];
    setMessages(newMsgs);
    if (!textToSend) setInput('');

    setTimeout(() => {
      let reply = "Ensure your V2Ray client is updated to support VLESS Reality and system proxy mode is turned on.";
      const lower = text.toLowerCase();
      if (lower.includes('ios')) {
        reply = "For iOS devices, Shadowrocket and Streisand offer full VLESS Reality support with fast speeds.";
      } else if (lower.includes('failed') || lower.includes('connect')) {
        reply = "If connection fails, try testing latency on the Nodes tab and switching to our Frankfurt or Amsterdam server.";
      }
      setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    }, 600);
  };

  return (
    <div className="space-y-3 flex flex-col h-[500px]">
      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 font-bold">
          🤖
        </div>
        <div>
          <h4 className="text-xs font-bold text-white">24/7 VPN Support Assistant</h4>
          <p className="text-[10px] text-emerald-400">● Online (3X-UI Automated AI)</p>
        </div>
      </div>

      <div className="flex-1 bg-slate-950 p-3 rounded-2xl border border-slate-800 overflow-y-auto space-y-3 text-xs">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'items-start space-x-2'}`}>
            {m.sender === 'bot' && (
              <div className="w-6 h-6 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 shrink-0 text-[10px]">
                🤖
              </div>
            )}
            <div className={`p-2.5 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
              m.sender === 'user' 
                ? 'bg-sky-500 text-slate-950 font-medium rounded-tr-none' 
                : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex space-x-1.5 overflow-x-auto py-1 text-[11px]">
        <button onClick={() => handleSend('How to fix connection failed?')} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full whitespace-nowrap border border-slate-700">How to fix connection failed?</button>
        <button onClick={() => handleSend('Which client is best for iOS?')} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full whitespace-nowrap border border-slate-700">Which client is best for iOS?</button>
      </div>

      <div className="flex space-x-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask support..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
        />
        <button onClick={() => handleSend()} className="bg-sky-500 hover:bg-sky-400 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-bold transition">
          Send
        </button>
      </div>
    </div>
  );
};

const DevConsoleModal = ({ onClose }) => {
  const [endpoint, setEndpoint] = useState('addClient');
  const [output, setOutput] = useState('// Click "Execute Call" to test 3X-UI API payload response...');

  const mockResponses = {
    addClient: {
      success: true,
      msg: "Client added to 3X-UI inbound #1",
      obj: {
        id: "7f9c8a21-4b10-482a-93bd",
        email: "alex_v2ray@telegram.user",
        totalGB: 53687091200,
        expiryTime: Date.now() + 2592000000,
        enable: true
      }
    },
    getInbound: {
      success: true,
      obj: {
        id: 1,
        up: 2147483648,
        down: 17609365504,
        total: 53687091200,
        remark: "DE-Frankfurt-VLESS"
      }
    },
    validateInitData: {
      authenticated: true,
      user: { id: 98124712, first_name: "Alex", username: "alex_v2ray" },
      hashVerified: true
    }
  };

  const handleExecute = () => {
    setOutput(JSON.stringify(mockResponses[endpoint] || {}, null, 2));
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden text-xs">
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-white flex items-center text-xs">
            <span className="text-emerald-400 mr-2">💻</span> 3X-UI API & Telegram WebApp Inspector
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold">✕</button>
        </div>

        <div className="p-4 overflow-y-auto space-y-4 font-mono text-slate-300">
          <div>
            <label className="text-slate-400 font-semibold mb-1 block">Simulate REST API Endpoint:</label>
            <div className="flex space-x-2">
              <select 
                value={endpoint} 
                onChange={(e) => setEndpoint(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-emerald-300 flex-1 focus:outline-none"
              >
                <option value="addClient">POST /panel/api/inbounds/addClient (Create VLESS User)</option>
                <option value="getInbound">GET /panel/api/inbounds/get/1 (Fetch Quota)</option>
                <option value="validateInitData">POST /api/v1/auth/telegram-init-data (Verify HMAC SHA256)</option>
              </select>
              <button onClick={handleExecute} className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-lg font-bold">
                Execute
              </button>
            </div>
          </div>

          <div>
            <span className="text-slate-400 font-semibold block mb-1">API JSON Response Output:</span>
            <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-emerald-400 overflow-x-auto text-[11px] leading-relaxed">
              {output}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckoutModal = ({ plan, userStars, onClose, onConfirmPaid }) => {
  if (!plan) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 w-full max-w-sm rounded-2xl border border-slate-700 p-5 space-y-4 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold">✕</button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto text-amber-400 text-xl border border-amber-500/20">
            ⭐
          </div>
          <h3 className="text-base font-bold text-white">Confirm Checkout</h3>
          <p className="text-xs text-sky-400 font-semibold">{plan.title} ({plan.duration} Month)</p>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Data Quota:</span>
            <span className="text-white font-medium">{plan.dataQuota}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Price (USD):</span>
            <span className="text-white font-medium">${plan.priceUsd}</span>
          </div>
          <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
            <span>Price in Stars:</span>
            <span className="text-amber-400 font-bold">⭐ {plan.priceStars} Stars</span>
          </div>
        </div>

        <div className="space-y-2">
          <button 
            onClick={() => onConfirmPaid('stars')}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-md"
          >
            <span>Pay with Telegram Stars</span>
          </button>

          <button 
            onClick={() => onConfirmPaid('crypto')}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition border border-slate-700"
          >
            <span>Pay with Crypto (TON / USDT)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const QrModal = ({ configString, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 w-full max-w-xs rounded-2xl border border-slate-700 p-5 space-y-4 text-center relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold">✕</button>

        <h3 className="text-base font-bold text-white">V2Ray QR Code</h3>
        <p className="text-xs text-slate-400">Scan using v2rayNG, Shadowrocket or Streisand</p>

        {/* Dynamic SVG QR Code Representation */}
        <div className="bg-white p-4 rounded-2xl inline-block mx-auto shadow-inner border-4 border-sky-400">
          <svg className="w-36 h-36" viewBox="0 0 100 100" fill="none">
            <rect width="100" height="100" fill="white" />
            <path d="M10 10h30v30H10zM15 15v20h20V15zM20 20h10v10H20z" fill="black" />
            <path d="M60 10h30v30H60zM65 15v20h20V15zM70 20h10v10H70z" fill="black" />
            <path d="M10 60h30v30H10zM15 65v20h20V65zM20 70h10v10H20z" fill="black" />
            <rect x="45" y="15" width="8" height="8" fill="black" />
            <rect x="45" y="30" width="8" height="8" fill="black" />
            <rect x="70" y="50" width="12" height="12" fill="black" />
            <rect x="55" y="65" width="10" height="10" fill="black" />
            <rect x="75" y="75" width="12" height="12" fill="black" />
            <rect x="45" y="80" width="8" height="8" fill="black" />
          </svg>
        </div>

        <button onClick={onClose} className="w-full bg-sky-500 text-slate-950 font-bold py-2 rounded-xl text-xs">
          Close
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(DEFAULT_USER);
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [toastMsg, setToastMsg] = useState(null);

  // Modal States
  const [devConsoleOpen, setDevConsoleOpen] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState(null);
  const [qrOpen, setQrOpen] = useState(false);

  // Bind Telegram WebApp SDK if available
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.expand();
      if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const u = tg.initDataUnsafe.user;
        setUser((prev) => ({
          ...prev,
          name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || prev.name,
          username: u.username ? `@${u.username}` : prev.username,
          avatar: u.photo_url || prev.avatar
        }));
      }
    }
  }, []);

  const showToast = (msg) => setToastMsg(msg);

  const handlePingNodes = () => {
    showToast("Testing latency for all nodes...");
    setTimeout(() => {
      setNodes((prev) =>
        prev.map((n) => ({
          ...n,
          ping: Math.floor(Math.random() * 45) + 25
        }))
      );
      showToast("Node pings updated!");
    }, 500);
  };

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(user.configString);
    showToast("VLESS Config copied to clipboard!");
  };

  const handleCopyTgProxy = () => {
    navigator.clipboard.writeText("https://t.me/proxy?server=proxy.v2hub.net&port=443&secret=ee112233445566778899aabbccddeeff");
    showToast("Telegram Proxy link copied!");
  };

  const handleConfirmPaid = (type) => {
    if (type === 'stars' && user.stars < checkoutPlan.priceStars) {
      showToast("Insufficient Stars balance! Please top up.");
      return;
    }

    if (type === 'stars') {
      setUser((prev) => ({ ...prev, stars: prev.stars - checkoutPlan.priceStars }));
    }

    showToast(`Successfully purchased ${checkoutPlan.title}!`);
    setUser((prev) => ({
      ...prev,
      activePlan: checkoutPlan.title,
      dataUsed: 0.0,
      dataTotal: checkoutPlan.dataQuota === 'Unlimited' ? 999 : 50.0
    }));
    setCheckoutPlan(null);
    setActiveTab('dashboard');
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 flex flex-col items-center justify-center p-0 md:p-4 overflow-x-hidden">
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}

      {/* Telegram Mini App Container Frame */}
      <div className="w-full max-w-md bg-slate-950 min-h-screen md:min-h-[820px] md:max-h-[850px] md:rounded-3xl shadow-2xl flex flex-col relative overflow-hidden border border-slate-800/80">
        
        {/* Header Bar */}
        <Header 
          user={user} 
          onOpenDev={() => setDevConsoleOpen(true)} 
          onOpenShop={() => setActiveTab('shop')} 
        />

        {/* Content Body Area */}
        <main className="flex-1 overflow-y-auto p-4 pb-24 relative space-y-4">
          {activeTab === 'dashboard' && (
            <DashboardTab 
              user={user} 
              nodes={nodes} 
              onPing={handlePingNodes} 
              onCopyConfig={handleCopyConfig} 
              onCopyTgProxy={handleCopyTgProxy} 
              onOpenQr={() => setQrOpen(true)} 
              onViewAllNodes={() => setActiveTab('nodes')} 
            />
          )}

          {activeTab === 'shop' && (
            <ShopTab onSelectPlan={(plan) => setCheckoutPlan(plan)} />
          )}

          {activeTab === 'nodes' && (
            <NodesTab nodes={nodes} onRefreshPing={handlePingNodes} />
          )}

          {activeTab === 'guides' && (
            <GuidesTab onShowToast={showToast} />
          )}

          {activeTab === 'support' && (
            <SupportTab />
          )}
        </main>

        {/* Telegram Mini App Bottom Navigation */}
        <nav className="bg-slate-900/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-2 flex justify-around items-center absolute bottom-0 left-0 right-0 z-30">
          {[
            { id: 'dashboard', label: 'Home', icon: '🛡️' },
            { id: 'shop', label: 'Store', icon: '🛍️' },
            { id: 'nodes', label: 'Nodes', icon: '🌐' },
            { id: 'guides', label: 'Guides', icon: '📖' },
            { id: 'support', label: 'Help', icon: '🎧' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-1 px-3 transition ${activeTab === tab.id ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              <span className="text-base mb-0.5">{tab.icon}</span>
              <span className="text-[10px]">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Modals */}
      {devConsoleOpen && <DevConsoleModal onClose={() => setDevConsoleOpen(false)} />}
      {checkoutPlan && <CheckoutModal plan={checkoutPlan} userStars={user.stars} onClose={() => setCheckoutPlan(null)} onConfirmPaid={handleConfirmPaid} />}
      {qrOpen && <QrModal configString={user.configString} onClose={() => setQrOpen(false)} />}
    </div>
  );
}