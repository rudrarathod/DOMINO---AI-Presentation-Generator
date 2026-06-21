import React from "react";
import { DynamicIcon } from "./DynamicIcon";

export function BusinessModelSlide({ data }: { data?: any }) {
  const badge = data?.badge || "08 · Business Model";
  const title = data?.title || "Three-Column Pricing Structure";
  const tiers = data?.tiers || [
    { tier: "Developer", price: "$0/month", desc: "1 User · Core Modules" },
    { tier: "Pro", price: "$79/month", desc: "10 Users · Custom APIs · SLA Support" },
    { tier: "Enterprise", price: "Custom Pricing", desc: "Unlimited Users · Dedicated Infrastructure" },
  ];

  return (
    <div className="absolute inset-0 bg-[#0B0F19] text-white flex flex-col p-16 select-none overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.06),transparent_60%)] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 mb-6 shrink-0">
        <p className="text-[#8B5CF6] text-xs font-semibold tracking-widest uppercase mb-2">{badge}</p>
        <h2 className="text-4xl font-bold text-white tracking-tight">{title}</h2>
      </div>

      {/* Pricing Cards Grid Centered */}
      <div className="flex-1 flex flex-col justify-center relative z-10">
        <div className="grid grid-cols-3 gap-6">
          {tiers.map(({ tier, price, desc }: any, idx: number) => {
            const isHighlighted = tier.toLowerCase() === "pro";
            return (
              <div
                key={tier}
                className={`flex flex-col justify-between p-8 rounded-2xl transition-all duration-300 relative ${
                  isHighlighted
                    ? "bg-white/[0.05] border-2 border-[#8B5CF6] shadow-xl shadow-[#8B5CF6]/5"
                    : "bg-white/[0.03] border border-white/[0.08] hover:border-[#8B5CF6]/45"
                }`}
              >
                {isHighlighted && (
                  <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-[#8B5CF6] text-white text-[10px] font-bold uppercase tracking-wider">
                    Popular
                  </div>
                )}

                <div>
                  <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">{tier}</p>
                  <div className="text-3xl font-extrabold text-white tracking-tight mb-4">{price}</div>
                  <div className="h-px bg-white/[0.06] mb-6" />
                  <p className="text-[#94A3B8] text-sm leading-relaxed">{desc}</p>
                </div>

                <div className="mt-8">
                  <button
                    className={`w-full py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
                      isHighlighted
                        ? "bg-[#8B5CF6] text-white hover:bg-[#8B5CF6]/90"
                        : "bg-white/[0.04] text-white border border-white/[0.08] hover:bg-white/[0.08]"
                    }`}
                  >
                    {isHighlighted ? "Get Started" : "Select Plan"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
