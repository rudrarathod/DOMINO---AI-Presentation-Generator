import { getUser } from "./auth";
import { syncFromFirebase, syncToFirebase, isFirebaseEnabled } from "./firebase";

const DEFAULT_CREDITS = 50;

export function hasCustomApiKey(): boolean {
  const saved = localStorage.getItem("lumina_api_key") || "";
  return !!(saved && !saved.includes("•") && saved.startsWith("gsk_"));
}

export function getCreditsRemaining(): number {
  if (hasCustomApiKey()) return Infinity;
  const user = getUser();
  const email = user?.email || "anonymous";
  const saved = localStorage.getItem(`domino_credits_${email}`);
  if (saved === null) {
    // If no record exists, initialize with default credits
    localStorage.setItem(`domino_credits_${email}`, DEFAULT_CREDITS.toString());
    return DEFAULT_CREDITS;
  }
  return parseInt(saved, 10);
}

export function hasEnoughCredits(amount: number): boolean {
  if (hasCustomApiKey()) return true;
  return getCreditsRemaining() >= amount;
}

export async function deductCredits(amount: number): Promise<number> {
  if (hasCustomApiKey()) return Infinity;
  const user = getUser();
  const email = user?.email || "anonymous";
  const current = getCreditsRemaining();
  const next = Math.max(0, current - amount);
  localStorage.setItem(`domino_credits_${email}`, next.toString());

  if (user && user.email) {
    try {
      await syncToFirebase(user.email, { credits: next });
    } catch (e) {
      console.error("Failed to sync credits to Firebase", e);
    }
  }
  return next;
}

export async function saveCustomApiKey(key: string) {
  localStorage.setItem("lumina_api_key", key);
  const user = getUser();
  if (user && user.email) {
    await syncToFirebase(user.email, { apiKey: key });
  }
}

export async function initializeUserSync(onSyncComplete?: () => void) {
  const user = getUser();
  if (!user || !user.email) return;

  const email = user.email;

  if (isFirebaseEnabled()) {
    const data = await syncFromFirebase(email);
    if (data) {
      if (data.apiKey) {
        localStorage.setItem("lumina_api_key", data.apiKey);
      }
      if (data.credits !== undefined) {
        localStorage.setItem(`domino_credits_${email}`, data.credits.toString());
      }
      if (onSyncComplete) onSyncComplete();
    }
  }
}

export function isLimitReached(): boolean {
  if (hasCustomApiKey()) return false;
  return getCreditsRemaining() <= 0;
}
