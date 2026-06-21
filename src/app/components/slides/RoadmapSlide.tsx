import React from "react";
import { Check } from "lucide-react";

export function RoadmapSlide({ data }: { data?: any }) {
  const badge = data?.badge || "11 · Roadmap";
  const title = data?.title || "Product Roadmap";
  const milestones = data?.milestones || [
    { q: "Phase 1", title: "Alpha Core MVP Engine", desc: "Completed core parser mechanics", done: true },
    { q: "Phase 2", title: "API Integration", desc: "In Progress: Marketplace modules", done: true },
    { q: "Phase 3", title: "Multi-region Scale", desc: "Planned: Scaling enterprise clusters", done: false },
    { q: "Phase 4", title: "Global Edge Network", desc: "Future: Distributed edge launch", done: false },
  ];

  const doneCount = milestones.filter((m: any) => m.done).length;
  const totalCount = milestones.length;
  const leftPercent = 50 / totalCount; // 12.5% for 4 items
  const trackWidthPercent = 100 - (100 / totalCount); // 75% for 4 items
  const activePercent = totalCount > 1 
    ? ((doneCount - 1) / (totalCount - 1)) * trackWidthPercent 
    : 0;

  return (
    <div className="absolute inset-0 bg-[#0B0F19] text-white flex flex-col p-16 select-none overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.06),transparent_60%)] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 mb-6 shrink-0">
        <p className="text-[#8B5CF6] text-xs font-semibold tracking-widest uppercase mb-2">{badge}</p>
        <h2 className="text-4xl font-bold text-white tracking-tight">{title}</h2>
      </div>

      {/* Timeline Layout Centered */}
      <div className="flex-1 flex flex-col justify-center relative z-10">
        <div className="relative w-full">
          {/* Background Track Line */}
          <div 
            className="absolute top-6 h-1 bg-white/10 -translate-y-1/2 rounded-full pointer-events-none"
            style={{ left: `${leftPercent}%`, right: `${leftPercent}%` }}
          />

          {/* Active Progress Line */}
          {doneCount > 0 && (
            <div 
              className="absolute top-6 h-1 bg-[#8B5CF6] -translate-y-1/2 rounded-full shadow-lg shadow-[#8B5CF6]/30 transition-all duration-500 pointer-events-none"
              style={{ 
                left: `${leftPercent}%`, 
                width: `${activePercent}%` 
              }}
            />
          )}

          {/* Nodes and Cards */}
          <div className="flex items-start justify-between w-full relative z-20">
            {milestones.map(({ q, title, desc, done }: any, idx: number) => (
              <div key={q} className="flex-1 flex flex-col items-center px-4">
                {/* Node Circle */}
                <div
                  className={`w-12 h-12 rounded-full border-2 shrink-0 ${
                    done
                      ? "bg-[#8B5CF6] border-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/30"
                      : "border-white/20 bg-[#0B0F19] text-white/30"
                  } flex items-center justify-center transition-all duration-300 mb-6`}
                >
                  {done ? (
                    <Check size={18} className="stroke-[3]" />
                  ) : (
                    <span className="text-xs font-mono font-bold">{idx + 1}</span>
                  )}
                </div>

                {/* Milestone Glass Card */}
                <div className="w-full rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 text-center hover:border-[#8B5CF6]/45 transition-colors">
                  <p className={`text-[10px] font-mono font-bold uppercase tracking-wider mb-1.5 ${done ? "text-[#8B5CF6]" : "text-white/30"}`}>
                    {q}
                  </p>
                  <p className="text-white text-sm font-bold mb-2 leading-tight">{title}</p>
                  <p className="text-[#94A3B8] text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
