import { NavLink } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-view">
      <section className="page-section">
        <div className="intro-split">
          <div className="intro-media">
            <img
              src="/portrait.jpg"
              alt="Portrait of Asif Rasool"
              className="intro-image"
            />
          </div>
          <div className="intro-content">
            <p className="intro-titles">Applied Researcher</p>
            <h1 className="intro-title">Asif Rasool</h1>

            <p>Hi! I'm Asif Rasool.</p>

            <p>
              I am an applied researcher, and my passion lies in leveraging
              technology to help people make better decisions. I focus on
              building models (economic, econometric, machine learning, deep
              learning, etc.) because of their potential to improve lives,
              enhance management decisions, and support data-driven strategies.
              Toward this end, I also explore the roles that artificial
              intelligence, social communities, and advanced modeling techniques
              can play in strengthening the strategic decisions of stakeholders
              at all levels and scales.
            </p>
            <p>
              I am also passionate about finding ways to apply research in
              everyday life. In fact, my current projects reflect my ongoing
              efforts to help communities benefit directly from research. I am
              an avid advocate for using AI tools. Artificial intelligence has
              been around for decades, but it is now gaining widespread
              attention with the rise of generative AI. My current work focuses
              on helping local stakeholders leverage not only the power of
              generative AI but also other AI-driven approaches, such as
              advanced econometrics, statistical modeling, machine learning, and
              deep learning, all of which fall under the broader field of
              artificial intelligence.
            </p>
            <p>
              I am a Research Scientist at Southeastern Louisiana University's
              Business Research Center (BRC), where I research, build, and
              develop tools to support local government agencies, businesses,
              and other stakeholders in conducting research studies and building
              models.
            </p>
            <p>
              Outside of work, I live near New Orleans, have one cat named
              Razor, and one wife (who is smarter than me, please do not tell
              her that!).
            </p>
            {/* Buttons removed in favor of navigation tiles below */}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading section-heading--center">
          <div>
            <h2>Navigation</h2>
          </div>
        </div>
        <div className="card-grid nav-tiles">
          <NavLink className="elevated-card nav-tile" to="/projects">
            <h3>Projects</h3>
            <p>Current exciting projects and research.</p>
          </NavLink>
          <NavLink className="elevated-card nav-tile" to="/publications">
            <h3>Publications</h3>
            <p>
              Peer-reviewed work, reports, fiscal, and economic impact studies.
            </p>
          </NavLink>
          <NavLink className="elevated-card nav-tile" to="/experience">
            <h3>Experience</h3>
            <p>Roles, responsibilities, and achievements.</p>
          </NavLink>
          <NavLink className="elevated-card nav-tile" to="/education">
            <h3>Education</h3>
            <p>Degrees, certificates concentrations, and learnings.</p>
          </NavLink>
          <NavLink className="elevated-card nav-tile" to="/chat-with-razor">
            <h3>Chat with rAI-zor</h3>
            <p>Ask my AI assistant about my work, projects, and research.</p>
          </NavLink>
          <NavLink className="elevated-card nav-tile" to="/contact">
            <h3>Contact</h3>
            <p>Let's connect and collaborate!</p>
          </NavLink>
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading section-heading--center">
          <div>
            <h2>Social & anti-social media</h2>
            <p>Find me around the web.</p>
          </div>
        </div>
        <div className="card-grid social-grid">
          <a
            className="elevated-card social-tile"
            href="https://www.linkedin.com/in/asif-rasool-is-here/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/linkedin.png"
              alt="LinkedIn"
              className="social-tile__icon"
            />
            <span className="social-tile__label">LinkedIn</span>
          </a>
          <a
            className="elevated-card social-tile"
            href="/CV%20of%20Asif%20Rasool%20for%20Evaluation.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/cv.png"
              alt="Curriculum Vitae"
              className="social-tile__icon"
            />
            <span className="social-tile__label">Curriculum Vitae</span>
          </a>
          <a
            className="elevated-card social-tile"
            href="https://github.com/Asif-Rasool"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/github.png" alt="GitHub" className="social-tile__icon" />
            <span className="social-tile__label">GitHub</span>
          </a>
          <a
            className="elevated-card social-tile"
            href="https://scholar.google.com/citations?user=rd3ut40AAAAJ&hl=en&authuser=3"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/googlescholar.png"
              alt="Google Scholar"
              className="social-tile__icon"
            />
            <span className="social-tile__label">Google Scholar</span>
          </a>
          <a
            className="elevated-card social-tile"
            href="https://www.southeastern.edu/employee/asif-rasool/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/workwebste.png"
              alt="Work Website"
              className="social-tile__icon"
            />
            <span className="social-tile__label">Work Website</span>
          </a>
        </div>
      </section>
    </div>
  );
}
