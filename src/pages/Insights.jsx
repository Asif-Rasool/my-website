const drafts = [
  {
    label: "Perspective",
    title: "Article headline placeholder",
    description: "Outline the topic or question you unpack. Mention the industry lens or community served.",
  },
  {
    label: "Playbook",
    title: "Framework highlight placeholder",
    description: "Summarize the model, checklist, or canvas you share.",
  },
  {
    label: "Update",
    title: "News or announcement placeholder",
    description: "Tease upcoming releases, collaborations, or milestones.",
  },
];

export default function Insights() {
  return (
    <div className="insights-view">
      <section className="page-section">
        <div className="section-heading">
          <div>
            <h2>Insights & writing</h2>
            <p>
              Turn your LinkedIn posts, newsletter issues, and long-form essays into a curated feed of thought leadership.
            </p>
          </div>
        </div>
        <div className="card-grid">
          {drafts.map((post) => (
            <article key={post.title} className="elevated-card">
              <span className="badge">{post.label}</span>
              <h3>{post.title}</h3>
              <p>{post.description}</p>
              <p className="muted">Publish date placeholder · Read time placeholder</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading">
          <h2>Stay in the loop</h2>
          <p>
            Repurpose this panel for your newsletter sign-up, LinkedIn follow button, or other distribution channels.
          </p>
        </div>
        <div className="highlight-panel">
          <p>
            Share why people subscribe-pragmatic AI, change leadership, future of work-and reinforce your publishing cadence.
          </p>
        </div>
      </section>
    </div>
  );
}
