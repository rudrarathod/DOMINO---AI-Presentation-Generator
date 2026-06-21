import React from "react";
import { DynamicIcon } from "./DynamicIcon";

export function MarketSlide({ data }: { data?: any }) {
  const badge = data?.badge || "07 · Market Opportunity";
  const title = data?.title || "Total Addressable Market";
  const cards = data?.cards || [
    { label: "TAM", value: "$10.4B", desc: "Total Addressable Market globally", color: "violet" },
    { label: "SAM", value: "$3.2B", desc: "Serviceable Addressable Market targeted", color: "indigo" },
    { label: "SOM", value: "$850M", desc: "Serviceable Obtainable Market initial capture", color: "blue" },
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

      {/* Market Cards Layout Centered */}
      <div className="flex-1 flex flex-col justify-center relative z-10">
        <div className="grid grid-cols-3 gap-6">
          {cards.map(({ label, value, desc, color }: any) => {
            const textColMap: any = {
              violet: "text-[#8B5CF6]",
              indigo: "text-[#8B5CF6]",
              blue: "text-[#22D3EE]",
              cyan: "text-[#22D3EE]"
            };
            const borderColMap: any = {
              violet: "hover:border-[#8B5CF6]/40",
              indigo: "hover:border-[#8B5CF6]/40",
              blue: "hover:border-[#22D3EE]/40",
              cyan: "hover:border-[#22D3EE]/40"
            };
            const textClass = textColMap[color] || "text-[#22D3EE]";
            const borderHoverClass = borderColMap[color] || "hover:border-[#22D3EE]/40";

            return (
              <div
                key={label}
                className={`flex flex-col justify-between p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] ${borderHoverClass} hover:bg-white/[0.05] transition-all duration-300`}
              >
                <div>
                  <p className={`${textClass} text-xs font-extrabold tracking-widest uppercase mb-6`}>
                    {label} Segment
                  </p>
                  <p className="text-white/60 text-sm leading-relaxed mb-6">{desc}</p>
                </div>

                <div className="text-5xl font-extrabold text-white tracking-tight border-t border-white/[0.06] pt-6">
                  {value}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
