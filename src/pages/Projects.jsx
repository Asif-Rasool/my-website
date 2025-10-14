const projects = [
  {
    label: "Current Flagship",
    title: "Project title placeholder",
    description:
      "Describe the initiative, audience served, and measurable results. Reference the way you describe projects or featured links on LinkedIn.",
  },
  {
    label: "Innovation Pilot",
    title: "Project title placeholder",
    description:
      "Capture experiments, proofs of concept, or incubated ideas you want prospective partners to see first.",
  },
  {
    label: "Community Impact",
    title: "Project title placeholder",
    description:
      "Outline coalitions, non-profit collaborations, or volunteer-led programs.",
  },
];

export default function Projects() {
  return (
    <div className="projects-view">
      <section className="page-section">
        <div className="section-heading">
          <div>
            <h2>Projects & initiatives</h2>
            <p>
              Use these cards to translate LinkedIn featured items into deeper stories—include scope, partners, and links to
              demos, decks, or media coverage.
            </p>
          </div>
        </div>
        <div className="card-grid card-grid--three">
          {projects.map((project) => (
            <article key={project.title} className="elevated-card">
              <div className="badge">{project.label}</div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading">
          <h2>Proof points</h2>
          <p>
            Layer in quotes, stats, or visuals—just like LinkedIn rich media—to reinforce why each project matters.
          </p>
        </div>
        <div className="highlight-panel">
          <p>
            "Add a testimonial, partner quote, or data point that reflects the value of the initiative."
          </p>
        </div>
      </section>
    </div>
  );
}
