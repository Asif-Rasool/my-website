const projects = [
  {
    label: "SmartField LA",
    title: "SmartField LA",
    description:
      "End-to-end system I built for Louisiana strawberry growers: snap a leaf photo, get a Mask R-CNN diagnosis, and see an annotated preview plus a short health report. The goal is simple—help small producers catch disease early and protect yields.",
    link: "https://smartfield-la-750090776627.us-central1.run.app/",
  },
  {
    label: "SMB Growth",
    title: "Marketing Campaign ROI Model",
    description:
      "Budget-allocation tool for small and mid-sized businesses. I organized historical marketing data, built channel-level forecasting logic, and paired it with Lion AI so owners can tweak spend and see ROI forecasts instantly.",
    link: "https://mkt-mix-model-750090776627.us-central1.run.app/",
  },
  {
    label: "Community Impact",
    title: "Livingston Parish Library Economic Impact Model",
    description:
      "Hybrid input-output model I led to show the library’s full value. Users plug in budgets and programs to see direct, indirect, and induced effects on jobs, output, and tax revenue, with Lion AI explaining results in plain language.",
    link: "https://livingston-parish-library-750090776627.us-central1.run.app/",
  },
  {
    label: "Energy Forecasting",
    title: "ThunderHorse Energy Forecasting Model",
    description:
      "Forecasting platform I’m building with Geoffrey Bostwick for Louisiana’s energy sector. It blends econometrics and ML with live market pipelines to deliver forward-looking price and production forecasts, with transparent assumptions users can adjust.",
    link: "https://southeastern-oil-price-model-prod-391671390696.us-central1.run.app/",
  },
  {
    label: "Data Platform",
    title: "LionIDE",
    description:
      "Interactive analytics platform I built at the Business Research Center to compare economic data across Louisiana parishes, states, and global regions. Designed for public release so students and community partners can explore without barriers.",
    link: "https://southeastern-lionide-750090776627.us-central1.run.app/",
  },
];

export default function Projects() {
  return (
    <div className="projects-view">
      <section className="page-section">
        <div className="section-heading">
          <div>
            <h2>Current Projects</h2>
            <p></p>
          </div>
        </div>
        <div className="card-grid card-grid--three">
          {projects.map((project) => (
            <article key={project.title} className="elevated-card">
              <div className="badge">{project.label}</div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="card-actions">
                <a
                  className="badge badge-link"
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open the ${project.title} demo`}
                >
                  View demo
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

    </div>
  );
}
