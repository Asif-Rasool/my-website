export default function Advisory() {
  return (
    <div className="advisory-view">
      <section className="page-section">
        <div className="section-heading">
          <div>
            <h2>Advisory & partnerships</h2>
            <p>
              Translate your LinkedIn services and call-to-action into a structured overview for prospects.
            </p>
          </div>
          <span className="badge">Partner Ready</span>
        </div>
        <div className="card-grid">
          <article className="elevated-card">
            <h3>Advisory retainer placeholder</h3>
            <p>
              Describe the cadence, deliverables, and transformation themes you cover—strategy, AI readiness, operating
              models.
            </p>
          </article>
          <article className="elevated-card">
            <h3>Workshop series placeholder</h3>
            <p>
              Outline format, audience, and the outcomes leaders can expect from your training or facilitation.
            </p>
          </article>
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading">
          <h2>Engagement tiers</h2>
          <p>
            Swap in your actual packages, pricing signals, and onboarding steps. The grid mirrors a LinkedIn services panel.
          </p>
        </div>
        <table className="info-table">
          <thead>
            <tr>
              <th scope="col">Tier</th>
              <th scope="col">What is included</th>
              <th scope="col">Next step</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Discovery Call</td>
              <td>Agenda, stakeholders, and success criteria placeholder.</td>
              <td>Link to scheduling tool.</td>
            </tr>
            <tr>
              <td>Design Sprint</td>
              <td>Deliverable summary, timeline, and artifacts placeholder.</td>
              <td>Proposal or statement of work.</td>
            </tr>
            <tr>
              <td>Embedded Partner</td>
              <td>Long-term scope, reporting rhythm, and change management plan placeholder.</td>
              <td>Contact email or CRM intake form.</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
