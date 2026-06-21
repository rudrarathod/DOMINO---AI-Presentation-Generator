import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Sparkles, ArrowRight, Chrome, Terminal } from "lucide-react";
import { toast } from "sonner";
import { decodeJwt, getGoogleClientId, setUser, UserProfile } from "../services/auth";

interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [googleId, setGoogleId] = useState(getGoogleClientId());
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [demoName, setDemoName] = useState("Alex Kim");
  const [demoEmail, setDemoEmail] = useState("alex@domino.app");
  const [showDemoForm, setShowDemoForm] = useState(false);

  // Actively wait for Google SDK library load (handles async script loading)
  useEffect(() => {
    if ((window as any).google) {
      setGoogleLoaded(true);
      return;
    }

    const interval = setInterval(() => {
      if ((window as any).google) {
        setGoogleLoaded(true);
        clearInterval(interval);
      }
    }, 100);

    // Timeout after 5 seconds to fallback gracefully
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  // Render Google Sign-in button when Client ID & SDK are ready
  useEffect(() => {
    if (googleId && googleLoaded && (window as any).google) {
      try {
        (window as any).google.accounts.id.initialize({
          client_id: googleId,
          callback: (response: any) => {
            const payload = decodeJwt(response.credential);
            if (payload) {
              const initials = payload.name
                ? payload.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()
                : "U";
              const user: UserProfile = {
                name: payload.name || "Google User",
                email: payload.email || "",
                picture: payload.picture,
                initials,
              };
              setUser(user);
              onLoginSuccess(user);
              toast.success(`Welcome, ${user.name}!`);
            } else {
              toast.error("Failed to decode user profile.");
            }
          },
        });

        (window as any).google.accounts.id.renderButton(
          document.getElementById("google-signin-button"),
          { theme: "filled_blue", size: "large", width: 280, shape: "pill" }
        );
      } catch (err) {
        console.error("GSI Button Rendering Error", err);
      }
    }
  }, [googleId, googleLoaded, onLoginSuccess]);

  const handleDemoSignIn = () => {
    if (!demoName.trim() || !demoEmail.trim()) {
      toast.error("Please fill in your name and email.");
      return;
    }
    const initials = demoName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
    const user: UserProfile = {
      name: demoName,
      email: demoEmail,
      initials,
    };
    setUser(user);
    onLoginSuccess(user);
    toast.success(`Welcome, ${user.name}! (Demo Mode)`);
  };

  const isRealGoogleMode = googleId && googleId !== "your-google-client-id.apps.googleusercontent.com";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0F19] text-white select-none overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.15),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.08),transparent_60%)] pointer-events-none" />

      {/* Background decoration elements */}
      <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-[#8B5CF6]/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-[20%] right-[10%] w-[350px] h-[350px] bg-[#22D3EE]/5 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        className="w-[420px] rounded-3xl bg-white/[0.03] border border-white/[0.08] p-10 backdrop-blur-xl shadow-2xl shadow-black/80 flex flex-col items-center relative z-10 text-center"
      >
        {/* Logo Bubble */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#22D3EE] flex items-center justify-center shadow-lg shadow-[#8B5CF6]/20 mb-6">
          <Sparkles size={28} className="text-white animate-pulse" />
        </div>

        {/* Brand Header */}
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
          DOMINO
        </h1>
        <p className="text-[#94A3B8] text-sm mb-8 leading-relaxed max-w-[280px]">
          Generate investor-grade presentation decks autonomously.
        </p>

        {/* Authentication Button Area */}
        <div className="w-full flex flex-col items-center gap-4">
          {isRealGoogleMode ? (
            <div className="w-full flex flex-col items-center gap-4">
              {/* Google Button mounting point */}
              <div id="google-signin-button" className="min-h-[40px] flex items-center justify-center" />
              
              <div className="h-px bg-white/[0.06] w-full my-1" />
              
              {/* Option to bypass to demo mode if desired */}
              <button
                onClick={() => setShowDemoForm(true)}
                className="text-xs text-[#94A3B8] hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Terminal size={12} />
                Bypass with Dev Demo Mode
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-3">
              {showDemoForm ? (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full flex flex-col gap-3 text-left animate-fade-in"
                >
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-widest text-[#94A3B8] mb-1.5 block">Full Name</label>
                    <input
                      type="text"
                      value={demoName}
                      onChange={(e) => setDemoName(e.target.value)}
                      placeholder="e.g. Alex Kim"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#22D3EE]/50 transition-colors font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-widest text-[#94A3B8] mb-1.5 block">Email Address</label>
                    <input
                      type="email"
                      value={demoEmail}
                      onChange={(e) => setDemoEmail(e.target.value)}
                      placeholder="e.g. alex@domino.app"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#22D3EE]/50 transition-colors font-medium"
                    />
                  </div>

                  <button
                    onClick={handleDemoSignIn}
                    className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] hover:from-[#7c50e3] hover:to-[#1ec0d8] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md shadow-[#8B5CF6]/15 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    Enter Application
                    <ArrowRight size={13} />
                  </button>

                  <button
                    onClick={() => setShowDemoForm(false)}
                    className="w-full text-center text-xs text-[#94A3B8] hover:text-white transition-colors mt-2"
                  >
                    Go Back
                  </button>
                </motion.div>
              ) : (
                <div className="w-full flex flex-col gap-4">
                  {/* Google OAuth Button Trigger (Fallback Demo Mode) */}
                  <button
                    onClick={() => setShowDemoForm(true)}
                    className="w-full py-3 rounded-xl bg-white text-[#0B0F19] hover:bg-slate-100 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 shadow-md shadow-white/5 active:scale-[0.98]"
                  >
                    <Chrome size={14} className="text-[#8B5CF6] shrink-0" />
                    Sign in with Google
                  </button>

                  {/* Settings / Config Banner */}
                  <div className="rounded-2xl border border-amber-500/10 bg-amber-500/5 p-4 text-[11px] text-amber-400 leading-relaxed text-left">
                    <p className="font-semibold mb-1 flex items-center gap-1.5">
                      <Terminal size={12} />
                      Configuring Google Client ID:
                    </p>
                    <p className="mt-1">Add your Client ID to the <span className="font-mono bg-white/5 px-1 py-0.5 rounded text-[10px]">.env</span> file to swap to real Google OAuth:</p>
                    <p className="font-mono text-[9px] mt-2 select-all break-all bg-black/40 p-2.5 rounded border border-white/[0.06] text-amber-300">
                      VITE_GOOGLE_CLIENT_ID={googleId || "your-client-id"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
