import React from "react";
import { DynamicIcon } from "./DynamicIcon";
import { ImagePlaceholder } from "./ImagePlaceholder";

export function SolutionSlide({ data, onDataUpdate }: { data?: any; onDataUpdate?: (newData: any) => void }) {
  const badge = data?.badge || "04 · Solution";
  const title = data?.title || "Optimal & Optimized";
  const cards = data?.cards || [
    { iconName: "zap", title: "99.99% Guaranteed Uptime", desc: "Automated failovers and cluster health healing." },
    { iconName: "trending-up", title: "85% Latency Reduction", desc: "Parser indexing pipelines optimize query paths." },
    { iconName: "cpu", title: "Enterprise Performance Optimization", desc: "Seamless scaling across cloud-native architectures." },
  ];
  const demoTitle = data?.demoTitle || "Raw Unstructured Data ➔ Parser ➔ Indexed SQL Queries";
  const imageUrl = data?.imageUrl || "";

  return (
    <div className="absolute inset-0 bg-[#0B0F19] text-white flex flex-col p-16 select-none overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.06),transparent_60%)] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 mb-6 shrink-0">
        <p className="text-[#10B981] text-xs font-semibold tracking-widest uppercase mb-2">{badge}</p>
        <h2 className="text-4xl font-bold text-white tracking-tight">{title}</h2>
      </div>

      {/* Main Content Split Grid Centered */}
      <div className="flex-1 flex flex-col justify-center relative z-10">
        <div className="grid grid-cols-12 gap-8 items-center">
          {/* Left Side: Solution Cards */}
          <div className="col-span-7 flex flex-col gap-4">
            {cards.map(({ iconName, title, desc }: any) => (
              <div
                key={title}
                className="flex gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-[#10B981]/45 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center shrink-0">
                  <DynamicIcon name={iconName} size={18} className="text-[#10B981]" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm mb-1">{title}</p>
                  <p className="text-[#94A3B8] text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side: Showcase visual */}
          <div className="col-span-5 h-[320px]">
            <ImagePlaceholder
              imageUrl={imageUrl}
              onImageUpload={onDataUpdate ? (url) => onDataUpdate({ ...data, imageUrl: url }) : undefined}
              fallbackIcon={
                <div className="text-center p-6">
                  <div className="w-16 h-16 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center mx-auto mb-4">
                    <DynamicIcon name="refresh-cw" size={28} className="text-[#10B981] animate-spin [animation-duration:8s]" />
                  </div>
                  <p className="text-white font-semibold text-sm mb-2">Live Demo Sandbox</p>
                  <p className="text-[#94A3B8] text-[11px] leading-relaxed max-w-[200px] mx-auto">
                    {demoTitle}
                  </p>
                </div>
              }
              className="w-full h-full rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center overflow-hidden hover:border-[#10B981]/50 transition-all duration-300"
              variant="card"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
