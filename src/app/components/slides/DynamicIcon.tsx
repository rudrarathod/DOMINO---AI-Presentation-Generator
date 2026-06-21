import React from "react";
import * as LucideIcons from "lucide-react";

export function DynamicIcon({ name, className, size = 16 }: { name?: string; className?: string; size?: number }) {
  if (!name) return <LucideIcons.Sparkles className={className} size={size} />;
  
  const cleanName = name
    .toLowerCase()
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  const mappings: Record<string, string> = {
    "Barchart": "BarChart3",
    "Barchart3": "BarChart3",
    "Chart": "BarChart3",
    "People": "Users",
    "Graph": "TrendingUp",
    "Analytics": "TrendingUp",
    "Shield": "Shield",
    "Security": "Shield",
    "Play": "Play",
    "Leaf": "Leaf",
    "Globe": "Globe",
    "Cpu": "Cpu",
    "Zap": "Zap",
    "Rocket": "Rocket",
    "Briefcase": "Briefcase",
    "Bookopen": "BookOpen",
    "Megaphone": "Megaphone",
    "Check": "Check",
    "Sparkles": "Sparkles",
  };

  const resolvedName = mappings[cleanName] || cleanName;
  const IconComponent = (LucideIcons as any)[resolvedName] || (LucideIcons as any)[cleanName] || LucideIcons.Sparkles;
  
  return <IconComponent className={className} size={size} />;
}
