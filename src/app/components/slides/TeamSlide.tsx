import React from "react";
import { ImagePlaceholder } from "./ImagePlaceholder";

export function TeamSlide({ data, onDataUpdate }: { data?: any; onDataUpdate?: (newData: any) => void }) {
  const badge = data?.badge || "12 · Leadership";
  const title = data?.title || "Leadership Team";
  const members = data?.members || [
    { name: "Sarah Jenkins", role: "CEO & Co-founder\nFounder, ex-Google Security", bg: "from-[#8B5CF6] to-[#22D3EE]", initials: "SJ" },
    { name: "David Chen", role: "CTO & Co-founder\nInfrastructure, ex-Stripe Staff", bg: "from-[#22D3EE] to-blue-600", initials: "DC" },
    { name: "Elena Rostova", role: "Head of Product\nex-Slack Designer", bg: "from-[#10B981] to-[#22D3EE]", initials: "ER" },
    { name: "Marcus Vance", role: "Principal Engineer\nOpen Source Contributor", bg: "from-amber-500 to-orange-600", initials: "MV" },
  ];

  const handleMemberImageUpload = (index: number, imageUrl: string) => {
    if (!onDataUpdate) return;
    const updatedMembers = [...members];
    updatedMembers[index] = { ...updatedMembers[index], imageUrl };
    onDataUpdate({ ...data, members: updatedMembers });
  };

  return (
    <div className="absolute inset-0 bg-[#0B0F19] text-white flex flex-col p-16 select-none overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.06),transparent_60%)] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 mb-6 shrink-0">
        <p className="text-[#8B5CF6] text-xs font-semibold tracking-widest uppercase mb-2">{badge}</p>
        <h2 className="text-4xl font-bold text-white tracking-tight">{title}</h2>
      </div>

      {/* Team Cards Grid Centered */}
      <div className="flex-1 flex flex-col justify-center relative z-10">
        <div className="grid grid-cols-4 gap-6">
          {members.map(({ name, role, bg, initials, imageUrl }: any, idx: number) => (
            <div
              key={name}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-[#8B5CF6]/40 hover:bg-white/[0.05] transition-all duration-300"
            >
              <div className="relative mb-5">
                <ImagePlaceholder
                  imageUrl={imageUrl}
                  onImageUpload={onDataUpdate ? (url) => handleMemberImageUpload(idx, url) : undefined}
                  fallbackIcon={
                    <div className={`w-full h-full rounded-2xl bg-gradient-to-br ${bg} flex items-center justify-center shadow-lg shadow-black/35`}>
                      <span className="text-white font-extrabold text-lg tracking-wider">{initials}</span>
                    </div>
                  }
                  className="w-20 h-20 rounded-2xl overflow-hidden shadow-xl"
                  variant="avatar"
                />
              </div>
              
              <p className="text-white text-base font-bold leading-tight mb-2">{name}</p>
              <p className="text-[#94A3B8] text-xs leading-relaxed whitespace-pre-line">{role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
