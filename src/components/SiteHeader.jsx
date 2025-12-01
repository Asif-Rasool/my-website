import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import logoWordmark from "../assets/asifrasool-logo.png";

const NAV_ITEMS = [
  { to: "/", label: "Home", end: true },
  { to: "/projects", label: "Projects" },
  { to: "/publications", label: "Publications" },
  { to: "/experience", label: "Experience" },
  { to: "/education", label: "Education" },
  { to: "/chat-with-razor", label: "Chat with rAI-zor" },
  { to: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const [showLogo, setShowLogo] = useState(true);

  useEffect(() => {
    const SHOW_THRESHOLD = 24;   // only show when very near the top
    const HIDE_THRESHOLD = 220;  // hide once scrolled past this
    let frame;

    const evaluate = () => {
      const y = window.scrollY;

      // Hysteresis to avoid flicker near the top
      if (y <= SHOW_THRESHOLD) {
        setShowLogo(true);
      } else if (y >= HIDE_THRESHOLD) {
        setShowLogo(false);
      }

      frame = null;
    };

    const handleScroll = () => {
      if (frame != null) return;
      frame = window.requestAnimationFrame(evaluate);
    };

    evaluate();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame != null) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  return (
    <header className={`site-header ${showLogo ? "" : "site-header--compact"}`}>
      <a className="skip-to-content" href="#main-content">Skip to main content</a>
      <div className="container header-inner">
        <div className={`brand brand--image ${showLogo ? "" : "brand--hidden"}`}>
          <NavLink to="/" className="brand-logo" aria-label="AsifRasool.net home">
            <img src={logoWordmark} alt="AsifRasool.net" className="brand-logo__img brand-logo__img--animated" />
          </NavLink>
        </div>
        <nav className="nav-links" aria-label="Primary">
          {NAV_ITEMS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                ["nav-link", isActive ? "active" : null].filter(Boolean).join(" ")
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
