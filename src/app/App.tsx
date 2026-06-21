import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import HomeScreen from "./screens/HomeScreen";
import BuilderScreen from "./screens/BuilderScreen";
import LoginScreen from "./screens/LoginScreen";
import { Toaster } from "./components/ui/sonner";
import { getUser, UserProfile } from "./services/auth";

import { initializeUserSync } from "./services/usage";

export default function App() {
  const [user, setUserState] = useState<UserProfile | null>(() => getUser());
  const [syncKey, setSyncKey] = useState(0);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    if (user) {
      initializeUserSync(() => {
        setSyncKey((k) => k + 1);
      });
    }
  }, [user]);

  return (
    <>
      {!user ? (
        <LoginScreen onLoginSuccess={(u) => setUserState(u)} />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeScreen key={syncKey} />} />
            <Route path="/builder" element={<BuilderScreen key={syncKey} />} />
          </Routes>
        </BrowserRouter>
      )}
      <Toaster position="bottom-center" />
    </>
  );
}
