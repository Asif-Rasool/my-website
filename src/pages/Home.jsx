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
            <p className="intro-titles">Applied Researcher</p>
            <h1 className="intro-title">Asif Rasool</h1>
            
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
              I am a Research Scientist at Southeastern Louisiana University's Business Research Center (BRC), where I research, build, and develop tools to support local government agencies, businesses, and other stakeholders in conducting research studies and building models.
            </p>
            <p>
              Outside of work, I live near New Orleans, have a cat named Razor, and one wife (who is smarter than me, please do not tell her that!).
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
          <NavLink className="elevated-card nav-tile" to="/experience">
            <h3>Experience</h3>
            <p>Roles, impact, and highlights across programs and teams.</p>
          </NavLink>
          <NavLink className="elevated-card nav-tile" to="/projects">
            <h3>Projects</h3>
            <p>Product launches, pilots, and analytics builds with outcomes.</p>
          </NavLink>
          <NavLink className="elevated-card nav-tile" to="/speaking">
            <h3>Speaking</h3>
            <p>Talks and panels on applied AI, data strategy, and leadership.</p>
          </NavLink>
          <NavLink className="elevated-card nav-tile" to="/insights">
            <h3>Insights</h3>
            <p>Articles and notes capturing methods, playbooks, and lessons.</p>
          </NavLink>
          <NavLink className="elevated-card nav-tile" to="/advisory">
            <h3>Advisory</h3>
            <p>How I help teams adopt AI and analytics with measurable value.</p>
          </NavLink>
          <NavLink className="elevated-card nav-tile" to="/mentorship">
            <h3>Mentorship</h3>
            <p>Guidance for students and professionals growing in applied AI.</p>
          </NavLink>
          <NavLink className="elevated-card nav-tile" to="/newsletter">
            <h3>Newsletter</h3>
            <p>Occasional updates on projects, tools, and community efforts.</p>
          </NavLink>
          <NavLink className="elevated-card nav-tile" to="/chat-with-razor">
            <h3>Chat with rAI-zor</h3>
            <p>Ask my AI assistant about my work, projects, and approach.</p>
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
          <a className="elevated-card social-tile" href="https://www.linkedin.com/in/asif-rasool-is-here/" target="_blank" rel="noopener noreferrer">
            <img src="/linkedin.png" alt="LinkedIn" className="social-tile__icon" />
            <span className="social-tile__label">LinkedIn</span>
          </a>
          <a className="elevated-card social-tile" href="/CV%20of%20Asif%20Rasool%20for%20Evaluation.docx" target="_blank" rel="noopener noreferrer">
            <img src="/cv.png" alt="Curriculum Vitae" className="social-tile__icon" />
            <span className="social-tile__label">Curriculum Vitae</span>
          </a>
          <a className="elevated-card social-tile" href="https://github.com/Asif-Rasool" target="_blank" rel="noopener noreferrer">
            <img src="/github.png" alt="GitHub" className="social-tile__icon" />
            <span className="social-tile__label">GitHub</span>
          </a>
          <a className="elevated-card social-tile" href="https://scholar.google.com/citations?user=rd3ut40AAAAJ&hl=en&authuser=1" target="_blank" rel="noopener noreferrer">
            <img src="/googlescholar.png" alt="Google Scholar" className="social-tile__icon" />
            <span className="social-tile__label">Google Scholar</span>
          </a>
          <NavLink className="elevated-card social-tile" to="/newsletter">
            <img src="/news%20letter.png" alt="Newsletter" className="social-tile__icon" />
            <span className="social-tile__label">Newsletter</span>
          </NavLink>
          <a className="elevated-card social-tile" href="https://www.southeastern.edu/employee/asif-rasool/" target="_blank" rel="noopener noreferrer">
            <img src="/workwebste.png" alt="Work Website" className="social-tile__icon" />
            <span className="social-tile__label">Work Website</span>
          </a>
        </div>
      </section>
    </div>
  );
}
