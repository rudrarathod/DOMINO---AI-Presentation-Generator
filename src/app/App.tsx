import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import HomeScreen from "./screens/HomeScreen";
import BuilderScreen from "./screens/BuilderScreen";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/builder" element={<BuilderScreen />} />
      </Routes>
      <Toaster position="bottom-center" />
    </BrowserRouter>
  );
}
