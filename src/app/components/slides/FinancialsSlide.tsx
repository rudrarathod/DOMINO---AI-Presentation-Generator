import React from "react";
import { DynamicIcon } from "./DynamicIcon";

export function FinancialsSlide({ data }: { data?: any }) {
  const badge = data?.badge || "10 · Financial Projections";
  const title = data?.title || "Financial Growth & Performance";
  const metrics = data?.metrics || [
    { label: "Revenue Goal", value: "$5M ARR", growth: "By Q4 Next Year" },
    { label: "ARR Growth", value: "+142% YoY", growth: "High momentum adoption" },
    { label: "LTV/CAC", value: "4.5×", growth: "Efficient acquisition loop" },
    { label: "Gross Margin", value: "87.2%", growth: "Premium SaaS unit economics" },
  ];
  const chartTitle = data?.chartTitle || "Quarterly Revenue Forecast to $5M ARR";

  return (
    <div className="absolute inset-0 bg-[#0B0F19] text-white flex flex-col p-16 select-none overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.06),transparent_60%)] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 mb-6 shrink-0">
        <p className="text-[#10B981] text-xs font-semibold tracking-widest uppercase mb-2">{badge}</p>
        <h2 className="text-4xl font-bold text-white tracking-tight">{title}</h2>
      </div>

      {/* Main Split Content Centered */}
      <div className="flex-1 flex flex-col justify-center relative z-10">
        <div className="grid grid-cols-12 gap-8 items-center">
          {/* Left Side: Financial Metric Blocks */}
          <div className="col-span-6 grid grid-cols-2 gap-4">
            {metrics.map(({ label, value, growth }: any) => (
              <div
                key={label}
                className="flex flex-col justify-between p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-[#10B981]/45 transition-colors"
              >
                <div>
                  <p className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wider mb-2">{label}</p>
                  <p className="text-2xl font-extrabold text-white tracking-tight">{value}</p>
                </div>
                <p className="text-[#10B981] text-[10px] font-mono mt-4 font-semibold uppercase tracking-wider">{growth}</p>
              </div>
            ))}
          </div>

          {/* Right Side: Projections Chart Viewport */}
          <div className="col-span-6 h-[260px] rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col items-center justify-center p-8 text-center hover:border-white/[0.12] transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center mb-4">
              <DynamicIcon name="bar-chart" size={28} className="text-[#10B981]" />
            </div>
            <p className="text-white font-bold text-base mb-1">{chartTitle}</p>
            <p className="text-[#94A3B8] text-xs max-w-[280px] leading-relaxed">
              Revenue forecasting model demonstrating 142% Year-over-Year scaling.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
