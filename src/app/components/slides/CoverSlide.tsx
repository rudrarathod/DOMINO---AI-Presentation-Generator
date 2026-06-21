import React from "react";
import { DynamicIcon } from "./DynamicIcon";
import { ImagePlaceholder } from "./ImagePlaceholder";

export function CoverSlide({ gradient, data, onDataUpdate }: { gradient: string; data?: any; onDataUpdate?: (newData: any) => void }) {
  const tagline = data?.tagline || "Enterprise AI Solutions";
  const title = data?.title || "Autonomous Data Intelligence";
  const subtitle = data?.subtitle || "Next-generation pipeline automation for cloud-native infrastructures.";
  const stats = data?.stats || [
    { value: "99.99%", label: "Uptime" },
    { value: "85%", label: "Faster Processing" },
    { value: "4.2B", label: "Events Processed" },
  ];
  const demoTitle = data?.demoTitle || "AI Network Preview";
  const imageUrl = data?.imageUrl || "";
  const bottomStats = data?.bottomStats || [
    { iconName: "zap", label: "Automation Engine", val: "Active" },
    { iconName: "shield", label: "Data Security", val: "Enterprise Ready" },
    { iconName: "trending-up", label: "Efficiency Gain", val: "+85% YoY" },
  ];

  return (
    <div className="absolute inset-0 bg-[#0B0F19] text-white flex flex-col p-16 select-none overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.12),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.06),transparent_60%)] pointer-events-none" />

      {/* Main Section Centered */}
      <div className="flex-1 flex items-center justify-between gap-16 relative z-10">
        <div className="flex-1 flex flex-col justify-center max-w-2xl">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[#22D3EE] text-xs font-semibold uppercase tracking-wider mb-6 w-fit">
            <DynamicIcon name="sparkles" size={11} className="text-[#22D3EE]" />
            {tagline}
          </div>

          {/* Main Title */}
          <h1 className="text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-4 whitespace-pre-line">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-[#94A3B8] text-base leading-relaxed mb-10 max-w-lg">
            {subtitle}
          </p>

          {/* Core Stats */}
          <div className="flex items-center gap-8 border-t border-white/[0.06] pt-8">
            {stats.map(({ value, label }: any) => (
              <div key={label} className="text-left min-w-[120px]">
                <div className="text-3xl font-extrabold text-[#22D3EE] tracking-tight">{value}</div>
                <div className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wider mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Showcase Card */}
        <div className="w-[480px] h-[300px] shrink-0 relative z-10">
          <ImagePlaceholder
            imageUrl={imageUrl}
            onImageUpload={onDataUpdate ? (url) => onDataUpdate({ ...data, imageUrl: url }) : undefined}
            fallbackIcon={
              <div className="relative text-center p-6">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15),transparent_70%)] pointer-events-none" />
                <div className="w-16 h-16 rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center mx-auto mb-4">
                  <DynamicIcon name="cpu" size={28} className="text-[#8B5CF6]" />
                </div>
                <p className="text-white font-semibold text-sm mb-1">{demoTitle}</p>
                <p className="text-[#94A3B8] text-xs">Interactive visual asset preview</p>
              </div>
            }
            className="w-full h-full rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center overflow-hidden hover:border-[#8B5CF6]/50 transition-all duration-300"
            variant="card"
          />
        </div>
      </div>

      {/* Bottom Stats Grid shrink-0 */}
      <div className="grid grid-cols-3 gap-6 relative z-10 mt-8 border-t border-white/[0.06] pt-8 shrink-0">
        {bottomStats.map(({ iconName, label, val }: any) => (
          <div key={label} className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#22D3EE]/10 border border-[#22D3EE]/20 flex items-center justify-center shrink-0">
              <DynamicIcon name={iconName} size={18} className="text-[#22D3EE]" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold tracking-tight">{val}</p>
              <p className="text-[#94A3B8] text-xs font-medium mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
