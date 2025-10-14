import { NavLink } from "react-router-dom";
import logoWordmark from "../assets/asifrasool-logo.png";

const NAV_ITEMS = [
  { to: "/", label: "Home", end: true },
  { to: "/experience", label: "Experience" },
  { to: "/projects", label: "Projects" },
  { to: "/mentorship", label: "Mentorship" },
  { to: "/speaking", label: "Speaking" },
  { to: "/insights", label: "Insights" },
  { to: "/advisory", label: "Advisory" },
  { to: "/newsletter", label: "Newsletter" },
  { to: "/chat-with-razor", label: "Chat with rAI-zor" },
];

export default function SiteHeader() {
  return (
    <header className="site-header">
      <a className="skip-to-content" href="#main-content">Skip to main content</a>
      <div className="container header-inner">
        <div className="brand brand--image">
          <NavLink to="/" className="brand-logo" aria-label="AsifRasool.net home">
            <img src={logoWordmark} alt="AsifRasool.net" className="brand-logo__img" />
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
