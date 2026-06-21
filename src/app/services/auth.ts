export interface UserProfile {
  name: string;
  email: string;
  picture?: string;
  initials: string;
}

export function getUser(): UserProfile | null {
  const saved = localStorage.getItem("domino_user");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse user profile", e);
    }
  }
  return null;
}

export function setUser(user: UserProfile | null) {
  if (user) {
    localStorage.setItem("domino_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("domino_user");
  }
}

export function getGoogleClientId(): string {
  return (import.meta.env.VITE_GOOGLE_CLIENT_ID as string) || "";
}

export function decodeJwt(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to decode JWT token", e);
    return null;
  }
}
