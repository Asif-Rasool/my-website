const experiences = [
  {
    title: "Research Scientist",
    company: "Business Research Center, Southeastern Louisiana University",
    timeframe: "Feb 2025 - Present",
    summary:
      "Lead regional economics and business development research, building econometric and statistical models that guide local government and industry decisions.",
    highlights: [
      "Develop forecasting and policy analysis models that translate academic methods into tools for stakeholders across Louisiana.",
      "Secure funding and research credits to scale applied AI and econometrics pilots such as SmartField-LA and LionIDE.",
      "Author grants and publications that communicate findings to both academic and public audiences.",
    ],
  },
  {
    title: "Senior Economist",
    company: "New Mexico Taxation and Revenue Department",
    timeframe: "Jul 2023 - Oct 2024",
    summary:
      "Built predictive, econometric, and machine learning models to strengthen state revenue forecasting and fiscal analysis.",
    highlights: [
      "Produced fiscal impact reports for 20+ legislative bills and evaluated state bond proposals with data-backed recommendations.",
      "Partnered with policy teams to quantify revenue scenarios and communicate trade-offs to senior leadership.",
      "Modernized forecasting workflows to incorporate ML approaches alongside traditional econometric baselines.",
    ],
  },
  {
    title: "Graduate Research Assistant",
    company: "Penn State and Utah State University",
    timeframe: "Aug 2016 - Jul 2023",
    summary:
      "Conducted research on US agriculture, climate change, and public finance while completing graduate studies in econometrics.",
    highlights: [
      "Authored and co-authored academic papers on production heterogeneity, energy, and resource economics.",
      "Presented findings to interdisciplinary partners at conferences and workshops.",
      "Applied mixed-methods and statistical modeling to real-world policy questions and industry datasets.",
    ],
  },
  {
    title: "Business Analyst (Corporate Banking)",
    company: "Eastern Bank Limited, Dhaka, Bangladesh",
    timeframe: "Jun 2013 - Jul 2016",
    summary:
      "Built and presented corporate banking proposals and financial models while exceeding sales targets across key client segments.",
    highlights: [
      "Developed three-statement and discounted cash flow models, plus Monte Carlo simulations for client pitches.",
      "Collaborated with credit teams to build consumer credit risk models as a management trainee.",
      "Led client, industry, and competitor research to shape asset valuations and investment recommendations.",
    ],
  },
  {
    title: "Associate, Product Team",
    company: "Standard Chartered Bank, Dhaka, Bangladesh",
    timeframe: "Jun 2009 - Dec 2010",
    summary:
      "Designed trade and cash products informed by competitive research and customer insights to support market growth.",
    highlights: [
      "Conducted sector and industry analysis to forecast outperformers and laggards.",
      "Created surveys, questionnaires, and focus groups to capture customer feedback for new product development.",
      "Evaluated client performance and market trends to guide product strategy.",
    ],
  },
];

export default function Experience() {
  return (
    <div className="experience-view">
      <section className="page-section">
        <div className="section-heading">
          <div>
            <h2>Experience</h2>
            <p>
              
            </p>
          </div>
          <a
            className="badge badge-link"
            href="/Resume_of_Asif_Rasool.pdf"
            download
            aria-label="Download latest resume PDF"
          >
            Download Resume (PDF)
          </a>
        </div>
        <div className="timeline">
          {experiences.map((role) => (
            <article key={role.title} className="timeline__item">
              <div className="timeline__time">{role.timeframe}</div>
              <h3>{role.title}</h3>
              <p className="muted">{role.company}</p>
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
          <div>
            <h2>My Work Life...So Far</h2>
            <p>Neighborhoods, workshops, forests, and river paths that shaped how I work today.</p>
          </div>
        </div>

        <article className="blog-entry">
          <p>
            If I had to describe my career so far, I would say it feels like walking through different neighborhoods of the
            same city. Each place had its own pace, its own noise, and its own lessons. None of them looked alike, but each
            one taught me something I still carry with me.
          </p>

          <p>
            My professional life began in Dhaka's banking world, a place that never really sleeps. At Standard Chartered
            Bank, I felt like a mechanic inside a busy workshop. I spent my days studying how financial products worked,
            talking to customers, collecting their thoughts through surveys and focus groups, and trying to design better
            solutions. It was my first lesson in understanding that behind every financial product there is a human story.
            Someone is trying to solve a problem. Someone is planning for a dream. Someone simply wants a little more
            security.
          </p>

          <p>
            From there, I stepped into Eastern Bank Limited. The pace quickened, and the air felt heavier with
            responsibility. Working in corporate banking felt like learning to drive on a crowded road. There were deadlines
            racing toward me, clients waiting with questions, and proposals that had to be refined until they were clear and
            convincing. I built financial models the way a craftsman shapes metal, slowly and with care. Cash flow
            statements, credit assessments, risk evaluations, and long hours of preparation became part of my rhythm. In
            those years, I learned how to stay calm when the pressure grew and how to find clarity when everything around me
            felt loud.
          </p>

          <p>
            A few years later, my story shifted into research. At Utah State University and then at Penn State, I found
            myself in a quieter world. Research felt like walking through a deep forest where every tree held a question.
            Data became the landscape, wide and sometimes confusing. I learned to carve insights out of that landscape with
            patience and curiosity. Some days the numbers cooperated. Other days they refused to make sense. Little by
            little, I learned how to think slowly and carefully, and how to trust the long process of discovery. Those years
            changed the way I approach every problem in my work today.
          </p>

          <p>
            Then the story leaped to the high desert of New Mexico. As a Senior Economist for the state, my work suddenly
            carried real weight. Forecasting revenue streams felt like steering a ship through unpredictable weather.
            Markets shifted like moving clouds. Policy decisions depended on how well the models could anticipate the next
            season. I built forecasting systems, automated complex processes, evaluated state bond proposals, and
            contributed to major reports. I also created Alphie, the first AI assistant for state employees, which opened
            the door to new ideas about how technology can help public service. It was a chapter filled with responsibility
            and problem solving, and it reshaped my understanding of how government works behind the scenes.
          </p>

          <p>
            Now I am at the Business Research Center at Southeastern Louisiana University. This chapter feels like a place
            where all the earlier paths meet. My role as a Research Scientist lets me build economic impact studies,
            forecasting models, AI systems, and interactive tools that help communities understand their own data. Some days
            I am building dashboards. Some days I am presenting research to local leaders. Some days I am teaching students
            who remind me of my younger self. Beneath all of this is something simple. My work is about taking something
            complex and turning it into something clear and useful. It is a kind of translation between the world of
            research and the world of everyday decisions.
          </p>

          <p>
            When I look at my career, it does not feel like climbing a ladder. It feels like following a river that flows
            through different landscapes. The early rush of banking, the thoughtful calm of research, the weight of public
            service, and the creative energy of building tools for real people have all been part of the journey.
          </p>

          <p>The river is still moving. I am still learning, still exploring new directions, and still curious about the chapters that have not yet been written.</p>
        </article>
      </section>
    </div>
  );
}
