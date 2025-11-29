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

export default function SiteHeader({
  // Accessibility Mode: start
  accessibilityEnabled = false,
  onToggleAccessibility = () => {},
  // Accessibility Mode: end
}) {
  return (
    <header className="site-header">
      <a className="skip-to-content" href="#main-content">Skip to main content</a>
      <div className="container header-inner">
        <div className="brand brand--image">
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
          {/* Accessibility Mode: start */}
          <button
            type="button"
            className={["nav-link", "nav-link--button", accessibilityEnabled ? "active" : null].filter(Boolean).join(" ")}
            onClick={onToggleAccessibility}
            aria-pressed={accessibilityEnabled}
          >
            Accessibility
          </button>
          {/* Accessibility Mode: end */}
        </nav>
      </div>
    </header>
  );
}
