import React from "react";
import { DynamicIcon } from "./DynamicIcon";

export function ProblemSlide({ data }: { data?: any }) {
  const badge = data?.badge || "03 · Problem";
  const title = data?.title || "System Latency & Outages";
  const cards = data?.cards || [
    { title: "Database Bottleneck", desc: "Unstructured Data Overload leads to 92% CPU load.", pct: "92%" },
    { title: "API Response Lag", desc: "Response times spiked to 8.2 seconds.", pct: "8.2s" },
    { title: "Data Loss", desc: "4.1% packet drops across international clusters.", pct: "4.1%" },
  ];

  return (
    <div className="absolute inset-0 bg-[#0B0F19] text-white flex flex-col p-16 select-none overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.06),transparent_60%)] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 mb-6 shrink-0">
        <p className="text-[#EF4444] text-xs font-semibold tracking-widest uppercase mb-2">{badge}</p>
        <h2 className="text-4xl font-bold text-white tracking-tight">{title}</h2>
      </div>

      {/* Grid of Cards Centered */}
      <div className="flex-1 flex flex-col justify-center relative z-10">
        <div className="grid grid-cols-3 gap-6">
          {cards.map(({ title, desc, pct }: any) => (
            <div
              key={title}
              className="flex flex-col justify-between p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-[#EF4444]/45 hover:bg-white/[0.05] transition-all duration-300"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center mb-6">
                  <DynamicIcon name="alert-triangle" size={18} className="text-[#EF4444]" />
                </div>
                <p className="text-white font-bold text-lg mb-3">{title}</p>
                <p className="text-[#94A3B8] text-sm leading-relaxed">{desc}</p>
              </div>
              
              <div className="text-5xl font-extrabold text-[#EF4444] tracking-tight mt-8 border-t border-white/[0.06] pt-6">
                {pct}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
