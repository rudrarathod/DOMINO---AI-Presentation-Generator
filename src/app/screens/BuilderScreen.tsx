import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Share2,
  Download,
  Play,
  Plus,
  Sparkles,
  Send,
  Check,
  ChevronDown,
  Layers,
  Wand2,
  BarChart3,
  Users,
  TrendingUp,
  Cpu,
  Globe,
  Leaf,
  ChevronRight,
  MoreHorizontal,
  Bot,
  User,
  X,
  ChevronLeft,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Undo,
  Redo,
  Clock,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { toast } from "sonner";
import {
  generateOutline,
  generateSlideContent,
  refineSlides,
  Slide
} from "../services/ai";
import { SlideContent } from "../components/slides";

interface HistoryEntry {
  slides: Slide[];
  description: string;
  timestamp: string;
}

import { isLimitReached, incrementGenerationsUsed, hasCustomApiKey } from "../services/usage";
import ApiKeyLimitModal from "../components/ApiKeyLimitModal";
import { DEFAULT_SLIDES as SEED_SLIDES } from "../services/defaultDeck";

const DEFAULT_SLIDES = SEED_SLIDES.map((s, idx) => ({
  id: idx + 1,
  ...s
}));

function getMockTypeFromIndex(index: number): Slide['type'] {
  return DEFAULT_SLIDES[index]?.type || 'generic';
}

export default function BuilderScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialPrompt = location.state?.prompt || "";
  const slideCountParam = location.state?.slideCount || "Auto";

  const [presentationId, setPresentationId] = useState<string>(() => {
    if (location.state?.presentationId) return location.state?.presentationId;
    if (location.state?.prompt) return "";
    return "deck-" + Date.now() + "-" + Math.random().toString(36).substring(2, 9);
  });

  const [aspectRatio, setAspectRatio] = useState<string>(() => {
    const pId = location.state?.presentationId;
    if (pId) {
      const savedDecksStr = localStorage.getItem("domino_presentations");
      if (savedDecksStr) {
        try {
          const decks = JSON.parse(savedDecksStr);
          const deck = decks.find((d: any) => d.id === pId);
          if (deck?.aspectRatio) return deck.aspectRatio;
        } catch (e) {
          console.error(e);
        }
      }
    }
    return location.state?.aspectRatio || "16:9";
  });

  const [slides, setSlides] = useState<Slide[]>(() => {
    const pId = location.state?.presentationId;
    if (pId) {
      const savedDecksStr = localStorage.getItem("domino_presentations");
      if (savedDecksStr) {
        try {
          const decks = JSON.parse(savedDecksStr);
          const deck = decks.find((d: any) => d.id === pId);
          if (deck) return deck.slides;
        } catch (e) {
          console.error(e);
        }
      }
    }
    return DEFAULT_SLIDES.map((s) => ({
      id: `mock-${s.id}`,
      name: s.name,
      type: s.type,
      color: s.color,
      data: s.data,
    }));
  });

  const [selectedSlide, setSelectedSlide] = useState(0);
  const [chatInput, setChatInput] = useState("");
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: "ai", text: "I'm your DOMINO design assistant. You can ask me to modify the content, style, or add/delete slides in real-time." }
  ]);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deckTitle, setDeckTitle] = useState(() => {
    const pId = location.state?.presentationId;
    if (pId) {
      const savedDecksStr = localStorage.getItem("domino_presentations");
      if (savedDecksStr) {
        try {
          const decks = JSON.parse(savedDecksStr);
          const deck = decks.find((d: any) => d.id === pId);
          if (deck) return deck.title;
        } catch (e) {
          console.error(e);
        }
      }
    }
    return "Autonomous Data Intelligence";
  });

  const [editScope, setEditScope] = useState<'slide' | 'deck'>('slide');
  const [scopeDropdownOpen, setScopeDropdownOpen] = useState(false);
  const [historyDropdownOpen, setHistoryDropdownOpen] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    let initialSlidesList: Slide[] = [];
    const pId = location.state?.presentationId;
    if (pId) {
      const savedDecksStr = localStorage.getItem("domino_presentations");
      if (savedDecksStr) {
        try {
          const decks = JSON.parse(savedDecksStr);
          const deck = decks.find((d: any) => d.id === pId);
          if (deck) initialSlidesList = deck.slides;
        } catch (e) {
          console.error(e);
        }
      }
    }
    if (initialSlidesList.length === 0) {
      initialSlidesList = DEFAULT_SLIDES.map((s) => ({
        id: `mock-${s.id}`,
        name: s.name,
        type: s.type,
        color: s.color,
        data: s.data,
      }));
    }
    return [{
      slides: JSON.parse(JSON.stringify(initialSlidesList)),
      description: pId ? "Loaded saved deck" : "Blank deck",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    }];
  });
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const pushHistory = (newSlides: Slide[], description: string) => {
    setHistory(prev => {
      const base = prev.slice(0, historyIndex + 1);
      const entry = {
        slides: JSON.parse(JSON.stringify(newSlides)),
        description,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };
      setHistoryIndex(base.length);
      return [...base, entry];
    });
  };

  const restoreHistoryIndex = (index: number) => {
    if (index >= 0 && index < history.length) {
      setHistoryIndex(index);
      setSlides(history[index].slides);
      setSelectedSlide(curr => Math.min(history[index].slides.length - 1, Math.max(0, curr)));
      toast.success(`Reverted to: ${history[index].description}`);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      restoreHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      restoreHistoryIndex(historyIndex + 1);
    }
  };

  const updateSlidesAndHistory = (newSlides: Slide[], description: string) => {
    setSlides(newSlides);
    pushHistory(newSlides, description);
  };

  const [loading, setLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    if (!initialPrompt) return;

    let isMounted = true;
    const generateDeck = async () => {
      setLoading(true);
      setProgressMsg("Drafting deck outline...");
      try {
        const outline = await generateOutline(initialPrompt, slideCountParam);
        if (!isMounted) return;

        // Increment free generation usage if they don't have their own API key
        if (!hasCustomApiKey()) {
          incrementGenerationsUsed();
        }

        setDeckTitle(outline.presentationTitle);
        setProgressMsg(`Outline created! Generating ${outline.slides.length} slides in parallel...`);

        // Generate slide contents in parallel
        const slidePromises = outline.slides.map(async (slideOutline, index) => {
          try {
            const slideWithData = await generateSlideContent(slideOutline, outline.themeColor, initialPrompt, index);
            return slideWithData;
          } catch (err: any) {
            console.error(`Failed to generate slide ${index + 1}`, err);
            return {
              id: `fallback-${index}-${Date.now()}`,
              name: slideOutline.title,
              type: slideOutline.type,
              color: outline.themeColor,
              data: {
                title: slideOutline.title,
                badge: `Slide ${index + 1}`,
                layout: "list",
                bullets: [
                  { title: "Introduction", desc: slideOutline.description, iconName: "sparkles" }
                ]
              } as any
            };
          }
        });

        const generatedSlides = await Promise.all(slidePromises);
        if (!isMounted) return;

        setSlides(generatedSlides);
        setSelectedSlide(0);
        const newId = "deck-" + Date.now() + "-" + Math.random().toString(36).substring(2, 9);
        setPresentationId(newId);
        setHistory([{
          slides: JSON.parse(JSON.stringify(generatedSlides)),
          description: "Initial generation",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        }]);
        setHistoryIndex(0);
        toast.success("Presentation generated successfully!");
      } catch (err: any) {
        console.error(err);
        toast.error(`Generation failed: ${err.message}`);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    generateDeck();
    
    // Clear router history state so reloading doesn't re-trigger generation
    window.history.replaceState({}, document.title);
    
    return () => {
      isMounted = false;
    };
  }, [initialPrompt]);

  // Save current presentation on any changes
  useEffect(() => {
    if (!presentationId || loading) return;

    const savedDecksStr = localStorage.getItem("domino_presentations");
    let decks: any[] = [];
    if (savedDecksStr) {
      try {
        decks = JSON.parse(savedDecksStr);
      } catch (e) {
        console.error(e);
      }
    }

    const existingIdx = decks.findIndex((d: any) => d.id === presentationId);
    const updatedDeck = {
      id: presentationId,
      title: deckTitle,
      slides: slides,
      aspectRatio: aspectRatio,
      updatedAt: new Date().toISOString(),
    };

    if (existingIdx >= 0) {
      decks[existingIdx] = {
        ...decks[existingIdx],
        ...updatedDeck,
      };
    } else {
      decks.unshift(updatedDeck);
    }

    localStorage.setItem("domino_presentations", JSON.stringify(decks));
  }, [presentationId, slides, deckTitle, aspectRatio, loading]);

  // Keyboard shortcuts for Undo/Redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (modifier && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if (modifier && e.key.toLowerCase() === "y") {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [historyIndex, history]);

  const handleSendMessage = async () => {
    const input = chatInput.trim();
    if (!input) return;

    if (isLimitReached()) {
      setApiKeyModalOpen(true);
      return;
    }

    setChatInput("");
    const newMessages = [...messages, { role: "user" as const, text: input }];
    setMessages(newMessages);
    setIsThinking(true);

    try {
      const response = await refineSlides(newMessages, slides, selectedSlide, editScope);
      
      // Apply modifications
      if (response.modifications && response.modifications.length > 0) {
        let updatedSlides = [...slides];
        let activeMods = response.modifications.filter(m => m.action !== "none");
        
        if (editScope === "slide") {
          // Programmatically restrict modifications to the active slide only
          activeMods = activeMods
            .filter(mod => mod.action === "modify")
            .map(mod => ({ ...mod, slideIndex: selectedSlide }));
        }
        
        for (const mod of activeMods) {
          const idx = mod.slideIndex !== undefined ? mod.slideIndex : selectedSlide;
          
          if (mod.action === "modify" && mod.slide) {
            if (idx >= 0 && idx < updatedSlides.length) {
              const existing = updatedSlides[idx];
              updatedSlides[idx] = {
                ...existing,
                name: mod.slide.name || existing.name,
                type: mod.slide.type || existing.type,
                color: mod.slide.color || existing.color,
                data: mod.slide.data
              };
            }
          } else if (mod.action === "add" && mod.slide) {
            const newSlideObj: Slide = {
              id: `slide-add-${Date.now()}-${Math.random()}`,
              name: mod.slide.name || "New Slide",
              type: mod.slide.type || "generic",
              color: mod.slide.color || (slides[0]?.color || "from-violet-600 to-indigo-700"),
              data: mod.slide.data
            };
            if (idx >= 0 && idx <= updatedSlides.length) {
              updatedSlides.splice(idx, 0, newSlideObj);
            } else {
              updatedSlides.push(newSlideObj);
            }
          } else if (mod.action === "delete") {
            if (idx >= 0 && idx < updatedSlides.length) {
              updatedSlides.splice(idx, 1);
            }
          }
        }

        updateSlidesAndHistory(updatedSlides, `AI (${editScope === 'slide' ? 'Slide' : 'Deck'}): ${input}`);
        setSelectedSlide(curr => Math.min(updatedSlides.length - 1, Math.max(0, curr)));
        toast.success("Slides updated!");
      }

      setMessages(prev => [...prev, { role: "ai" as const, text: response.explanation }]);
    } catch (err: any) {
      console.error(err);
      toast.error(`Refinement failed: ${err.message}`);
      setMessages(prev => [...prev, { role: "ai" as const, text: `Sorry, I encountered an error while trying to update the slides: ${err.message}` }]);
    } finally {
      setIsThinking(false);
    }
  };

  const activeSlide = slides[selectedSlide] || slides[0] || {
    id: "empty",
    name: "Empty",
    type: "generic",
    color: "from-violet-600 to-indigo-700",
    data: undefined
  };

  const getAspectClass = () => {
    if (aspectRatio === "4:3") return "aspect-[4/3]";
    if (aspectRatio === "1:1") return "aspect-[1/1]";
    return "aspect-[16/9]";
  };

  return (
    <div className="flex flex-col h-screen w-full bg-background text-foreground overflow-hidden relative">
      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07070a]/90 backdrop-blur-md">
          <div className="relative mb-6">
            <div className="absolute inset-0 -m-8 bg-violet-600/30 rounded-full blur-xl animate-pulse" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-2xl relative border border-violet-400/30 animate-bounce">
              <Sparkles size={28} className="text-white animate-spin [animation-duration:3s]" />
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-foreground tracking-tight mb-2">Generating Presentation</h3>
          <p className="text-sm text-muted-foreground animate-pulse text-center max-w-sm px-6 leading-relaxed">
            {progressMsg}
          </p>
          
          <div className="w-48 h-1 bg-muted rounded-full overflow-hidden mt-6 relative">
            <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full animate-pulse w-full" />
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <header className="flex items-center justify-between px-4 h-14 border-b border-border bg-[#0e0e10]/95 backdrop-blur-sm shrink-0 z-10">
        {/* Left */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all text-sm shrink-0"
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="w-px h-5 bg-border shrink-0" />
          <div className="flex items-center gap-1 shrink-0">
            <button
              disabled={historyIndex <= 0}
              onClick={handleUndo}
              className={`p-1.5 rounded-lg transition-all ${historyIndex > 0 ? "text-muted-foreground hover:text-foreground hover:bg-muted/60" : "text-muted-foreground/20 cursor-not-allowed"}`}
              title="Undo change"
            >
              <Undo size={14} />
            </button>
            <button
              disabled={historyIndex >= history.length - 1}
              onClick={handleRedo}
              className={`p-1.5 rounded-lg transition-all ${historyIndex < history.length - 1 ? "text-muted-foreground hover:text-foreground hover:bg-muted/60" : "text-muted-foreground/20 cursor-not-allowed"}`}
              title="Redo change"
            >
              <Redo size={14} />
            </button>
            
            <div className="relative">
              <button
                onClick={() => setHistoryDropdownOpen(!historyDropdownOpen)}
                className={`p-1.5 rounded-lg transition-all text-muted-foreground hover:text-foreground hover:bg-muted/60 ${historyDropdownOpen ? "bg-muted text-foreground" : ""}`}
                title="Version history"
              >
                <Clock size={14} />
              </button>
              
              {historyDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setHistoryDropdownOpen(false)} />
                  <div className="absolute left-0 mt-2 w-64 rounded-xl border border-border bg-[#0e0e10]/95 backdrop-blur-md shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-2 py-1.5 border-b border-border mb-1">
                      Session History
                    </p>
                    <div className="max-h-60 overflow-y-auto space-y-1">
                      {history.map((entry, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            restoreHistoryIndex(idx);
                            setHistoryDropdownOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-all flex flex-col gap-0.5 hover:bg-muted/60 ${idx === historyIndex ? "bg-violet-500/10 text-violet-400 border border-violet-500/20" : "text-foreground"}`}
                        >
                          <span className="font-medium truncate">{entry.description}</span>
                          <span className="text-[9px] text-muted-foreground">{entry.timestamp}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="w-px h-5 bg-border shrink-0" />
          <button
            onClick={() => setLeftOpen((o) => !o)}
            className="hidden md:flex p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all shrink-0"
            title={leftOpen ? "Collapse slides panel" : "Expand slides panel"}
          >
            {leftOpen ? <PanelLeftClose size={15} /> : <PanelLeftOpen size={15} />}
          </button>
          <div className="w-px h-5 bg-border shrink-0 hidden md:block" />
          <div className="flex items-center gap-2 min-w-0 flex-1 max-w-[200px] sm:max-w-xs md:max-w-md">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-violet-500 to-indigo-600 shrink-0 flex items-center justify-center">
              <Layers size={11} className="text-white" />
            </div>
            <input
              type="text"
              value={deckTitle}
              onChange={(e) => setDeckTitle(e.target.value)}
              className="text-sm font-medium text-foreground bg-transparent border-none focus:outline-none focus:ring-0 truncate w-full p-0"
              placeholder="Untitled Presentation"
            />
          </div>
        </div>

        {/* Center */}
        <div className="flex items-center justify-center flex-1 hidden md:flex">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-medium">DOMINO AI Connected</span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <button
            onClick={() => setPreviewOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all text-sm"
          >
            <Play size={13} />
            Preview
          </button>
          <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all text-sm">
            <Share2 size={13} />
            Share
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-medium transition-all shadow-lg shadow-violet-500/20">
            <Download size={13} />
            <span className="hidden sm:inline">Export</span>
          </button>
          <div className="w-px h-5 bg-border shrink-0 hidden lg:block" />
          <button
            onClick={() => setRightOpen((o) => !o)}
            className="hidden lg:flex p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all shrink-0"
            title={rightOpen ? "Collapse AI panel" : "Expand AI panel"}
          >
            {rightOpen ? <PanelRightClose size={15} /> : <PanelRightOpen size={15} />}
          </button>
        </div>
      </header>

      {/* Three-panel body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel — slides */}
        <AnimatePresence initial={false}>
          {leftOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="hidden md:flex flex-col border-r border-border bg-[#0e0e10] overflow-hidden shrink-0 w-[280px]"
            >
              {/* Panel header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                  Slides
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">{slides.length}</span>
                  <button className="p-1 rounded hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground">
                    <MoreHorizontal size={14} />
                  </button>
                </div>
              </div>

              {/* Slide list */}
              <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1 scrollbar-thin">
                {slides.map((slide, i) => (
                  <motion.button
                    key={slide.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => setSelectedSlide(i)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group
                      ${selectedSlide === i
                        ? "bg-violet-500/10 border border-violet-500/30 shadow-sm shadow-violet-500/10"
                        : "hover:bg-muted/50 border border-transparent"
                      }
                    `}
                  >
                    {/* Thumbnail preview */}
                    <div className={`
                      w-14 h-9 rounded-md bg-gradient-to-br ${slide.color} flex items-center justify-center shrink-0
                      ${selectedSlide === i ? "shadow-md" : ""}
                    `}>
                      <span className="text-white/80 text-[9px] font-bold">{i + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium truncate ${selectedSlide === i ? "text-violet-300" : "text-muted-foreground group-hover:text-foreground"} transition-colors`}>
                        {slide.name}
                      </p>
                    </div>
                    {selectedSlide === i && (
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Add slide */}
              <div className="px-3 py-3 border-t border-border">
                <button
                  onClick={() => {
                    const newSlideObj: Slide = {
                      id: `slide-add-${Date.now()}`,
                      name: "Untitled Slide",
                      type: "generic",
                      color: slides[0]?.color || "from-violet-600 to-indigo-700",
                      data: {
                        badge: "NEW SLIDE",
                        title: "New Custom Slide",
                        layout: "list",
                        bullets: [
                          { title: "New Point", desc: "Use the AI Assistant to edit this slide content.", iconName: "sparkles" }
                        ]
                      }
                    };
                    setSlides([...slides, newSlideObj]);
                    setSelectedSlide(slides.length);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-violet-500/40 hover:bg-violet-500/5 transition-all text-sm"
                >
                  <Plus size={14} />
                  Add Slide
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Center canvas */}
        <div className="flex-1 overflow-auto bg-[#07070a] flex items-center justify-center py-8 px-4 min-w-0">
          <motion.div
            key={selectedSlide}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="w-full max-w-4xl mx-auto min-w-[520px]"
          >
            {/* Slide canvas */}
            <div className={`relative w-full rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#0d0d14] to-[#0a0a11] overflow-hidden shadow-2xl shadow-black/60 ${getAspectClass()}`}
            >
              <ScaledSlide>
                <SlideContent
                  slideIndex={selectedSlide}
                  slide={activeSlide}
                  onSlideDataUpdate={(newData) => {
                    const updatedSlides = [...slides];
                    updatedSlides[selectedSlide] = {
                      ...updatedSlides[selectedSlide],
                      data: newData,
                    };
                    updateSlidesAndHistory(updatedSlides, `Image uploaded on slide ${selectedSlide + 1}`);
                  }}
                />
              </ScaledSlide>
              <div className="absolute bottom-4 right-5 text-white/30 text-xs font-mono">
                {selectedSlide + 1} / {slides.length}
              </div>
            </div>

            {/* Below canvas controls */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedSlide(Math.max(0, selectedSlide - 1))}
                  disabled={selectedSlide === 0}
                  className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ArrowLeft size={14} />
                </button>
                <span className="text-xs text-muted-foreground font-mono px-2">
                  {selectedSlide + 1} of {slides.length}
                </span>
                <button
                  onClick={() => setSelectedSlide(Math.min(slides.length - 1, selectedSlide + 1))}
                  disabled={selectedSlide === slides.length - 1}
                  className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right panel */}
        <AnimatePresence initial={false}>
          {rightOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="hidden lg:flex flex-col border-l border-border bg-[#0e0e10] shrink-0 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border shrink-0">
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                  <Bot size={11} className="text-white" />
                </div>
                <span className="text-xs font-medium text-foreground">AI Assistant</span>
              </div>



              <div className="flex-1 overflow-hidden flex flex-col">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col flex-1 overflow-hidden"
                >
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-5">
                    {messages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                      >
                        <div className={`
                          w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5
                          ${msg.role === "ai"
                            ? "bg-gradient-to-br from-violet-500 to-indigo-600"
                            : "bg-zinc-700"
                          }
                        `}>
                          {msg.role === "ai"
                            ? <Sparkles size={12} className="text-white" />
                            : <User size={12} className="text-zinc-300" />
                          }
                        </div>
                        <div className={`flex-1 ${msg.role === "user" ? "text-right" : ""}`}>
                          <p className="text-[11px] font-medium text-muted-foreground mb-1.5">
                            {msg.role === "ai" ? "DOMINO AI" : "You"}
                          </p>
                          <div className={`
                            inline-block text-sm leading-relaxed text-left max-w-full
                            ${msg.role === "ai"
                              ? "text-foreground/90"
                              : "text-foreground px-3 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20"
                            }
                          `}>
                            {msg.text}
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* AI thinking skeleton */}
                    {isThinking && (
                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0">
                          <Sparkles size={12} className="text-white" />
                        </div>
                        <div className="flex-1 pt-1">
                          <p className="text-[11px] font-medium text-muted-foreground mb-2">DOMINO AI</p>
                          <div className="space-y-2">
                            <div className="h-2.5 rounded-full bg-muted animate-pulse w-3/4" />
                            <div className="h-2.5 rounded-full bg-muted animate-pulse w-1/2" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Chat input */}
                  <div className="p-3 border-t border-border">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/60 border border-border focus-within:border-primary/40 transition-all relative">
                      {/* Scope Selector Dropdown inside input */}
                      <div className="relative shrink-0 select-none">
                        <button
                          onClick={() => setScopeDropdownOpen(!scopeDropdownOpen)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-medium bg-background border border-border text-muted-foreground hover:text-foreground transition-all hover:bg-muted/80"
                        >
                          <span>{editScope === 'slide' ? 'Active Slide' : 'Whole Deck'}</span>
                          <ChevronDown size={11} className={`transition-transform duration-200 ${scopeDropdownOpen ? "rotate-180" : ""}`} />
                        </button>
                        
                        {scopeDropdownOpen && (
                          <>
                            <div className="fixed inset-0 z-30" onClick={() => setScopeDropdownOpen(false)} />
                            <div className="absolute bottom-full left-0 mb-2 w-36 rounded-xl border border-border bg-[#0e0e10]/95 backdrop-blur-md shadow-2xl p-1 z-40 animate-in fade-in slide-in-from-bottom-2 duration-150">
                              <button
                                onClick={() => {
                                  setEditScope('slide');
                                  setScopeDropdownOpen(false);
                                }}
                                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all flex items-center justify-between hover:bg-muted/60 ${editScope === 'slide' ? "text-violet-400 font-medium bg-violet-500/5" : "text-muted-foreground"}`}
                              >
                                <span>Active Slide</span>
                                {editScope === 'slide' && <Check size={11} />}
                              </button>
                              <button
                                onClick={() => {
                                  setEditScope('deck');
                                  setScopeDropdownOpen(false);
                                }}
                                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all flex items-center justify-between hover:bg-muted/60 ${editScope === 'deck' ? "text-violet-400 font-medium bg-violet-500/5" : "text-muted-foreground"}`}
                              >
                                <span>Whole Deck</span>
                                {editScope === 'deck' && <Check size={11} />}
                              </button>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="w-px h-4 bg-border shrink-0" />

                      <input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSendMessage();
                          }
                        }}
                        placeholder={editScope === 'slide' ? "Ask to modify active slide..." : "Ask to modify whole deck..."}
                        className="flex-1 min-w-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!chatInput.trim() || isThinking}
                        className={`p-1.5 rounded-lg transition-all ${chatInput.trim() ? "text-violet-400 hover:bg-violet-500/10" : "text-muted-foreground/40"}`}
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Preview modal */}
      <AnimatePresence>
        {previewOpen && (
          <PreviewModal
            slides={slides}
            initialSlide={selectedSlide}
            onClose={() => setPreviewOpen(false)}
          />
        )}
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

function PreviewModal({
  slides,
  initialSlide,
  onClose,
}: {
  slides: Slide[];
  initialSlide: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(initialSlide);
  const containerRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);

  // Enter native fullscreen on mount
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const enterFullscreen = async () => {
      try {
        if (el.requestFullscreen) {
          await el.requestFullscreen();
        } else if ((el as any).webkitRequestFullscreen) {
          await (el as any).webkitRequestFullscreen();
        }
      } catch (err) {
        console.warn("Fullscreen request failed:", err);
      }
    };

    enterFullscreen();

    // Listen for native fullscreen exit (e.g. user presses Esc natively)
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
        if (!closingRef.current) {
          closingRef.current = true;
          onClose();
        }
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, [onClose]);

  const handleClose = () => {
    closingRef.current = true;
    if (document.fullscreenElement || (document as any).webkitFullscreenElement) {
      document.exitFullscreen?.() || (document as any).webkitExitFullscreen?.();
    }
    onClose();
  };

  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(slides.length - 1, c + 1));

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); next(); }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); prev(); }
    // Don't handle Escape here — let the native fullscreen exit handle it
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex flex-col bg-black cursor-none"
      onKeyDown={handleKey}
      tabIndex={0}
      autoFocus
      onMouseMove={(e) => {
        // Show cursor on mouse move, hide after idle
        const el = e.currentTarget;
        el.style.cursor = "default";
        clearTimeout((el as any)._cursorTimer);
        (el as any)._cursorTimer = setTimeout(() => {
          el.style.cursor = "none";
        }, 2500);
      }}
    >
      {/* Minimal top bar — visible on hover */}
      <div className="group/topbar absolute top-0 left-0 right-0 z-20">
        <div className="flex items-center justify-between px-5 py-3 opacity-0 group-hover/topbar:opacity-100 transition-opacity duration-300 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Play size={10} className="text-white ml-0.5" />
            </div>
            <span className="text-sm font-medium text-white/80">Presentation Preview</span>
            <span className="text-xs text-white/30 font-mono">{current + 1} / {slides.length}</span>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.08] transition-all"
            title="Exit fullscreen (Esc)"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Full-screen slide area — edge to edge */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Slide — fills the entire screen */}
        <div className="w-full h-full relative overflow-hidden bg-[#0d0d14]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <ScaledSlide>
                <SlideContent slideIndex={current} slide={slides[current]} />
              </ScaledSlide>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Previous button — overlaid on slide */}
        <button
          onClick={prev}
          disabled={current === 0}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/50 hover:text-white hover:bg-black/50 disabled:opacity-0 disabled:cursor-not-allowed transition-all z-10"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Next button — overlaid on slide */}
        <button
          onClick={next}
          disabled={current === slides.length - 1}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/50 hover:text-white hover:bg-black/50 disabled:opacity-0 disabled:cursor-not-allowed transition-all z-10"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Bottom slide strip — visible on hover */}
      <div className="group/bottom absolute bottom-0 left-0 right-0 z-20">
        <div className="opacity-0 group-hover/bottom:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-6">
          <div className="flex items-center justify-center gap-2 px-6 py-2 overflow-x-auto">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                onClick={() => setCurrent(i)}
                className={`
                  relative flex-shrink-0 w-16 rounded-lg overflow-hidden border transition-all duration-200
                  ${i === current ? "border-violet-500/60 shadow-md shadow-violet-500/20 scale-110" : "border-white/[0.06] hover:border-white/20 opacity-60 hover:opacity-90"}
                `}
                style={{ aspectRatio: "16/9" }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${slide.color} opacity-30`} />
                <div className="absolute inset-0 bg-[#0d0d14]/70" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
                  <span className="text-white/50 text-[7px] font-mono">{i + 1}</span>
                  <span className="text-white/70 text-[7px] font-medium leading-tight text-center px-0.5 truncate w-full">{slide.name}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Keyboard hints */}
          <div className="flex items-center justify-center gap-4 pb-3">
            {[["←", "Previous"], ["→", "Next"], ["Esc", "Exit"]].map(([key, label]) => (
              <div key={key} className="flex items-center gap-1.5 text-white/15 text-xs">
                <kbd className="px-1.5 py-0.5 rounded border border-white/[0.06] bg-white/[0.02] font-mono text-[10px]">{key}</kbd>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const DESIGN_W = 1600;
const DESIGN_H = 900;

function ScaledSlide({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / DESIGN_W);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <div
        style={{
          width: DESIGN_W,
          height: DESIGN_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}

