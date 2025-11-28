const mentorshipMoments = [
  {
    title: "Peer mentoring program placeholder",
    context: "Organization · Cohort size placeholder",
    description:
      "Describe who you coach, how often you meet, and the outcomes achieved. Link to resources or success stories.",
  },
  {
    title: "Workshop or bootcamp placeholder",
    context: "Audience placeholder",
    description:
      "Summarize the curriculum you facilitate-AI literacy, analytics, leadership, or career acceleration.",
  },
  {
    title: "Community building placeholder",
    context: "Community or platform",
    description:
      "Highlight volunteer leadership, advisory boards, or community groups aligned with your LinkedIn involvements.",
  },
];

export default function Mentorship() {
  return (
    <div className="mentorship-view">
      <section className="page-section">
        <div className="section-heading">
          <div>
            <h2>Mentorship & learning</h2>
            <p>
              Map your mentorship, coaching, and facilitation work from LinkedIn into a narrative that shows how you invest
              in people.
            </p>
          </div>
          <span className="badge">People-Centered</span>
        </div>
        <div className="timeline">
          {mentorshipMoments.map((item) => (
            <article key={item.title} className="timeline__item">
              <h3>{item.title}</h3>
              <p className="muted">{item.context}</p>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading">
          <h2>Resources for mentees</h2>
          <p>
            Convert these slots into the playbooks, templates, or office hours you already provide-just plug in links and
            context.
          </p>
        </div>
        <div className="card-grid">
          <article className="elevated-card">
            <h3>Guidance toolkit placeholder</h3>
            <p>
              Point to onboarding docs, goal-tracking templates, or recommended reading lists for mentees.
            </p>
          </article>
          <article className="elevated-card">
            <h3>Community access placeholder</h3>
            <p>
              Outline Slack groups, LinkedIn communities, or meetups where mentees can stay engaged.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
