import React from "react";
import { Check, X } from "lucide-react";

export function CompetitionSlide({ data }: { data?: any }) {
  const badge = data?.badge || "09 · Competitive Analysis";
  const title = data?.title || "Competitive Advantage";
  const headers = data?.headers || ["Feature", "Aegis Flow", "Standard Inc.", "Legacy Corp"];
  const rows = data?.rows || [
    ["Zero-Knowledge Encryption", true, false, false],
    ["Under 10ms Latency", true, false, false],
    ["Self-Hosted Nodes", true, true, false],
    ["Custom Dashboards", true, true, true],
  ];

  return (
    <div className="absolute inset-0 bg-[#0B0F19] text-white flex flex-col p-16 select-none overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.06),transparent_60%)] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 mb-6 shrink-0">
        <p className="text-[#22D3EE] text-xs font-semibold tracking-widest uppercase mb-2">{badge}</p>
        <h2 className="text-4xl font-bold text-white tracking-tight">{title}</h2>
      </div>

      {/* Table Container Centered */}
      <div className="flex-1 flex flex-col justify-center relative z-10">
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08]">
                {headers.map((h: string, idx: number) => {
                  const isUs = h.toLowerCase().includes("aegis");
                  return (
                    <th
                      key={h}
                      className={`pb-5 text-sm font-bold text-left tracking-wider uppercase ${
                        idx === 0
                          ? "text-[#94A3B8]"
                          : isUs
                          ? "text-[#22D3EE]"
                          : "text-white/40"
                      }`}
                    >
                      {h}
                    </th>
                  );
                })}
              </tr>
            </thead>
            
            <tbody className="divide-y divide-white/[0.04]">
              {rows.map(([feature, ...values]: any) => (
                <tr key={feature} className="hover:bg-white/[0.01] transition-colors">
                  <td className="py-4.5 text-white/90 text-sm font-semibold">{feature}</td>
                  {values.map((v: boolean, idx: number) => {
                    const isUs = idx === 0;
                    return (
                      <td key={idx} className="py-4.5">
                        <div className="flex items-center">
                          {v ? (
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              isUs ? "bg-[#22D3EE]/15 border border-[#22D3EE]/30" : "bg-white/[0.04] border border-white/[0.08]"
                            }`}>
                              <Check size={12} className={isUs ? "text-[#22D3EE]" : "text-white/40"} />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-white/[0.02] border border-white/[0.04]">
                              <X size={10} className="text-white/10" />
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
