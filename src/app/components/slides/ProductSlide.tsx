import React from "react";
import { DynamicIcon } from "./DynamicIcon";
import { ImagePlaceholder } from "./ImagePlaceholder";

export function ProductSlide({ data, onDataUpdate }: { data?: any; onDataUpdate?: (newData: any) => void }) {
  const badge = data?.badge || "06 · Features";
  const title = data?.title || "Core Product Features";
  const subtitle = data?.subtitle || "High-performance automation built for scale.";
  const features = data?.features || [
    { iconName: "refresh-cw", title: "Instant Sync", desc: "Real-time data synchronization." },
    { iconName: "shield", title: "AI Guard", desc: "Intelligent threat monitoring and protection." },
    { iconName: "cpu", title: "Multi-Tenant API", desc: "Scalable enterprise integrations." },
  ];

  const handleFeatureImageUpload = (index: number, imageUrl: string) => {
    if (!onDataUpdate) return;
    const updatedFeatures = [...features];
    updatedFeatures[index] = { ...updatedFeatures[index], imageUrl };
    onDataUpdate({ ...data, features: updatedFeatures });
  };

  const gridCols = features.length === 3 ? "grid-cols-3" : "grid-cols-4";

  return (
    <div className="absolute inset-0 bg-[#0B0F19] text-white flex flex-col p-16 select-none overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.06),transparent_60%)] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 mb-6 shrink-0">
        <p className="text-[#8B5CF6] text-xs font-semibold tracking-widest uppercase mb-2">{badge}</p>
        <h2 className="text-4xl font-bold text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-[#94A3B8] text-sm mt-1">{subtitle}</p>}
      </div>

      {/* Features Grid Centered */}
      <div className="flex-1 flex flex-col justify-center relative z-10">
        <div className={`grid ${gridCols} gap-6`}>
          {features.map(({ iconName, title, desc, imageUrl }: any, idx: number) => (
            <div
              key={title}
              className="flex flex-col justify-between p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-[#22D3EE]/45 hover:bg-white/[0.05] transition-all duration-300"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <ImagePlaceholder
                    imageUrl={imageUrl}
                    onImageUpload={onDataUpdate ? (url) => handleFeatureImageUpload(idx, url) : undefined}
                    fallbackIcon={
                      <div className="w-full h-full rounded-xl bg-[#22D3EE]/10 border border-[#22D3EE]/20 flex items-center justify-center">
                        <DynamicIcon name={iconName} size={22} className="text-[#22D3EE]" />
                      </div>
                    }
                    className="w-12 h-12 rounded-xl overflow-hidden shadow-lg"
                    variant="icon"
                  />
                </div>
                <p className="text-white font-bold text-lg mb-2">{title}</p>
                <p className="text-[#94A3B8] text-xs leading-relaxed">{desc}</p>
              </div>
              
              <div className="mt-8 border-t border-white/[0.04] pt-4 text-[10px] font-mono text-[#22D3EE]/60 uppercase tracking-widest">
                Production Ready
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
