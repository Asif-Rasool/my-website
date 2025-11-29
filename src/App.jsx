import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import SiteHeader from "./components/SiteHeader.jsx";
import SiteFooter from "./components/SiteFooter.jsx";
import ScrollToTopButton from "./components/ScrollToTopButton.jsx";

import Home from "./pages/Home.jsx";
import Projects from "./pages/Projects.jsx";
import Publications from "./pages/Publications.jsx";
import Experience from "./pages/Experience.jsx";
import Education from "./pages/Education.jsx";
import ChatWithRazor from "./pages/ChatWithRazor.jsx";
import Contact from "./pages/Contact.jsx";

import "./App.css";

export default function App() {
  const location = useLocation();
  // Accessibility Mode: start
  const ACCESSIBILITY_KEY = "accessibility-mode-enabled";
  const [isAccessibilityMode, setIsAccessibilityMode] = useState(false);

  // Initialize accessibility mode from saved preference
  useEffect(() => {
    const savedPref = localStorage.getItem(ACCESSIBILITY_KEY);
    if (savedPref === "true") {
      setIsAccessibilityMode(true);
    }
  }, []);

  // Keep DOM + storage in sync with the toggle state
  useEffect(() => {
    document.body.classList.toggle("accessibility-mode", isAccessibilityMode);
    localStorage.setItem(ACCESSIBILITY_KEY, String(isAccessibilityMode));
  }, [isAccessibilityMode]);
  // Accessibility Mode: end

  useEffect(() => {
    // Reset scroll when navigating between routes
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <SiteHeader
        // Accessibility Mode: start
        accessibilityEnabled={isAccessibilityMode}
        onToggleAccessibility={() => setIsAccessibilityMode((prev) => !prev)}
        // Accessibility Mode: end
      />
      <main id="main-content" className="container page-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/education" element={<Education />} />
          <Route path="/chat-with-razor" element={<ChatWithRazor />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <ScrollToTopButton />
      <SiteFooter />
    </div>
  );
}

