import { NavLink } from "react-router-dom";
import logoWordmark from "../assets/asifrasool-logo.png";

const FOOTER_LINK_GROUPS = [
  {
    title: "Portfolio",
    links: [
      { to: "/experience", label: "Experience" },
      { to: "/projects", label: "Projects" },
      { to: "/speaking", label: "Speaking" },
      { to: "/insights", label: "Insights" },
    ],
  },
  {
    title: "Work With Me",
    links: [
      { to: "/advisory", label: "Advisory" },
      { to: "/newsletter", label: "Newsletter" },
      { to: "/chat-with-razor", label: "Chat with rAI-zor" },
    ],
  },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer" aria-label="Footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="brand-mark brand-mark--footer">
            <img src={logoWordmark} alt="AsifRasool.net" className="brand-mark__image" />
          </div>
          <p className="footer-tagline">
            Translating data, AI, and human-centered design into measurable value across teams and products.
          </p>
        </div>
        <div className="footer-links">
          {FOOTER_LINK_GROUPS.map((group) => (
            <div key={group.title} className="footer-links__group">
              <h3>{group.title}</h3>
              <ul>
                {group.links.map((link) => (
                  <li key={link.to}>
                    <NavLink to={link.to}>{link.label}</NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-meta">
          <p>© {year} AsifRasool.net. All rights reserved.</p>
          <p className="footer-meta__note">
            Crafted with the polished aesthetic of the St. Tammany HCS dashboard and tailored for a personal portfolio.
          </p>
        </div>
      </div>
    </footer>
  );
}
