import { NavLink } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-view">
      <section className="hero-panel">
        <p className="badge">Asif Rasool · Portfolio Preview</p>
        <h1>Building intelligent systems with human-centered outcomes.</h1>
        <p>
          AsifRasool.net brings together the highlights from LinkedIn—spanning transformation programs, AI strategy,
          partnerships, and speaking engagements—into a single, design-forward home.
        </p>
        <div className="hero-actions">
          <NavLink className="pill-button" to="/experience">
            View Experience
          </NavLink>
          <NavLink className="pill-button subtle-button" to="/chat-with-razor">
            Chat with rAI-zor
          </NavLink>
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading">
          <div>
            <h2>What you will find here</h2>
            <p>
              Each section mirrors the way your work is organized on LinkedIn—roles, projects, thought leadership, and
              advisory offerings—wrapped in the polished look and feel of our dashboard builds.
            </p>
          </div>
        </div>
        <div className="card-grid card-grid--three">
          <article className="elevated-card">
            <h3>Experience timeline</h3>
            <p>
              Showcase your headline roles with context, impact metrics, and standout initiatives drawn directly from your
              LinkedIn experience section.
            </p>
          </article>
          <article className="elevated-card">
            <h3>Signature projects</h3>
            <p>
              Capture the product launches, innovation pilots, and community programs you champion, ready for links and rich
              media.
            </p>
          </article>
          <article className="elevated-card">
            <h3>Thought leadership</h3>
            <p>
              Surface articles, talks, and podcasts so visitors see your perspective on AI, operations, and workforce
              development at a glance.
            </p>
          </article>
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading">
          <div>
            <h2>Current focus areas</h2>
            <p>
              Keep these cards in sync with the priorities you spotlight on LinkedIn—update them as your portfolio evolves.
            </p>
          </div>
        </div>
        <div className="card-grid">
          <article className="elevated-card">
            <h3>AI & analytics strategy</h3>
            <p>
              Summarize how you guide teams through responsible adoption, governance, and measurable impact.
            </p>
          </article>
          <article className="elevated-card">
            <h3>Community and partnerships</h3>
            <p>
              Highlight collaborations, mentorship initiatives, or cross-industry alliances that reflect your leadership
              footprint.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
