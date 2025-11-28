const appearances = [
  {
    label: "Keynote",
    title: "Session title placeholder",
    description: "Introduce the conference, theme, and takeaway moments."
  },
  {
    label: "Podcast",
    title: "Episode title placeholder",
    description: "Share the host, topic, and a memorable sound bite or data point."
  },
  {
    label: "Press",
    title: "Coverage headline placeholder",
    description: "Explain why the outlet covered you-product launch, research release, or community impact."
  }
];

export default function Speaking() {
  return (
    <div className="speaking-view">
      <section className="page-section">
        <div className="section-heading">
          <div>
            <h2>Speaking & media</h2>
            <p>
              Document your voice-from conference stages to recorded conversations-so visitors can quickly see where you
              show up.
            </p>
          </div>
        </div>
        <div className="card-grid card-grid--three">
          {appearances.map((item) => (
            <article key={item.title} className="elevated-card">
              <span className="badge">{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading">
          <h2>Speaker kit</h2>
          <p>
            Link to bios, headshots, and talk topics-anything your LinkedIn feature section references for event planners.
          </p>
        </div>
        <div className="highlight-panel">
          <ul>
            <li>Downloadable press photos placeholder.</li>
            <li>Updated bio and talk descriptions placeholder.</li>
            <li>Booking and media contact placeholder.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
