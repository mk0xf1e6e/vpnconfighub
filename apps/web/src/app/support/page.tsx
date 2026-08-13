"use client";

import { useState } from "react";

const faqs = [
  {
    question: "How to fix connection failed?",
    answer:
      "If connection fails, try refreshing the server ping or switching to our Amsterdam / Frankfurt VLESS node."
  },
  {
    question: "Which client is best for iOS?",
    answer:
      "For iOS, Shadowrocket and Streisand offer full VLESS Reality support with sub-second ping times!"
  },
  {
    question: "What is Reality protocol?",
    answer:
      "Reality is an advanced TLS camouflage protocol that makes VPN traffic indistinguishable from regular HTTPS, preventing deep packet inspection."
  }
];

export default function SupportPage() {
  const [messages, setMessages] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    {
      sender: "bot",
      text:
        "Hello Alex! �� 👋 Need help connecting your V2Ray config, fixing speed issues, or bypassing ISP blocks?"
    }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user" as const, text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate bot response after a short delay
    setTimeout(() => {
      let reply =
        "I can help with that! Make sure your V2Ray client is set to Reality protocol and system proxy is enabled.";
      const lower = input.toLowerCase();
      if (lower.includes("ios")) {
        reply =
          "For iOS, Shadowrocket and Streisand offer full VLESS Reality support with sub-second ping times!";
      } else if (lower.includes("failed") || lower.includes("connect")) {
        reply =
          "If connection fails, try refreshing the server ping or switching to our Amsterdam / Frankfurt VLESS node.";
      }
      setMessages((prev) => [
        ...prev,
        { sender: "bot" as const, text: reply }
      ]);
    }, 700);
  };

  return (
    <div className="p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#f5f5f5]">Help & Support</h1>
        <p className="text-xs text-[#7f8c99]">
          Get help with your subscription or connections
        </p>
      </header>

      {/* AI Chat Container */}
      <div className="rounded-2xl border border-[#2b394a] bg-[#242f3d] p-4 h-[520px] flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#17212b]/20 flex items-center justify-center text-telegram-accent">
              <i className="fas fa-robot text-sm" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">
                24/7 VPN Config Assistant
              </h4>
              <p className="text-[10px] text-emerald-400">
                ● Online (AI Auto-Support)
              </p>
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {messages.map((msg, idx) => (
            <div key={idx} className="flex items-start space-x-2">
              {msg.sender === "user" ? (
                <>
                  <div className="w-6 h-6 rounded-full bg-telegram-accent/20 flex items-center justify-center text-telegram-accent shrink-0 text-[10px]">
                    <i className="fas fa-robot" />
                  </div>
                  <div className="bg-telegram-card p-2.5 rounded-2xl rounded-tl-none border border-gray-800 max-w-[85%] text-gray-200">
                    {msg.text}
                  </div>
                </>
              ) : (
                <>
                  <div className="w-6 h-6 rounded-full bg-telegram-accent/20 flex items-center justify-center text-telegram-accent shrink-0 text-[10px]">
                    <i className="fas fa-robot" />
                  </div>
                  <div className="bg-telegram-card p-2.5 rounded-2xl rounded-tl-none border border-gray-800 max-w-[85%] text-gray-200">
                    {msg.text}
                  </div>
                </>
              )}
            </div>
          ))}
          <div className="pt-2" />
        </div>

        {/* Input Box */}
        <div className="mt-3 flex space-x-2">
          <input
            type="text"
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 bg-telegram-card border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-telegram-accent"
          />
          <button
            type="button"
            onClick={handleSend}
            className="bg-telegram-accent text-white px-3.5 py-2 rounded-xl text-xs font-semibold"
          >
            <i className="fas fa-paper-plane" />
          </button>
        </div>
      </div>

      {/* FAQ Quick Questions */}
      <div className="mt-4 space-y-2">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border-b border-[#2b394a] pb-2">
            <button
              type="button"
              onClick={() => {
                setInput(faq.question);
                handleSend();
              }}
              className="w-full text-left text-[11px] hover:text-[#f5f5f5] py-1.5"
            >
              {faq.question}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
