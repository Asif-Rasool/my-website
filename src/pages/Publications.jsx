import { useEffect, useState } from "react";

const FIR_FILE_URL = "/FIR%20Abstracts.txt";
const FIR_ENTRY_PATTERN =
  "\\s*(?:Title\\r?\\n)?([^\\r\\n]+)\\r?\\n(?:\\r?\\n)+(?:Authors\\r?\\n)?([^\\r\\n]+)\\r?\\n(?:\\r?\\n)+Abstract\\r?\\n(?:\\r?\\n)*([\\s\\S]*?)(?=\\r?\\n(?:Title\\r?\\n)?[^\\r\\n]+\\r?\\n(?:\\r?\\n)+(?:Authors\\r?\\n)?[^\\r\\n]+\\r?\\n(?:\\r?\\n)+Abstract|$)";
const FIR_OUTLET = "New Mexico Taxation and Revenue Department";

const staticPublications = [
  {
    title:
      "Temporary Event, Lasting Impact: A Regional Economic Assessment of the Hammond Airshow",
    citation:
      "Rasool, A. (2026). *Temporary Event, Lasting Impact: A Regional Economic Assessment of the Hammond Airshow*.",
    type: "Economic Impact Study",
    outlet: "Business Research Center, Southeastern Louisiana University",
    year: 2026,
    chronologyOrder: 1,
    authors: "Asif Rasool",
    summary:
      "Regional economic impact analysis of the Hammond Airshow using a parish-level Social Accounting Matrix for Tangipahoa Parish, estimating output, jobs, value added, and tax effects from organizer and non-local visitor spending.",
    abstract:
      "This study assesses the economic impact of the Hammond Airshow on the Northshore region using a parish-level Social Accounting Matrix framework for Tangipahoa Parish, Louisiana. Model inputs were constructed from organizer financial statements, observed vendor sales, and attendance estimates inferred from ticket and parking activity. To isolate net new regional activity, the analysis includes only spending by non-local visitors and separates organizer spending from visitor spending to avoid double counting. The results indicate that the Airshow generated approximately $1.55 million in total output, supported 13.36 jobs, produced about $727,078 in value added, and generated an estimated $157,424 in combined tax impacts. Direct effects account for the largest share of each impact measure, while indirect and induced effects extend gains through local supply chains and household spending. The strongest effects are concentrated in performing arts, advertising and public relations, professional services, food service, and lodging. The findings suggest that the Hammond Airshow functions as a service- and tourism-oriented economic engine whose regional contribution is anchored in event operations, visitor spending, and related multiplier effects.",
    link: "https://selu-hammond-airshow-impact.web.app/",
  },
  {
    title:
      "The Economic Contribution of Southeastern Louisiana University Athletics",
    citation:
      "Rasool, A. (2026). *The Economic Contribution of Southeastern Louisiana University Athletics*. Business Research Center, Southeastern Louisiana University.",
    type: "Economic Contribution Study",
    outlet: "Business Research Center, Southeastern Louisiana University",
    year: 2026,
    chronologyOrder: 2,
    authors: "Asif Rasool",
    summary:
      "Regional Social Accounting Matrix analysis estimating how Southeastern Louisiana University Athletics contributes to Tangipahoa Parish through recurring athletics operations and net-new visitor spending.",
    abstract:
      "This study estimates the economic contribution of Southeastern Louisiana University Athletics to Tangipahoa Parish, Louisiana. The analysis uses a regional Social Accounting Matrix-based framework to estimate the local effects of athletics operations and net-new visitor spending. The model separates recurring athletics operations from visitor-related spending to reduce double counting and distinguish local economic activity from spending leakage. Under the conservative case, Southeastern Athletics supports an estimated $16.46 million in total output, $10.72 million in value added, $6.83 million in labor income, 150.08 jobs, and $1.29 million in tax revenue. Under the moderate visitor spending case, the estimated contribution increases to $19.49 million in total output, $12.33 million in value added, $7.65 million in labor income, 178.66 jobs, and $1.73 million in tax revenue.",
    link: "/SELU_Athletics_Economic_Contribution_Accessible.pdf",
  },
  {
    title:
      "Heterogeneity in U.S. Farms: A New Clustering by Production Potentials",
    citation:
      "Rasool, A., & Abler, D. (2023). *Heterogeneity in U.S. Farms: A New Clustering by Production Potentials*. Agriculture, 13(2), 258.",
    type: "Article",
    outlet: "Agriculture 13(2): 258",
    year: 2023,
    authors: "Asif Rasool; David Abler",
    summary:
      "Agglomerative hierarchical clustering of 2,778 farming-defined counties into six groups, showing how farm size, assets, labor, output, mechanization, and government programs shape production potential across the contiguous U.S.",
    abstract:
      "This paper uses agglomerative hierarchical cluster analysis to group 2778 farming-defined counties into six clusters, revealing farm patterns across the contiguous 48 states of the United States. To understand the differences in economic performance and improve farm households' well-being, economists have endeavored to identify patterns in US farming. The US is a leading global producer and exporter of many agricultural and food products. Our primary objective is to construct a policy-relevant farm clustering to characterize agricultural homogeneity in US farms' production potential. We identify six clusters that are relatively homogeneous in five dimensions: farm size, farm assets, farm labor, farm output, degree of mechanization, and government programs. Minimizing diversity within a cluster allows for analysis of public policy changes on specific clusters and comparison of differential effects of the change across clusters.",
    link: "https://doi.org/10.3390/agriculture13020258",
  },
  {
    title:
      "Investing in Agribusiness Stocks and Farmland: A Boom or Bust Analysis",
    citation:
      "Rasool, A. (2018). *Investing in Agribusiness Stocks and Farmland: A Boom or Bust Analysis*. Utah State University.",
    type: "Article",
    outlet: "Utah State University",
    year: 2018,
    authors: "Asif Rasool",
    summary:
      "Applied a copula-based approach to portfolio construction for agribusiness stocks and farmland, highlighting diversification benefits beyond traditional Markowitz assumptions and quantifying downside risk for investors focused on agriculture.",
    link: "https://www.proquest.com/docview/2070453070",
    abstract:
      "The study examines how boom and bust cycles shift asset composition in agricultural portfolios. Using a copula VaR framework to move beyond normality assumptions of modern portfolio theory, it quantifies downside risk and finds farmland dominates unconstrained portfolios across cycles, while restricted portfolios diversify but carry higher downside risk and volatility. Traditional Markowitz methods underestimate actual portfolio risk.",
  },
  {
    title:
      "Beyond Books: Estimating the Economic and Social Impact of the Livingston Parish Library",
    citation:
      "Rasool, A. (2025). *Beyond Books: Estimating the Economic and Social Impact of the Livingston Parish Library*. Business Research Center, Southeastern Louisiana University.",
    type: "Economic Impact Study",
    outlet: "Business Research Center, Southeastern Louisiana University",
    year: 2025,
    authors: "Asif Rasool",
    summary:
      "Hybrid input-output and benefit-transfer analysis showing how library programs ripple through jobs, output, tax revenue, and community value.",
    link: "https://southeastern-livingston-parish-library-prod-391671390696.us-central1.run.app/",
    abstract:
      "This study evaluates the economic and social value of the Livingston Parish Library using a mixed-method framework that integrates a Social Accounting Matrix (SAM)-based Input-Output model with a contingent valuation (CV) benefit transfer approach. Drawing on verified financial data and localized economic modeling, the analysis estimates both the tangible and the intangible returns generated by the library for the Livingston Parish community. The results show that the library's activities support more than 158 jobs, generate $8.43 million in total economic output, and contribute $6.02 million in value added to the local economy annually. These impacts yield a conventional output multiplier of 1.32, indicating that every dollar invested in the library circulates widely through the regional economy. In addition, the library delivers an estimated $2.79 million in annual intangible benefits-including access to educational programming, technology services, cultural enrichment, and community space-based on nationally benchmarked willingness-to-pay (WTP) figures and conservative reach estimates. When these non-market benefits are incorporated, the library's expanded return-on-investment multiplier rises to 1.75, meaning that each public dollar yields $1.75 in combined economic and social value. These findings align with prior research on library valuation and reinforce the position of public libraries as high-leverage, fiscally efficient community assets. The study demonstrates that even in suburban or rural settings, libraries generate substantial returns that justify continued and expanded public support.",
  },
  {
    title:
      "A Comprehensive Assessment of the Economic Impact of St. Tammany Health System on the Northshore Region",
    citation:
      "Rasool, A. (2025). *A Comprehensive Assessment of the Economic Impact of St. Tammany Health System on the Northshore Region*. Business Research Center, Southeastern Louisiana University.",
    type: "Economic Impact Study",
    outlet: "Business Research Center, Southeastern Louisiana University",
    year: 2025,
    authors: "Asif Rasool",
    summary:
      "IMPLAN-based assessment of St. Tammany Health System's economic role in the Northshore region, including operations, supply-chain effects, household re-spending, jobs, value added, household earnings, and tax revenue.",
    link: "/st-tammany-hcs.pdf",
    abstract:
      "This study estimates the 2024 economic impact of St. Tammany Health System using IMPLAN's parish-level Social Accounting Matrix. The analysis finds that the health system supported an estimated $896.2 million in total output, $552.5 million in value added, $392.8 million in household earnings, and 5,452 jobs for parish residents. The largest share came from hospital operations, while supply-chain purchases and household re-spending extended the impact across the wider economy. The study also estimates $107.6 million in tax revenues across all levels of government, underscoring the health system's dual role as a leading healthcare provider and a major regional economic engine.",
  },
  {
    title:
      "Putting the Cart Before the Horse: An Accidental Journey to Better Human-Computer Interaction",
    citation:
      "Rasool, A. (2025). *Putting the Cart Before the Horse: An Accidental Journey to Better Human-Computer Interaction*. Technical Report, Business Research Center, Southeastern Louisiana University.",
    type: "HCI Study",
    outlet: "Business Research Center, Southeastern Louisiana University",
    year: 2025,
    authors: "Asif Rasool",
    summary:
      "Documents the SmartField-LA redesign, applying structured needfinding, heuristic reviews, personas, and iterative prototypes so strawberry disease diagnostics feel intuitive for farmers, gardeners, and educators.",
    link: "/BRC%20HCI%20Project.pdf",
    abstract:
      "SmartField-LA, a deep-learning mobile app that flags strawberry plant diseases from photos, initially shipped without a true Human-Computer Interaction process. This project retrofits that workflow: six in-situ interviews with Business Research Center staff revealed friction around lighting, icon meaning, and result interpretation; complementary heuristic reviews exposed inconsistent terminology and clutter. Synthesizing the findings into themes of clarity, feedback, and environmental adaptability, the report builds personas, brainstorms interface directions (including a field/dark mode), and delivers low-fidelity prototypes with guided navigation, labeled controls, and step-by-step instructions. The outcome is a practical UX roadmap that keeps the machine-learning core while making diagnostic actions faster, clearer, and more reliable in outdoor conditions.",
  },
  {
    title:
      "Three Essays in Applied Economics: Topics in Agricultural Economics and Public Finance",
    citation:
      "Rasool, A. (2024). *Three Essays in Applied Economics: Topics in Agricultural Economics and Public Finance*. Doctoral dissertation, Pennsylvania State University.",
    type: "Dissertation",
    outlet: "Pennsylvania State University",
    year: 2024,
    authors: "Asif Rasool",
    advisors: "Advisor: Dr. Dave Abler",
    summary:
      "Doctoral dissertation covering clustering of U.S. farms, agricultural economics, and public finance, with essay one advancing the nationwide clustering of farm production potential.",
    link: "https://etda.libraries.psu.edu/files/final_submissions/29594",
    abstract:
      "Essay 1: Agglomerative hierarchical clustering of 2,778 farming-defined counties into six clusters to capture production potential across the contiguous U.S., enabling policy-relevant analysis of farm size, assets, labor, output, mechanization, and government programs. Essay 2: Built comprehensive county-level datasets to model climate change impacts on five livestock types (beef cows, milk cows, layer chickens, broiler chickens, hogs) using OLS and fixed effects with inventory shares; projected 2070 outcomes via climate models, finding effects depend on livestock type and geography. Essay 3: Identified a negative association between public transit funding and private vehicle use using propensity score matching, genetic matching, and diff-in-diff on county and household panels (NHTS, NTD, Census), showing increased transit funding reduces vehicle miles traveled by roughly 6% at both county and household levels.",
  },
];

export default function Publications() {
  const [firPublications, setFirPublications] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadFirAbstracts = async () => {
      try {
        const response = await fetch(FIR_FILE_URL);
        if (!response.ok) {
          throw new Error(`Failed to fetch FIR abstracts (${response.status})`);
        }
        const text = await response.text();
        if (!isMounted) {
          return;
        }
        setFirPublications(transformFirText(text));
      } catch (error) {
        console.error("Unable to load FIR abstracts", error);
      }
    };

    loadFirAbstracts();

    return () => {
      isMounted = false;
    };
  }, []);

  const orderedPublications = [...staticPublications, ...firPublications]
    .filter((publication) => !publication.hidden)
    .sort(
      (a, b) =>
        (b.year || 0) - (a.year || 0) ||
        (a.chronologyOrder || 0) - (b.chronologyOrder || 0)
    );
  const years = [
    ...new Set(orderedPublications.map((p) => p.year).filter(Boolean)),
  ].sort((a, b) => b - a);

  return (
    <div className="publications-view">
      <section className="page-section">
        <div className="section-heading">
          <div>
            <h2>Publications</h2>
            <p></p>
          </div>
          <a
            className="badge badge-link"
            href="https://scholar.google.com/citations?user=rd3ut40AAAAJ&hl=en&authuser=3"
            target="_blank"
            rel="noreferrer"
            aria-label="Open Google Scholar profile"
          >
            View Google Scholar
          </a>
        </div>

        <div className="timeline publications-timeline">
          {years.map((year) => (
            <div key={year} className="timeline__year-group">
              <div className="timeline__year-label">{year}</div>
              {orderedPublications
                .filter((item) => item.year === year)
                .map((item) => (
                  <article
                    key={item.title}
                    className="timeline__item publication-card"
                  >
                    <div className="badge badge--gold">{item.type}</div>
                    <h3>{item.title}</h3>
                    {item.citation ? (
                      renderCitation(item.citation, `${item.title}-citation`)
                    ) : (
                      <>
                        <p className="muted">
                          {item.outlet} - {item.year}
                        </p>
                        {item.authors && (
                          <p className="muted">Authors: {item.authors}</p>
                        )}
                      </>
                    )}
                    {item.advisors && <p className="muted">{item.advisors}</p>}
                    {(item.abstract || item.summary) && (
                      <p className="muted">
                        <strong>Abstract</strong>
                      </p>
                    )}
                    {renderParagraphs(
                      item.abstract || item.summary,
                      "muted",
                      `${item.title}-abstract`
                    )}
                    {item.link && (
                      <div className="card-actions">
                        <a
                          className="badge badge-link"
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Open ${item.title}`}
                        >
                          Read publication
                        </a>
                      </div>
                    )}
                  </article>
                ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function transformFirText(rawText) {
  const entries = parseFirAbstractEntries(rawText);
  const meta = parseApaBibliography(rawText);

  if (entries.length && meta.length && entries.length !== meta.length) {
    console.warn(
      `FIR abstracts (${entries.length}) and bibliography (${meta.length}) count mismatch.`
    );
  }

  return entries.map((entry, index) => {
    const metaEntry = meta[index] || {};
    const isTaxExpenditure = entry.title
      .toLowerCase()
      .includes("tax expenditure report");

    return {
      title: entry.title,
      type: isTaxExpenditure
        ? "Tax Expenditure Report"
        : "Fiscal Impact Report",
      outlet: FIR_OUTLET,
      year: metaEntry.year || (isTaxExpenditure ? 2023 : 2024),
      authors: entry.authors,
      summary: entry.summary,
      abstract: entry.abstract,
      link: metaEntry.link,
      citation: metaEntry.citation,
    };
  });
}

function parseFirAbstractEntries(rawText) {
  if (!rawText) {
    return [];
  }

  const cutoffIndex = rawText.indexOf("Here is a");
  const scope = cutoffIndex === -1 ? rawText : rawText.slice(0, cutoffIndex);
  const regex = new RegExp(FIR_ENTRY_PATTERN, "g");
  const entries = [];
  let match;

  while ((match = regex.exec(scope))) {
    const paragraphs = splitParagraphs(match[3]);
    const [summary, ...details] = paragraphs;

    entries.push({
      title: match[1].trim(),
      authors: match[2].trim(),
      summary: summary || "",
      abstract: details.length ? details : undefined,
    });
  }

  return entries;
}

function parseApaBibliography(rawText) {
  if (!rawText) {
    return [];
  }

  const sections = rawText.split(/\r?\n---\r?\n/);
  const apaSection = sections[1] || "";
  const lines = apaSection.split(/\r?\n/);
  const entries = [];
  let currentCitationLines = [];

  const flushEntry = (link) => {
    const citation = normalizeCitation(currentCitationLines.join(" "));
    if (!citation || !link) {
      currentCitationLines = [];
      return;
    }

    const yearMatch = citation.match(/\((\d{4})\)/);
    entries.push({
      year: yearMatch ? Number(yearMatch[1]) : undefined,
      link,
      citation,
    });
    currentCitationLines = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      continue;
    }

    if (line.startsWith("#") || line.startsWith("✅") || line.startsWith("Here")) {
      continue;
    }

    const markdownLinkMatch = line.match(
      /\[(https?:[^\]]+)\]\((https?:[^\)]+)\)/
    );
    const bracketLinkMatch = line.match(/\[(https?:[^\]]+)\]/);
    const plainLinkMatch = line.match(/(https?:\/\/\S+)/);
    const link =
      (markdownLinkMatch && markdownLinkMatch[1]) ||
      (bracketLinkMatch && bracketLinkMatch[1]) ||
      (plainLinkMatch && plainLinkMatch[1]);

    if (link) {
      const lineWithoutLink = line
        .replace(/\s*\[[^\]]+\]\([^\)]+\)\s*/g, " ")
        .replace(/\s*\[[^\]]+\]\s*/g, " ")
        .replace(/\s*https?:\/\/\S+\s*/g, " ")
        .trim();

      if (lineWithoutLink) {
        currentCitationLines.push(lineWithoutLink);
      }

      flushEntry(link);
      continue;
    }

    if (/^\d+\./.test(line)) {
      continue;
    }

    currentCitationLines.push(line);
  }

  return entries;
}

function splitParagraphs(text) {
  return text
    .split(/\r-\n\r-\n/)
    .map((segment) => segment.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function renderParagraphs(content, className, keyPrefix) {
  if (!content) {
    return null;
  }

  const paragraphs = Array.isArray(content) ? content : [content];

  return paragraphs.map((paragraph, index) => (
    <p key={`${keyPrefix}-${index}`} className={className}>
      {paragraph}
    </p>
  ));
}

function renderCitation(citation, keyPrefix) {
  if (!citation) {
    return null;
  }

  const parts = citation.split(/(\*[^*]+\*)/g).filter(Boolean);

  return (
    <p className="citation" key={keyPrefix}>
      {parts.map((part, index) => {
        const match = part.match(/^\*([^*]+)\*$/);
        if (match) {
          return (
            <em key={`${keyPrefix}-em-${index}`}>
              {match[1]}
            </em>
          );
        }

        return (
          <span key={`${keyPrefix}-txt-${index}`}>
            {part}
          </span>
        );
      })}
    </p>
  );
}

function normalizeCitation(text) {
  return text
    .replace(/\s+/g, " ")
    .replace(/\s+\./g, ".")
    .trim();
}
