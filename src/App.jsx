import { Routes, Route, useLocation } from "react-router-dom";
import SiteHeader from "./components/SiteHeader.jsx";
import SiteFooter from "./components/SiteFooter.jsx";
import ScrollToTopButton from "./components/ScrollToTopButton.jsx";

import Home from "./pages/Home.jsx";
import Projects from "./pages/Projects.jsx";
import Experience from "./pages/Experience.jsx";
import Education from "./pages/Education.jsx";
import Mentorship from "./pages/Mentorship.jsx";
import Speaking from "./pages/Speaking.jsx";
import Insights from "./pages/Insights.jsx";
import Advisory from "./pages/Advisory.jsx";
import Newsletter from "./pages/Newsletter.jsx";
import ChatWithRazor from "./pages/ChatWithRazor.jsx";
import Publications from "./pages/Publications.jsx";

import "./App.css";

export default function App() {
  const location = useLocation();

  return (
    <div className="app-shell">
      <SiteHeader />
      <main id="main-content" className="container page-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/education" element={<Education />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/mentorship" element={<Mentorship />} />
          <Route path="/speaking" element={<Speaking />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/advisory" element={<Advisory />} />
          <Route path="/newsletter" element={<Newsletter />} />
          <Route path="/chat-with-razor" element={<ChatWithRazor />} />
        </Routes>
      </main>
      <ScrollToTopButton />
      <SiteFooter />
    </div>
  );
}

