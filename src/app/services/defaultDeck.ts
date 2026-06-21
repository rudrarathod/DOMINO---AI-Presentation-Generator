import { Slide } from "./ai";

export const DEFAULT_SLIDES: Omit<Slide, "id">[] = [
  {
    name: "Cover",
    type: "cover",
    color: "from-slate-900 to-indigo-950",
    data: {
      tagline: "Enterprise AI Solutions",
      title: "Autonomous Data Intelligence",
      subtitle: "Next-generation pipeline automation for cloud-native infrastructures.",
      stats: [
        { value: "99.99%", label: "Uptime" },
        { value: "85%", label: "Faster Processing" },
        { value: "4.2B", label: "Events Processed" }
      ],
      demoTitle: "AI Network Preview",
      bottomStats: [
        { iconName: "zap", label: "Automation Engine", val: "Active" },
        { iconName: "shield", label: "Data Security", val: "Enterprise Ready" },
        { iconName: "trending-up", label: "Efficiency Gain", val: "+85% YoY" }
      ]
    }
  },
  {
    name: "Summary",
    type: "generic",
    color: "from-slate-900 to-indigo-950",
    data: {
      badge: "02 · Executive Summary",
      title: "Strategic Overview",
      layout: "grid",
      bullets: [
        { title: "Mission", desc: "Transform enterprise data operations using autonomous intelligence.", iconName: "target" },
        { title: "Product", desc: "AI-powered infrastructure optimization platform.", iconName: "cpu" },
        { title: "Market", desc: "$10.4B global opportunity.", iconName: "globe" },
        { title: "Growth", desc: "Rapid enterprise adoption.", iconName: "trending-up" },
        { title: "Advantage", desc: "High-performance automation with low latency.", iconName: "zap" }
      ]
    }
  },
  {
    name: "Problem",
    type: "problem",
    color: "from-slate-900 to-indigo-950",
    data: {
      badge: "03 · Problem",
      title: "System Latency & Outages",
      cards: [
        { title: "Database Bottleneck", desc: "Unstructured Data Overload leads to 92% CPU load.", pct: "92%" },
        { title: "API Response Lag", desc: "Response times spiked to 8.2 seconds.", pct: "8.2s" },
        { title: "Data Loss", desc: "4.1% packet drops across international clusters.", pct: "4.1%" }
      ]
    }
  },
  {
    name: "Solution",
    type: "solution",
    color: "from-slate-900 to-indigo-950",
    data: {
      badge: "04 · Solution",
      title: "Optimal & Optimized",
      cards: [
        { iconName: "zap", title: "99.99% Guaranteed Uptime", desc: "Automated failovers and cluster health healing." },
        { iconName: "trending-up", title: "85% Latency Reduction", desc: "Parser indexing pipelines optimize query paths." },
        { iconName: "cpu", title: "Enterprise Performance Optimization", desc: "Seamless scaling across cloud-native architectures." }
      ],
      demoTitle: "Raw Unstructured Data ➔ Parser ➔ Indexed SQL Queries"
    }
  },
  {
    name: "Overview",
    type: "generic",
    color: "from-slate-900 to-indigo-950",
    data: {
      badge: "05 · Platform Architecture",
      title: "Platform Overview",
      layout: "list",
      bullets: [
        { title: "Data Ingestion Layer", desc: "Ingests raw, unstructured enterprise streams at scale.", iconName: "arrow-down" },
        { title: "AI Processing Layer", desc: "Applies deep learning models for classification.", iconName: "cpu" },
        { title: "Automation Engine", desc: "Orchestrates database indexing and system optimizations.", iconName: "settings" },
        { title: "Analytics & Reporting Layer", desc: "Delivers operational metrics in real-time dashboards.", iconName: "bar-chart" }
      ]
    }
  },
  {
    name: "Features",
    type: "product",
    color: "from-slate-900 to-indigo-950",
    data: {
      badge: "06 · Features",
      title: "Core Product Features",
      subtitle: "High-performance automation built for scale.",
      features: [
        { iconName: "refresh-cw", title: "Instant Sync", desc: "Real-time data synchronization." },
        { iconName: "shield", title: "AI Guard", desc: "Intelligent threat monitoring and protection." },
        { iconName: "cpu", title: "Multi-Tenant API", desc: "Scalable enterprise integrations." }
      ]
    }
  },
  {
    name: "Market",
    type: "market",
    color: "from-slate-900 to-indigo-950",
    data: {
      badge: "07 · Market Opportunity",
      title: "Total Addressable Market",
      cards: [
        { label: "TAM", value: "$10.4B", desc: "Total Addressable Market", color: "violet" },
        { label: "SAM", value: "$3.2B", desc: "Serviceable Addressable Market", color: "indigo" },
        { label: "SOM", value: "$850M", desc: "Serviceable Obtainable Market", color: "blue" }
      ]
    }
  },
  {
    name: "Business Model",
    type: "business_model",
    color: "from-slate-900 to-indigo-950",
    data: {
      badge: "08 · Business Model",
      title: "Business Model",
      tiers: [
        { tier: "Developer", price: "$0/month", desc: "1 User · Core Modules" },
        { tier: "Pro", price: "$79/month", desc: "10 Users · Custom APIs · SLA Support" },
        { tier: "Enterprise", price: "Custom Pricing", desc: "Unlimited Users · Dedicated Infrastructure" }
      ]
    }
  },
  {
    name: "Competition",
    type: "competition",
    color: "from-slate-900 to-indigo-950",
    data: {
      badge: "09 · Competitive Analysis",
      title: "Competitive Advantage",
      headers: ["Feature", "Aegis Flow", "Standard Inc.", "Legacy Corp"],
      rows: [
        ["Zero-Knowledge Encryption", true, false, false],
        ["Under 10ms Latency", true, false, false],
        ["Self-Hosted Nodes", true, true, false],
        ["Custom Dashboards", true, true, true]
      ]
    }
  },
  {
    name: "Financials",
    type: "financials",
    color: "from-slate-900 to-indigo-950",
    data: {
      badge: "10 · Financial Projections",
      title: "Financial Growth & Performance",
      metrics: [
        { label: "Revenue Goal", value: "$5M ARR", growth: "By Q4 Next Year" },
        { label: "ARR Growth", value: "+142% YoY", growth: "High momentum adoption" },
        { label: "LTV/CAC", value: "4.5×", growth: "Efficient acquisition loop" },
        { label: "Gross Margin", value: "87.2%", growth: "Premium SaaS unit economics" }
      ],
      chartTitle: "Quarterly Revenue Forecast to $5M ARR"
    }
  },
  {
    name: "Roadmap",
    type: "roadmap",
    color: "from-slate-900 to-indigo-950",
    data: {
      badge: "11 · Roadmap",
      title: "Product Roadmap",
      milestones: [
        { q: "Phase 1", title: "Alpha Core MVP Engine", desc: "Completed core parser mechanics", done: true },
        { q: "Phase 2", title: "API Integration", desc: "In Progress: Marketplace modules", done: true },
        { q: "Phase 3", title: "Multi-region Scale", desc: "Planned: Scaling enterprise clusters", done: false },
        { q: "Phase 4", title: "Global Edge Network", desc: "Future: Distributed edge launch", done: false }
      ]
    }
  },
  {
    name: "Team",
    type: "team",
    color: "from-slate-900 to-indigo-950",
    data: {
      badge: "12 · Team",
      title: "Leadership Team",
      members: [
        { name: "Sarah Jenkins", role: "CEO & Co-founder\nFounder, ex-Google Security", bg: "from-violet-500 to-indigo-600", initials: "SJ" },
        { name: "David Chen", role: "CTO & Co-founder\nInfrastructure, ex-Stripe Staff", bg: "from-blue-500 to-cyan-600", initials: "DC" },
        { name: "Elena Rostova", role: "Head of Product\nex-Slack Designer", bg: "from-emerald-500 to-teal-600", initials: "ER" },
        { name: "Marcus Vance", role: "Principal Engineer\nOpen Source Contributor", bg: "from-amber-500 to-orange-600", initials: "MV" }
      ]
    }
  },
  {
    name: "Call to Action",
    type: "generic",
    color: "from-slate-900 to-indigo-950",
    data: {
      badge: "13 · Call to Action",
      title: "Transform Enterprise Intelligence",
      layout: "list",
      bullets: [
        { title: "Build Faster. Scale Smarter. Operate Autonomously.", desc: "Deploy in minutes with cloud-native automation modules.", iconName: "rocket" },
        { title: "Request a Demo", desc: "Schedule a custom session with our solutions engineering team.", iconName: "arrow-right" },
        { title: "Enterprise Ready", desc: "99.99% Uptime, SOC2 compliant, 85% processing speed lift.", iconName: "shield" }
      ]
    }
  }
];
