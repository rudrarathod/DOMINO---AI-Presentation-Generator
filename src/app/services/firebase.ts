import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// Read Firebase configurations from Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if configuration is provided
const isFirebaseConfigured = !!firebaseConfig.projectId;

let db: any = null;

if (isFirebaseConfigured) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    console.log("Firebase initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
  }
} else {
  console.warn("Firebase config not found in env variables. Falling back to local storage only.");
}

export function isFirebaseEnabled(): boolean {
  return !!db;
}

export async function syncFromFirebase(email: string): Promise<{ apiKey?: string; generationsUsed?: number } | null> {
  if (!db || !email) return null;
  try {
    const userDocRef = doc(db, "users", email);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        apiKey: data.apiKey,
        generationsUsed: data.generationsUsed,
      };
    }
  } catch (error) {
    console.error("Firestore syncFromFirebase error:", error);
  }
  return null;
}

export async function syncToFirebase(email: string, data: { apiKey?: string; generationsUsed?: number }): Promise<void> {
  if (!db || !email) return;
  try {
    const userDocRef = doc(db, "users", email);
    await setDoc(userDocRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    console.error("Firestore syncToFirebase error:", error);
  }
}
