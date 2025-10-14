const experiences = [
  {
    title: "Add your current role title",
    company: "Company · Location placeholder",
    timeframe: "Year – Present",
    summary:
      "Summarize the scope of your impact—teams led, KPIs moved, major initiatives delivered. Pull language straight from LinkedIn.",
    highlights: [
      "Highlight a flagship program with metrics.",
      "Mention a cross-functional collaboration or product launch.",
      "Note recognition, awards, or growth outcomes.",
    ],
  },
  {
    title: "Add a previous leadership role",
    company: "Organization placeholder",
    timeframe: "Year – Year",
    summary:
      "Call out how you evolved the organization, modernized systems, or transformed strategy during this tenure.",
    highlights: [
      "Bullet 1 placeholder.",
      "Bullet 2 placeholder.",
    ],
  },
  {
    title: "Earlier experience placeholder",
    company: "Company or institution",
    timeframe: "Year – Year",
    summary:
      "Use this slot for formative roles, fellowships, or entrepreneurial ventures from your LinkedIn history.",
    highlights: [
      "Highlight a foundational accomplishment.",
    ],
  },
];

export default function Experience() {
  return (
    <div className="experience-view">
      <section className="page-section">
        <div className="section-heading">
          <div>
            <h2>Experience snapshot</h2>
            <p>
              Replace the placeholders below with the roles, achievements, and metrics you already share on LinkedIn. The
              layout mirrors a clean CV timeline while preserving the aesthetic of AsifRasool.net.
            </p>
          </div>
          <span className="badge">LinkedIn Import Ready</span>
        </div>
        <div className="timeline">
          {experiences.map((role) => (
            <article key={role.title} className="timeline__item">
              <h3>{role.title}</h3>
              <p className="muted">{role.company} · {role.timeframe}</p>
              <p>{role.summary}</p>
              <ul>
                {role.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading">
          <h2>Career highlights</h2>
          <p>
            Use this table for quick facts—team size, budgets, certifications, marquee partners—anything you would normally
            showcase as featured items on LinkedIn.
          </p>
        </div>
        <div className="highlight-panel">
          <table className="info-table">
            <thead>
              <tr>
                <th scope="col">Focus</th>
                <th scope="col">Details</th>
                <th scope="col">Next step</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Strategic Leadership</td>
                <td>Insert a concise metric or milestone (e.g., "Scaled AI initiative across X departments").</td>
                <td>Link to project or case study.</td>
              </tr>
              <tr>
                <td>Operational Excellence</td>
                <td>Document efficiency gains, revenue impact, or customer outcomes.</td>
                <td>Add dashboards, reports, or testimonials.</td>
              </tr>
              <tr>
                <td>Community & Mentorship</td>
                <td>Call out mentorship programs, volunteer leadership, or ecosystem-building roles.</td>
                <td>Point to mentoring platforms or contact forms.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
