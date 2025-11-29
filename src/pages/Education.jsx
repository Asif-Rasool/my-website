const education = [
  {
    degree: "M.Sc. in Computer Science (OMSCS)",
    school: "Georgia Institute of Technology, Atlanta, GA",
    timeframe: "In progress",
    focus: "Specialization: Machine Learning and Artificial Intelligence.",
    highlights: [
      "Deepens AI/ML toolkit to pair with econometrics for decision support models.",
      "Applies coursework to build production-ready prototypes alongside research work.",
    ],
  },
  {
    degree: "Ph.D. in Quantitative Economics & Econometrics",
    school: "Pennsylvania State University, State College, PA",
    timeframe: "Completed",
    focus:
      "Econometrics, energy and resource economics, industrial organization.",
    highlights: [
      "Published research on production heterogeneity and agricultural systems.",
      "Built forecasting and causal inference models applied to policy and climate questions.",
    ],
  },
  {
    degree: "M.Sc. in Applied Economics",
    school: "Utah State University, Logan, UT",
    timeframe: "Completed",
    focus: "Applied micro and macroeconomics with quantitative methods.",
    highlights: [
      "Developed econometric models for agriculture and public finance applications.",
      "Presented findings to multidisciplinary partners and regional stakeholders.",
    ],
  },
  {
    degree: "M.B.A. in Finance",
    school:
      "University of Dhaka, Institute of Business Administration, Dhaka, Bangladesh",
    timeframe: "Completed",
    focus: "Finance, with emphasis on corporate analysis and decision-making.",
    highlights: [
      "Built financial modeling skills that underpin later econometrics and forecasting work.",
      "Strengthened business communication through client-facing presentations.",
    ],
  },
  {
    degree: "B.B.A. in Finance, Accounting, and Economics",
    school: "North South University, Dhaka, Bangladesh",
    timeframe: "Completed",
    focus:
      "Foundation in finance, accounting, and economics with quantitative methods.",
    highlights: [
      "Grounded core quantitative and analytical skills used across later graduate research.",
    ],
  },
];

const certifications = [
  {
    category: "Data Science, Machine Learning, and AI",
    items: [
      {
        title: "Machine Learning and AI Foundations: Decision Trees with SPSS",
        provider: "LinkedIn Learning",
        date: "March 2023",
        link: "https://www.linkedin.com/learning/certificates/c0e7d697dfaf7b8679c52190fed0baa8d7b10662f3770c698da35e2d7c17b4da",
        description:
          "Focuses on supervised learning workflows and decision-tree modeling, complementing my predictive modeling expertise used in state revenue forecasting, clustering work, and AI-based economic analysis.",
      },
      {
        title: "Designing for Neural Networks and AI Interfaces",
        provider: "LinkedIn Learning",
        date: "February 2023",
        link: "https://www.linkedin.com/learning/certificates/4bf737d37afbb40b19c3f6b12902949f82fd49c244e0651044c17049ffc435c5",
        description:
          'Strengthens my understanding of human-AI interaction and model-driven interfaces, supporting my applied work developing "Alphie," the first AI assistant for New Mexico state employees.',
      },
      {
        title: "Data Science with R Programming",
        provider: "SkillUp Online",
        date: "October 2022",
        link: "https://drive.google.com/file/d/10pLHy6oIZ_TvvRGbn9WQG3NthF5VCQ9J/view",
        description:
          "Provided structured training in statistical computing, data wrangling, and visualization, building on the R-based econometrics and causal inference work in my academic and professional research.",
      },
    ],
  },
  {
    category: "Programming Foundations",
    items: [
      {
        title: "Complete Python Mastery",
        provider: "Code with Mosh",
        date: "December 2020",
        credentialId: "cert_nn1ykycv",
        link: "https://drive.google.com/file/d/1RK3ueCArOnVKPno1hQ6vof3fl4K4Ebyi/view",
        description:
          "Strengthens the Python foundation that underpins my machine learning pipelines, automation at the New Mexico Taxation & Revenue Department, and current research tools.",
      },
      {
        title: "Complete SQL Mastery",
        provider: "Code with Mosh",
        date: "December 2020",
        credentialId: "cert_pdgwm6bk",
        link: "https://drive.google.com/file/d/1e36xaZj2-mtBO1YdSnA7ortilzu9YrA1/view",
        description:
          "Enhances relational-database querying and ETL competencies used in predictive modeling, state revenue data pipelines, and applied econometrics work.",
      },
    ],
  },
  {
    category: "Diversity, Equity, and Inclusion (DEI)",
    items: [
      {
        title: "Moving from Bias to Inclusion in a DEI Journey",
        provider: "Skillsoft",
        date: "April 2023",
        link: "https://skillsoft.digitalbadges.skillsoft.com/f02fdd75-9615-4246-b745-423c76af0baa#acc.R7CFOqPJ",
        description:
          "Strengthens cultural competence and inclusive leadership skills - valuable when collaborating with interdisciplinary teams and external stakeholders.",
      },
      {
        title: "Understanding Unconscious Bias",
        provider: "Skillsoft",
        date: "April 2023",
        link: "https://skillsoft.digitalbadges.skillsoft.com/91fbcbd3-aaea-4521-8d97-8264673ea7ae#acc.W7sY4kqD",
        description:
          "Focuses on recognizing and mitigating cognitive bias, enhancing decision-making and interpersonal communication in research and policy-driven roles.",
      },
      {
        title: "Workplace Diversity, Equity, and Inclusion in Action",
        provider: "Skillsoft",
        date: "April 2023",
        link: "https://skillsoft.digitalbadges.skillsoft.com/49ffb579-565e-4942-90f9-bc9669fc61f1#acc.fyRvn5jL",
        description:
          "Covers practical DEI strategies for modern workplaces, strengthening my ability to lead inclusive research teams and engage diverse community partners.",
      },
    ],
  },
];

export default function Education() {
  return (
    <div className="experience-view">
      <section className="page-section">
        <div className="section-heading">
          <div>
            <h2>Education</h2>
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
          {education.map((item) => (
            <article key={item.degree} className="timeline__item">
              <h3>{item.degree}</h3>
              <p className="muted">
                {item.school} - {item.timeframe}
              </p>
              <p>{item.focus}</p>
              <ul>
                {item.highlights.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading">
          <div>
            <h2>Certifications</h2>
            <p className="muted">
              My professional development spans analytics, machine learning, and
              programming. These certifications complement my advanced training
              in econometrics and applied machine learning, reinforcing the
              technical skills used throughout my research.
            </p>
          </div>
        </div>

        <div className="timeline">
          {certifications.map((group) => (
            <article key={group.category} className="timeline__item">
              <h3>{group.category}</h3>
              <div className="card-grid">
                {group.items.map((cert) => (
                  <div
                    key={`${cert.title}-${cert.date}`}
                    className="elevated-card cert-card"
                  >
                    <h4>{cert.title}</h4>
                    <p className="muted">
                      {cert.provider}, {cert.date}
                      {cert.credentialId
                        ? ` | Credential ID: ${cert.credentialId}`
                        : ""}
                    </p>
                    <p>{cert.description}</p>
                    <a
                      className="badge badge-link"
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View credential
                    </a>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading">
          <div>
            <h2>My Learning Journey (A Reflection)</h2>
          </div>
        </div>

        <article className="blog-entry">
          <p>
            When I look back at my education, it feels like flipping through the
            chapters of a long, colorful book. Each chapter has its own setting,
            its own characters, and its own lessons. Some pages were smooth,
            others were smudged with crossed-out ideas and late-night reworks,
            but together they form the story of how I became the thinker I am
            today.
          </p>

          <p>
            The first chapter begins at North South University in Dhaka. I
            entered that campus like someone stepping into a huge library for
            the first time, not sure where to start but excited by the
            possibilities. My classes in finance, accounting, economics, and
            math felt like learning the alphabets of a new language. I did not
            have a map or a big plan. I simply followed my curiosity, trying to
            understand why companies make certain choices and how markets rise
            and fall like tides. Dhaka was loud and fast, but in the middle of
            all that noise, I learned discipline and teamwork, the way a young
            plant learns to grow strong even in busy soil.
          </p>

          <p>
            Growing up in a developing country, education often felt like a
            ticket to survival. Everyone focused on job security, not passion.
            At the time, engineering was losing its shine, and business studies
            had become the trend. I chose it almost casually, without knowing
            what it would unlock for me later. Looking back now, I smile at how
            life works. As Forrest Gump said, life is a box of chocolates, and I
            happened to pick a sweet one.
          </p>

          <p>
            The next chapter took me to the Institute of Business Administration
            at the University of Dhaka. If my undergraduate years were about
            learning the alphabet, my MBA felt like learning to write full
            sentences. Every class offered a new way to see decisions, risks,
            and leadership. It was like someone handed me a better pair of
            glasses. Suddenly, things I had seen before looked sharper. I
            understood not just the numbers but the stories behind them, the way
            a musician begins to hear the meaning behind the notes instead of
            just the melody.
          </p>

          <p>
            Then the scenery changed completely. My move to Utah State
            University for my master's degree felt like planting myself in new
            soil. Everything was different - the weather, the culture, even the
            silence. But it was in this quiet place that I learned to work
            deeply with data. I treated datasets the way a mechanic treats an
            engine, taking them apart piece by piece to see what was happening
            inside. Some days, the numbers cooperated. Other days, they behaved
            like stubborn puzzle pieces that refused to fit. Slowly, I learned
            patience and the art of asking the right questions. This was the
            chapter where I realized I enjoyed solving problems that did not
            have immediate answers.
          </p>

          <p>
            My PhD at Penn State became the longest and most demanding chapter,
            the kind where the main character gets lost in a maze only to walk
            out with a deeper understanding of the world. A doctoral journey is
            exactly that - a maze. You turn corners, run into dead ends, redraw
            your map, and keep walking. Models break, arguments fall apart, and
            experiments refuse to behave. But every setback sharpens you. By the
            time I defended my dissertation, I felt like someone who had learned
            to navigate fog. Even when I could not see the whole path, I had
            learned to trust the next step.
          </p>

          <p>
            After finishing the PhD, the story could have ended there. But there
            was another chapter waiting. I joined the Georgia Tech Online
            Master's in Computer Science, and it felt like discovering a new
            room in a house I thought I already knew well. Studying computer
            science while working full time was like juggling two torches. There
            were moments when I felt overwhelmed, but I also felt alive. Each
            course added new tools to my kit, from algorithms that mimic human
            thinking to systems that can learn from data. This chapter is still
            unfolding, and I am excited to see where it leads.
          </p>

          <p>
            Looking at these chapters together, I see more than degrees. I see
            growth. Each stage gave me a new lens, like collecting tools on a
            long journey. Business taught me how people and organizations move.
            Economics taught me how to trace patterns hidden beneath the
            surface. Research taught me to sit with difficult questions.
            Computer science is teaching me to build things that never existed
            before.
          </p>

          <p>
            If I had to describe my education in one simple metaphor, it would
            be this: it has been a long walk through different landscapes. Some
            were cities, some were mountains, some were quiet fields. But with
            every landscape, I picked up something that helped me walk further.
          </p>

          <p>And the best part is, I am still walking.</p>
        </article>
      </section>
    </div>
  );
}
