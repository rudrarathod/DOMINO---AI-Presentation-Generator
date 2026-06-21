import { getUser } from "./auth";
import { syncFromFirebase, syncToFirebase, isFirebaseEnabled } from "./firebase";

const GENERATION_LIMIT = 5;

export function hasCustomApiKey(): boolean {
  const saved = localStorage.getItem("lumina_api_key") || "";
  return !!(saved && !saved.includes("•") && saved.startsWith("gsk_"));
}

export function getGenerationsUsed(): number {
  const user = getUser();
  const email = user?.email || "anonymous";
  const saved = localStorage.getItem(`domino_generations_used_${email}`) || "0";
  return parseInt(saved, 10);
}

export function incrementGenerationsUsed(): number {
  const user = getUser();
  const email = user?.email || "anonymous";
  const current = getGenerationsUsed();
  const next = current + 1;
  localStorage.setItem(`domino_generations_used_${email}`, next.toString());
  
  if (user && user.email) {
    syncToFirebase(user.email, { generationsUsed: next }).catch(e =>
      console.error("Failed to sync usage to Firebase", e)
    );
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
      if (data.generationsUsed !== undefined) {
        localStorage.setItem(`domino_generations_used_${email}`, data.generationsUsed.toString());
      }
      if (onSyncComplete) onSyncComplete();
    }
  }
}

export function getRemainingGenerations(): number {
  if (hasCustomApiKey()) return Infinity;
  const used = getGenerationsUsed();
  return Math.max(0, GENERATION_LIMIT - used);
}

export function isLimitReached(): boolean {
  if (hasCustomApiKey()) return false;
  return getGenerationsUsed() >= GENERATION_LIMIT;
}
