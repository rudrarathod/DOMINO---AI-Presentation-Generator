import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { getApiKey, Slide } from "../services/ai";
import { getUser, setUser as setSavedUser } from "../services/auth";
import { isLimitReached, getRemainingGenerations, getGenerationsUsed, hasCustomApiKey, saveCustomApiKey } from "../services/usage";
import ApiKeyLimitModal from "../components/ApiKeyLimitModal";
import {
  Search,
  Plus,
  Sparkles,
  ArrowUp,
  FileText,
  Settings,
  ChevronRight,
  Menu,
  X,
  Clock,
  LayoutTemplate,
  Zap,
  TrendingUp,
  BookOpen,
  Megaphone,
  Rocket,
  Briefcase,
  PanelLeftClose,
  PanelLeftOpen,
  User,
  Cpu,
  Check,
  ChevronDown,
  LogOut,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router";

export interface Presentation {
  id: string;
  title: string;
  slides: Slide[];
  updatedAt: string;
  aspectRatio: string;
  iconName: string;
}

function getRelativeTime(dateString: string): string {
  try {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays}d ago`;
  } catch (e) {
    return "Recent";
  }
}

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  zap: Zap,
  rocket: Rocket,
  "trending-up": TrendingUp,
  "layout-template": LayoutTemplate,
  megaphone: Megaphone,
  briefcase: Briefcase,
  "book-open": BookOpen,
  sparkles: Sparkles,
};



const suggestions = [
  { label: "Startup Pitch", icon: Rocket },
  { label: "Investor Deck", icon: TrendingUp },
  { label: "Business Proposal", icon: Briefcase },
  { label: "College Project", icon: BookOpen },
  { label: "Marketing Plan", icon: Megaphone },
  { label: "Product Launch", icon: Zap },
];

const mList = [
  { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B", speed: "280 T/s", cost: "High" },
  { id: "meta-llama/llama-4-scout-17b-16e-instruct", name: "Llama 4 Scout", speed: "750 T/s", cost: "Low-Mid" },
  { id: "openai/gpt-oss-120b", name: "GPT-OSS 120B", speed: "500 T/s", cost: "High" },
  { id: "qwen/qwen3-32b", name: "Qwen 3 32B", speed: "400 T/s", cost: "Medium" },
  { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B", speed: "560 T/s", cost: "Low" },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

import { DEFAULT_SLIDES } from "../services/defaultDeck";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] } },
};

export default function HomeScreen() {
  const [presentations, setPresentations] = useState<any[]>(() => {
    const saved = localStorage.getItem("domino_presentations");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    // Seed default pitch deck presentation
    const seedDeck = {
      id: "seed-deck-investor-intelligence",
      title: "Autonomous Data Intelligence",
      updatedAt: new Date().toISOString(),
      aspectRatio: "16:9",
      iconName: "sparkles",
      slides: DEFAULT_SLIDES.map((s, idx) => ({
        id: `mock-${idx + 1}`,
        name: s.name,
        type: s.type,
        color: s.color,
        data: s.data,
      }))
    };
    const initialDecks = [seedDeck];
    localStorage.setItem("domino_presentations", JSON.stringify(initialDecks));
    return initialDecks;
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [prompt, setPrompt] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [slideCount, setSlideCount] = useState("Auto");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [slidePickerOpen, setSlidePickerOpen] = useState(false);
  const [ratioPickerOpen, setRatioPickerOpen] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [model, setModel] = useState(() => localStorage.getItem("lumina_model") || "llama-3.3-70b-versatile");
  const [modelPickerOpen, setModelPickerOpen] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = (customPrompt?: string) => {
    const finalPrompt = (customPrompt || prompt).trim();
    if (!finalPrompt) return;

    if (isLimitReached()) {
      setApiKeyModalOpen(true);
      return;
    }

    const key = getApiKey();
    if (!key) {
      toast.error("Groq API Key is required. Please set it in Settings.");
      setSettingsOpen(true);
      return;
    }

    navigate("/builder", {
      state: {
        prompt: finalPrompt,
        slideCount,
        aspectRatio,
      },
    });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative z-30 lg:z-auto inset-y-0 left-0
          w-[260px] flex flex-col h-full
          bg-[#0e0e10] border-r border-border
          transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${!desktopSidebarOpen ? "lg:w-0 lg:overflow-hidden lg:border-r-0" : ""}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Sparkles size={15} className="text-white" />
            </div>
            <span className="text-base font-semibold tracking-tight text-foreground">DOMINO</span>
          </div>
          <button
            className="lg:hidden p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* New Presentation */}
        {/* <div className="px-3 py-3">
          <button
            onClick={() => navigate("/builder")}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-medium transition-all duration-200 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus size={16} />
            New Presentation
          </button>
        </div> */}

        {/* Search */}
        <div className="px-3 pb-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search presentations..."
              className="w-full bg-muted/60 border border-border rounded-lg pl-8 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
          </div>
        </div>

        {/* Recents */}
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest px-1 mb-2">
            Recent
          </p>
          <nav className="space-y-0.5">
            {presentations.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())).map((item, i) => {
              const IconComponent = ICON_MAP[item.iconName] || FileText;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  onClick={() => navigate("/builder", { state: { presentationId: item.id } })}
                  className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-left hover:bg-muted/60 group cursor-pointer transition-all duration-150 relative"
                >
                  <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center shrink-0 group-hover:bg-violet-500/10 transition-colors">
                    <IconComponent size={13} className="text-muted-foreground group-hover:text-violet-400 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate leading-tight group-hover:pr-6">{item.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock size={10} />
                      {getRelativeTime(item.updatedAt)}
                    </p>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const updated = presentations.filter(p => p.id !== item.id);
                      setPresentations(updated);
                      localStorage.setItem("domino_presentations", JSON.stringify(updated));
                      toast.success("Presentation deleted");
                    }}
                    className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-500/10 text-muted-foreground hover:text-rose-400 transition-all z-10 animate-fade-in"
                    title="Delete presentation"
                  >
                    <Trash2 size={12} />
                  </button>
                </motion.div>
              );
            })}
            {presentations.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
              <p className="text-xs text-muted-foreground px-2 py-4">No presentations found</p>
            )}
          </nav>
        </div>

        {/* Free Generation Usage Progress in Sidebar */}
        <div className="px-4 py-3 border-t border-border bg-white/[0.01]">
          {(() => {
            const customKey = hasCustomApiKey();
            const used = getGenerationsUsed();
            const pct = Math.min(100, (used / 5) * 100);
            return (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground font-medium">AI Generation Usage</span>
                  <span className={`font-mono font-semibold ${customKey ? "text-emerald-400" : used >= 5 ? "text-rose-400 animate-pulse" : "text-violet-300"}`}>
                    {customKey ? "Unlimited" : `${used} / 5`}
                  </span>
                </div>
                {!customKey && (
                  <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden border border-white/[0.02]">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ease-out ${
                        used >= 5 
                          ? "bg-rose-500" 
                          : used >= 4 
                            ? "bg-amber-500" 
                            : "bg-gradient-to-r from-violet-500 to-indigo-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                )}
                {used >= 5 && !customKey && (
                  <button 
                    onClick={() => setApiKeyModalOpen(true)}
                    className="w-full text-center text-[10px] text-violet-400 hover:text-violet-300 transition-colors font-medium mt-1 block"
                  >
                    Enter API Key to unlock ↗
                  </button>
                )}
              </div>
            );
          })()}
        </div>

        {/* User profile */}
        <div className="px-3 py-3 border-t border-border">
          {(() => {
            const user = getUser() || { name: "Dev User", email: "dev@domino.app", initials: "DU", picture: undefined };
            return (
              <div
                className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted/60 cursor-pointer transition-colors group"
                onClick={() => setSettingsOpen(true)}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0 overflow-hidden shadow">
                  {user.picture ? (
                    <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-semibold text-white">{user.initials}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <Settings size={14} className="text-muted-foreground/60 group-hover:text-muted-foreground transition-colors shrink-0" />
              </div>
            );
          })()}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden min-w-0">
        {/* Mobile menu button */}
        <button
          className="absolute top-4 left-4 lg:hidden z-10 p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={18} />
        </button>

        {/* Desktop sidebar toggle */}
        <button
          className="absolute top-4 left-4 hidden lg:flex z-10 p-2 rounded-lg bg-card/80 border border-border text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all backdrop-blur-sm"
          onClick={() => setDesktopSidebarOpen((o) => !o)}
          title={desktopSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {desktopSidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
        </button>

        {/* Ambient glow orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-600/8 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[300px] bg-indigo-600/6 rounded-full blur-[80px]" />
        </div>

        <motion.div
          className="relative z-10 w-full max-w-2xl px-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Heading */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            {(() => {
              const customKey = hasCustomApiKey();
              const remaining = getRemainingGenerations();
              const used = getGenerationsUsed();
              return (
                <div 
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-medium mb-5 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all ${
                    customKey 
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                      : remaining === 0 
                        ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                        : "bg-violet-500/10 border-violet-500/20 text-violet-400"
                  }`}
                  onClick={() => customKey ? setSettingsOpen(true) : setApiKeyModalOpen(true)}
                  title={customKey ? "You are using your own API Key" : "Click to enter custom API key"}
                >
                  <Sparkles size={12} />
                  {customKey ? (
                    "Unlimited Generations (Your API Key)"
                  ) : (
                    `${remaining} of 5 Free Generations Left`
                  )}
                </div>
              );
            })()}
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-[1.1] mb-4">
              Create Beautiful
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Presentations with AI
              </span>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              Describe your idea and turn it into a professional presentation.
            </p>
          </motion.div>

          {/* Prompt textarea */}
          <motion.div variants={itemVariants} className="relative mb-4">
            <div className="relative rounded-2xl border border-border bg-card/80 backdrop-blur-sm shadow-2xl shadow-black/40 focus-within:border-primary/40 focus-within:shadow-violet-500/10 transition-all duration-300">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
                placeholder="Create a 12-slide investor pitch deck for an AI startup... (Cmd+Enter to generate)"
                className="w-full bg-transparent px-5 pt-4 pb-14 text-sm text-foreground placeholder:text-muted-foreground/70 resize-none focus:outline-none min-h-[140px] leading-relaxed"
                rows={4}
              />
              <div className="absolute bottom-3 left-4 right-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Slide count picker */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => { setSlidePickerOpen((o) => !o); setRatioPickerOpen(false); setModelPickerOpen(false); }}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs transition-all ${slidePickerOpen ? "bg-violet-500/10 border-violet-500/40 text-violet-300" : "bg-muted/60 border-border text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      <FileText size={11} />
                      <span>{slideCount === "Auto" ? "Auto slides" : `${slideCount} slides`}</span>
                      <ChevronDown size={10} className={`transition-transform duration-200 ${slidePickerOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {slidePickerOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 4, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.97 }}
                          transition={{ duration: 0.14 }}
                          className="absolute bottom-full left-0 mb-2 w-32 rounded-xl border border-border bg-[#1a1a1d] shadow-xl shadow-black/60 overflow-hidden z-20"
                        >
                          {["Auto", "8", "10", "12", "16", "20"].map((opt) => (
                            <button
                              key={opt}
                              onClick={() => { setSlideCount(opt); setSlidePickerOpen(false); }}
                              className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${slideCount === opt ? "text-violet-300 bg-violet-500/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                }`}
                            >
                              <span>{opt === "Auto" ? "Auto" : `${opt} slides`}</span>
                              {slideCount === opt && <Check size={11} className="text-violet-400" />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Aspect ratio picker */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => { setRatioPickerOpen((o) => !o); setSlidePickerOpen(false); setModelPickerOpen(false); }}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs transition-all ${ratioPickerOpen ? "bg-violet-500/10 border-violet-500/40 text-violet-300" : "bg-muted/60 border-border text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      <LayoutTemplate size={11} />
                      <span>{aspectRatio}</span>
                      <ChevronDown size={10} className={`transition-transform duration-200 ${ratioPickerOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {ratioPickerOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 4, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.97 }}
                          transition={{ duration: 0.14 }}
                          className="absolute bottom-full left-0 mb-2 w-36 rounded-xl border border-border bg-[#1a1a1d] shadow-xl shadow-black/60 overflow-hidden z-20"
                        >
                          {[
                            { value: "16:9", label: "16:9 — Widescreen" },
                            { value: "4:3", label: "4:3 — Standard" },
                            { value: "1:1", label: "1:1 — Square" },
                          ].map(({ value, label }) => (
                            <button
                              key={value}
                              onClick={() => { setAspectRatio(value); setRatioPickerOpen(false); }}
                              className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${aspectRatio === value ? "text-violet-300 bg-violet-500/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                }`}
                            >
                              <span>{label}</span>
                              {aspectRatio === value && <Check size={11} className="text-violet-400" />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Model selector dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => { setModelPickerOpen((o) => !o); setSlidePickerOpen(false); setRatioPickerOpen(false); }}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs transition-all ${modelPickerOpen ? "bg-violet-500/10 border-violet-500/40 text-violet-300" : "bg-muted/60 border-border text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      <Cpu size={11} />
                      <span>{mList.find(m => m.id === model)?.name || "Llama 3.3 70B"}</span>
                      <ChevronDown size={10} className={`transition-transform duration-200 ${modelPickerOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {modelPickerOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 4, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.97 }}
                          transition={{ duration: 0.14 }}
                          className="absolute bottom-full left-0 mb-2 w-52 rounded-xl border border-border bg-[#1a1a1d] shadow-xl shadow-black/60 overflow-hidden z-20"
                        >
                          {mList.map((m) => (
                            <button
                              key={m.id}
                              onClick={() => {
                                setModel(m.id);
                                localStorage.setItem("lumina_model", m.id);
                                setModelPickerOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${model === m.id ? "text-violet-300 bg-violet-500/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                }`}
                            >
                              <div className="flex flex-col min-w-0">
                                <span className="font-semibold truncate">{m.name}</span>
                                <span className="text-[9px] text-muted-foreground/85 font-mono mt-0.5">{m.speed} · {m.cost} Cost</span>
                              </div>
                              {model === m.id && <Check size={11} className="text-violet-400 shrink-0" />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleGenerate()}
                  className={`
                    w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200
                    ${prompt.trim()
                      ? "bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/30 text-white cursor-pointer"
                      : "bg-muted/60 text-muted-foreground/40 cursor-not-allowed"
                    }
                  `}
                >
                  <ArrowUp size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Suggestion chips */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-2 justify-center">
            {suggestions.map(({ label, icon: Icon }) => (
              <motion.button
                key={label}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setPrompt(`Create a professional ${label.toLowerCase()} presentation`);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-border bg-card/60 backdrop-blur-sm text-sm text-muted-foreground hover:text-foreground hover:border-violet-500/40 hover:bg-violet-500/5 hover:shadow-sm hover:shadow-violet-500/10 transition-all duration-200"
              >
                <Icon size={13} />
                {label}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </main>

      {/* Settings modal */}
      <AnimatePresence>
        {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} model={model} setModel={setModel} />}
      </AnimatePresence>

      {/* API Key Limit Modal */}
      <AnimatePresence>
        {apiKeyModalOpen && (
          <ApiKeyLimitModal
            onClose={() => setApiKeyModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

type SettingsTab = "account" | "ai";

function SettingsModal({ onClose, model, setModel }: { onClose: () => void; model: string; setModel: (m: string) => void }) {
  const [tab, setTab] = useState<SettingsTab>("account");
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("lumina_api_key") || "");
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [tempModel, setTempModel] = useState(model);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveCustomApiKey(apiKey).catch(e => console.error("Failed to sync API key:", e));
    localStorage.setItem("lumina_model", tempModel);
    setModel(tempModel);
    setSaved(true);
    toast.success("Settings saved!");
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
        className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-[#0e0e10] shadow-2xl shadow-black/60 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Settings size={13} className="text-white" />
            </div>
            <p className="text-sm font-semibold text-foreground">Settings</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
          >
            <X size={15} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-5 pb-4">
          {([
            { id: "account", label: "Account", icon: User },
            { id: "ai", label: "AI", icon: Cpu },
          ] as { id: SettingsTab; label: string; icon: React.ElementType }[]).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${tab === id
                  ? "bg-violet-500/10 text-violet-300 border border-violet-500/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent"
                }`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-border mx-5" />

        {/* Content */}
        <div className="px-5 py-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              {tab === "account" && (
                <div className="space-y-4">
                  {/* User card */}
                  {(() => {
                    const user = getUser() || { name: "Dev User", email: "dev@domino.app", initials: "DU", picture: undefined };
                    return (
                      <div className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/30 border border-border">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-md shadow-violet-500/20 overflow-hidden">
                          {user.picture ? (
                            <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-sm font-bold text-white">{user.initials}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                        <span className="text-[10px] px-2 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 font-medium shrink-0">
                          Pro
                        </span>
                      </div>
                    );
                  })()}


                  {/* Sign out */}
                  <div className="pt-1">
                    <button
                      onClick={() => {
                        setSavedUser(null);
                        window.location.reload();
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 hover:border-red-500/30 text-sm font-medium transition-all"
                    >
                      <LogOut size={14} />
                      Sign out of all devices
                    </button>
                  </div>
                </div>
              )}

              {tab === "ai" && (
                <div className="space-y-5">
                  {/* API key */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Groq API Key</p>
                      <a
                        href="https://console.groq.com/keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-violet-400 hover:text-violet-300 transition-colors"
                      >
                        console.groq.com ↗
                      </a>
                    </div>
                    <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-muted/40 border border-border focus-within:border-violet-500/40 transition-all">
                      <Cpu size={13} className="text-muted-foreground shrink-0" />
                      <input
                        type={apiKeyVisible ? "text" : "password"}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="gsk_..."
                        className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none font-mono min-w-0"
                      />
                      <button
                        onClick={() => setApiKeyVisible((v) => !v)}
                        className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                      >
                        {apiKeyVisible ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1.5">
                      Stored locally in your browser. Never sent to our servers.
                    </p>
                  </div>

                  {/* Model selector */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2.5">Model</p>
                    <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                      {[
                        { 
                          id: "llama-3.3-70b-versatile", 
                          name: "Llama 3.3 70B", 
                          speed: "280 T/s", 
                          cost: "High", 
                          costColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
                          limit: "300K TPM · 1K RPM", 
                          desc: "Best quality, rich layout reasoning & formatting." 
                        },
                        { 
                          id: "meta-llama/llama-4-scout-17b-16e-instruct", 
                          name: "Llama 4 Scout 17B (Preview)", 
                          speed: "750 T/s", 
                          cost: "Low-Mid", 
                          costColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
                          limit: "300K TPM · 1K RPM", 
                          desc: "Next-gen preview model, blazingly fast." 
                        },
                        { 
                          id: "openai/gpt-oss-120b", 
                          name: "GPT-OSS 120B", 
                          speed: "500 T/s", 
                          cost: "High", 
                          costColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
                          limit: "250K TPM · 1K RPM", 
                          desc: "Flagship open-weight model with high reasoning capacity." 
                        },
                        { 
                          id: "qwen/qwen3-32b", 
                          name: "Qwen 3 32B (Preview)", 
                          speed: "400 T/s", 
                          cost: "Medium", 
                          costColor: "text-violet-400 bg-violet-500/10 border-violet-500/20",
                          limit: "300K TPM · 1K RPM", 
                          desc: "Alibaba Cloud's highly capable multilingual model." 
                        },
                        { 
                          id: "llama-3.1-8b-instant", 
                          name: "Llama 3.1 8B", 
                          speed: "560 T/s", 
                          cost: "Low", 
                          costColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                          limit: "250K TPM · 1K RPM", 
                          desc: "Ultra fast, lightweight, and highly cost-efficient." 
                        },
                      ].map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setTempModel(m.id)}
                          className={`w-full flex items-start gap-3 px-3.5 py-3 rounded-xl border text-left transition-all ${
                            tempModel === m.id
                              ? "border-violet-500/40 bg-violet-500/8"
                              : "border-border hover:bg-muted/30"
                          }`}
                        >
                          <div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center mt-0.5 ${
                            tempModel === m.id ? "border-violet-500 bg-violet-500" : "border-muted-foreground/40"
                          }`}>
                            {tempModel === m.id && <div className="w-1 h-1 rounded-full bg-white" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-0.5">
                              <p className="text-sm font-semibold text-foreground truncate">{m.name}</p>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground">
                                  {m.speed}
                                </span>
                                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${m.costColor}`}>
                                  {m.cost}
                                </span>
                              </div>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-relaxed mb-1">{m.desc}</p>
                            <p className="text-[9px] font-mono text-muted-foreground/60">Limits: {m.limit}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 pb-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${saved
                ? "bg-emerald-600 text-white"
                : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/20"
              }`}
          >
            {saved && <Check size={13} />}
            {saved ? "Saved" : "Save changes"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
