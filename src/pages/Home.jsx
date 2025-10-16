import { NavLink } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-view">
      <section className="page-section">
        <div className="intro-split">
          <div className="intro-media">
            <img src="/portrait.jpg" alt="Portrait of Asif Rasool" className="intro-image" />
          </div>
          <div className="intro-content">
            <h1 className="intro-title">Asif Rasool</h1>
            <p className="badge badge--gold intro-badge">Applied researcher • Knowledge mobilizer</p>
            
            <p>
              Hi! I'm Asif Rasool.
            </p>

             <p>
              I am an applied researcher, and my passion lies in leveraging technology to help people make better decisions. I focus on building models (economic, econometric, machine learning, deep learning, etc.) because of their potential to improve lives, enhance management decisions, and support data-driven strategies. Toward this end, I also explore the roles that artificial intelligence, social communities, and advanced modeling techniques can play in strengthening the strategic decisions of stakeholders at all levels and scales.
            </p>
            <p>
              I am also passionate about finding ways to apply research in everyday life. In fact, my current projects reflect my ongoing efforts to help communities benefit directly from research. I am an avid advocate for using AI tools. Artificial intelligence has been around for decades, but it is now gaining widespread attention with the rise of generative AI. My current work focuses on helping local stakeholders leverage not only the power of generative AI but also other AI-driven approaches, such as advanced econometrics, statistical modeling, machine learning, and deep learning, all of which fall under the broader field of artificial intelligence.
            </p>
            <p>
              I am a Research Scientist at Southeastern Louisiana University's Business Research Center (BRC), where I research, build, and develop tools to support local government agencies, businesses, and other stakeholders in conducting economic impact studies and building models.
            </p>
            <p>
              Outside of work, I live near New Orleans, have a cat named Razor, and one wife (who is smarter than me, please do not tell her that!).
            </p>
            <div className="hero-actions">
              <NavLink className="pill-button" to="/experience">
                View Experience
              </NavLink>
              <NavLink className="pill-button subtle-button" to="/chat-with-razor">
                Chat with rAI-zor
              </NavLink>
            </div>
          </div>
        </div>

        <div className="section-heading">
          <div>
            <h2>What you will find here</h2>
            <p>
              Each section mirrors the way your work is organized on LinkedIn—roles, projects, thought leadership, and advisory offerings—wrapped in the polished look and feel of our dashboard builds.
            </p>
          </div>
        </div>
        <div className="card-grid card-grid--three">
          <article className="elevated-card">
            <h3>Experience timeline</h3>
            <p>
              Showcase your headline roles with context, impact metrics, and standout initiatives drawn directly from your LinkedIn experience section.
            </p>
          </article>
          <article className="elevated-card">
            <h3>Signature projects</h3>
            <p>
              Capture the product launches, innovation pilots, and community programs you champion, ready for links and rich media.
            </p>
          </article>
          <article className="elevated-card">
            <h3>Thought leadership</h3>
            <p>
              Surface articles, talks, and podcasts so visitors see your perspective on AI, operations, and workforce development at a glance.
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
              Highlight collaborations, mentorship initiatives, or cross-industry alliances that reflect your leadership footprint.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
