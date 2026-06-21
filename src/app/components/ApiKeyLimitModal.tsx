import React, { useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Cpu, Key, Eye, EyeOff, X, ExternalLink, AlertCircle, Check } from "lucide-react";
import { saveCustomApiKey } from "../services/usage";

interface ApiKeyLimitModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ApiKeyLimitModal({ onClose, onSuccess }: ApiKeyLimitModalProps) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("lumina_api_key") || "");
  const [visible, setVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = apiKey.trim();

    if (!cleanKey) {
      toast.error("Please enter an API key.");
      return;
    }

    if (!cleanKey.startsWith("gsk_")) {
      toast.error("Invalid key format. Groq API keys start with 'gsk_'.");
      return;
    }

    setIsSaving(true);
    saveCustomApiKey(cleanKey)
      .then(() => {
        toast.success("Groq API Key configured successfully!");
        setIsSaving(false);
        if (onSuccess) onSuccess();
        onClose();
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to save API key.");
        setIsSaving(false);
      });
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
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-border bg-[#0B0F19] p-6 shadow-2xl shadow-black/80 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Effects */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
        >
          <X size={16} />
        </button>

        {/* Title & Icon */}
        <div className="flex flex-col items-center text-center mt-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/25 flex items-center justify-center mb-4">
            <AlertCircle className="text-amber-400" size={24} />
          </div>
          <h2 className="text-xl font-bold text-foreground">Out of Credits</h2>
          <p className="text-xs text-muted-foreground mt-2 max-w-[320px] leading-relaxed">
            You've used all 50 of your free slide credits. To continue creating and refining pitch decks, please add your own Groq API Key.
          </p>
        </div>

        {/* Alert Info Box */}
        <div className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-4 text-[11px] text-muted-foreground leading-relaxed mb-5">
          <p className="font-semibold text-foreground mb-1 flex items-center gap-1.5">
            <Key size={12} className="text-violet-400" />
            Where is my key stored?
          </p>
          <p>
            Your API key is saved locally in your browser's <code className="font-mono bg-white/5 px-1 py-0.5 rounded text-[10px]">localStorage</code>. It is sent directly to Groq's official API endpoint and is never sent to, or stored on, our servers.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#94A3B8] font-semibold">
                Groq API Key
              </label>
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1 font-medium"
              >
                Get API Key
                <ExternalLink size={10} />
              </a>
            </div>
            
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] focus-within:border-violet-500/40 focus-within:bg-white/[0.05] transition-all">
              <Cpu size={14} className="text-muted-foreground shrink-0" />
              <input
                type={visible ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="gsk_..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none font-mono min-w-0"
              />
              <button
                type="button"
                onClick={() => setVisible(!visible)}
                className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                {visible ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.06] text-foreground text-xs font-semibold uppercase tracking-wider transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md shadow-violet-500/15 disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {isSaving ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Check size={14} />
                  Save & Continue
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
