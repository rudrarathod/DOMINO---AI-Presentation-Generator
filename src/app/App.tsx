import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import HomeScreen from "./screens/HomeScreen";
import BuilderScreen from "./screens/BuilderScreen";
import LoginScreen from "./screens/LoginScreen";
import { Toaster } from "./components/ui/sonner";
import { getUser, UserProfile } from "./services/auth";

export default function App() {
  const [user, setUserState] = useState<UserProfile | null>(() => getUser());

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <>
      {!user ? (
        <LoginScreen onLoginSuccess={(u) => setUserState(u)} />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/builder" element={<BuilderScreen />} />
          </Routes>
        </BrowserRouter>
      )}
      <Toaster position="bottom-center" />
    </>
  );
}
