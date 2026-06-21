import { getUser } from "./auth";

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
  return next;
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
