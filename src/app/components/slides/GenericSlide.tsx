import React from "react";
import { DynamicIcon } from "./DynamicIcon";

export function GenericSlide({ data }: { data?: any }) {
  const badge = data?.badge || "02 · Overview";
  const title = data?.title || "Slide Title";
  const layout = data?.layout || "list";
  const bullets = data?.bullets || [
    { title: "Point One", desc: "Detailed explanation of this point.", iconName: "zap" },
    { title: "Point Two", desc: "Detailed explanation of this point.", iconName: "rocket" },
    { title: "Point Three", desc: "Detailed explanation of this point.", iconName: "shield" }
  ];

  const gridCols = bullets.length >= 4 ? "grid-cols-2" : "grid-cols-3";

  return (
    <div className="absolute inset-0 bg-[#0B0F19] text-white flex flex-col p-16 select-none overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.06),transparent_60%)] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 mb-6 shrink-0">
        <p className="text-[#8B5CF6] text-xs font-semibold tracking-widest uppercase mb-3">{badge}</p>
        <h2 className="text-4xl font-bold text-white tracking-tight">{title}</h2>
      </div>

      {/* Content Layout Centered */}
      <div className="flex-1 flex flex-col justify-center relative z-10">
        {layout === "grid" ? (
          <div className={`grid ${gridCols} gap-6`}>
            {bullets.map(({ title, desc, iconName }: any) => (
              <div
                key={title}
                className="flex flex-col justify-between p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-[#8B5CF6]/40 hover:bg-white/[0.05] transition-all duration-300"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center mb-5 shrink-0">
                    <DynamicIcon name={iconName} size={18} className="text-[#8B5CF6]" />
                  </div>
                  <p className="text-white font-bold text-base mb-2">{title}</p>
                  <p className="text-[#94A3B8] text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4 justify-center">
            {bullets.map(({ title, desc, iconName }: any) => (
              <div
                key={title}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-[#22D3EE]/40 hover:bg-white/[0.05] transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-[#22D3EE]/10 border border-[#22D3EE]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <DynamicIcon name={iconName} size={18} className="text-[#22D3EE]" />
                </div>
                <div>
                  <p className="text-white font-bold text-base mb-1.5">{title}</p>
                  <p className="text-[#94A3B8] text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
