export default function Newsletter() {
  const topics = ["AI Strategy", "Leadership", "Community"];

  return (
    <div className="newsletter-view">
      <section className="page-section">
        <div className="section-heading">
          <div>
            <h2>Newsletter launchpad</h2>
            <p>
              Introduce cadence, themes, and the kind of actionable insights subscribers can expect. When you are ready,
              embed your actual signup form or marketing automation widget.
            </p>
          </div>
        </div>
        <div className="highlight-panel">
          <p>
            Share a short welcome note from LinkedIn—or craft a new one—that explains who the newsletter serves and how it
            supports your broader mission.
          </p>
          <form className="newsletter-form" onSubmit={(event) => event.preventDefault()}>
            <label htmlFor="newsletter-email" className="muted">
              Email placeholder
            </label>
            <div className="newsletter-form__row">
              <input id="newsletter-email" type="email" placeholder="name@example.com" disabled />
              <button type="submit" disabled>
                Coming Soon
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading">
          <h2>Featured issues</h2>
          <p>
            Mirror the highlights from your LinkedIn newsletter or articles. Swap these placeholders with real titles, key
            takeaways, and calls-to-action.
          </p>
        </div>
        <div className="card-grid">
          {topics.map((topic) => (
            <article key={topic} className="elevated-card">
              <h3>{topic} issue placeholder</h3>
              <p>
                Summarize the insights and link to the full issue, supporting datasets, or companion videos.
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
