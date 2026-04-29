import Link from 'next/link';

const summary = 'Finance Systems Manager with 10 years of experience designing and implementing enterprise solutions for high-growth tech companies. Expertise spans core enterprise applications—including ERP, CRM, EPM, and TMS—alongside specialized experience in integration platforms and the development of custom business applications. Proven track record of leading cross-functional teams, optimizing business processes, and supporting companies through critical growth phases, including IPO readiness and M&A. Adept at bridging technical capabilities and business needs to drive efficiency and scalability.';

const experience = [
  {
    company: 'Reddit',
    title: 'Finance Systems Manager',
    period: '2021 – Present',
    location: 'Chicago, IL',
    bullets: [
      'Owned the end-to-end finance technology roadmap, identifying mission-critical gaps and executing the full-cycle development and configuration of core applications (Quoting, Billing, Commissions, Treasury, and Crypto) in deep partnership with Sales, Finance, and Accounting to accelerate financial close and scale product offerings.',
      'Reshaped the end-to-end order management lifecycle by streamlining operational workflows and architecting the supporting technical stack (CRM, Ads, and ERP integration); reduced month-end close from 12 days to 3 during rapid $200M–$2.2B+ revenue scaling.',
      'Spearheaded IPaaS tooling adoption, creating 20+ integrations to streamline Sales, Finance, and HR processes, eliminating manual tasks, saving thousands of hours of work annually, and providing a framework for enterprise Agentic AI capabilities.',
      'Architected a finance data warehouse, integrating complex sources (NetSuite, Adaptive, Coupa, Kyriba) to enable self-service analytics and power a custom Gemini Enterprise AI agent for real-time insights.',
      'Built an autonomous AI agent for bank-to-book reconciliation and AR cash application; replacing rigid SaaS vendors with a custom engine that combines deterministic logic with OCR and LLMs to increase accuracy.',
      'Implemented a custom subledger accounting tool to automate GL entries and reporting for high-volume D2C streams (Subscriptions, Awards, NFTs across iOS, Google Play, Stripe, and PayPal), effectively eliminating back-office bottlenecks and empowering product teams to accelerate go-to-market velocity.',
      'Led multiple RFPs to identify software solutions, establishing criteria for vendor selection for Treasury Management, Cash Application, AR Automation, and Professional Services support.',
    ],
  },
  {
    company: 'Deloitte Digital',
    title: 'Senior Consultant',
    period: '2017 – 2021',
    location: 'Chicago, IL',
    bullets: [
      'Product owner at Meta for a custom IT application modeling and forecasting data center costs. Led front-end (React JS) and back-end (Python, PHP) development through agile sprints and stakeholder workshops with Finance Directors, Technical Program Managers, and Sourcing Managers.',
      'Designed automated ASC 606 compliant Revenue Recognition scenarios for a U.S. RPA solution provider, collaborating with Sales, Order Management, Fulfillment, and Finance teams.',
      'Implemented a CRM and Order Management system for a $3B+ global warehousing client, customizing modules for order entry, fulfillment, inventory management and returns on NetSuite.',
      'Consulted at Cloudflare pre-IPO to scale procurement and order management systems, Implemented Dell Boomi to integrate and streamline the order management process, selected and configured a subscription billing tool, and developed a cash application tool to improve DSO.',
      "'Lead to Order,' 'Order to Cash,' and Revenue Recognition lead for five full-cycle ERP and CRM implementations.",
    ],
  },
  {
    company: 'Baker Tilly',
    title: 'Consultant',
    period: '2016 – 2017',
    location: 'Chicago, IL',
    bullets: [
      'Implemented ERP and Manufacturing Execution systems for automotive suppliers to reflect the business requirements gathered for: EDI, Material Resource Planning, Shop Floor Production, Purchasing and Cost Accounting.',
    ],
  },
];

const education = {
  school: 'University of Wisconsin — Madison',
  degree: 'B.S. Industrial & Systems Engineering',
  period: '2012 – 2016',
  location: 'Madison, WI',
};

const skills = [
  'NetSuite',
  'Salesforce CRM & CPQ',
  'Adaptive Insights',
  'BigQuery',
  'Stripe',
  'Avalara',
  'Looker',
  'JIRA',
  'IPaaS Development',
  'Agile Project Management',
  'SQL',
  'JavaScript',
  'REST APIs',
  'SOX Compliance',
  'IPO Readiness',
];

const certifications = [
  'NetSuite SuiteFoundation',
  'Salesforce CPQ',
  'Certified Scrum Master',
  'Six Sigma Green Belt',
];

const interests = 'Traveling, Cooking, Home Improvement Projects, Playing Hockey and Tennis, Coding side projects';

export default function ResumePage() {
  return (
    <main className="min-h-screen">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[--gb-dark]">
        <Link href="/" className="font-pixel text-[10px] text-[--gb-light] hover:text-[--gb-lightest] transition-colors">
          ← Home
        </Link>
        <div className="flex gap-6">
          <Link href="/play" className="font-pixel text-[10px] text-[--gb-lightest] hover:text-[--gb-light] transition-colors">
            Play
          </Link>
          <Link href="/projects" className="font-pixel text-[10px] text-[--gb-lightest] hover:text-[--gb-light] transition-colors">
            Projects
          </Link>
          <Link href="/side-projects" className="font-pixel text-[10px] text-[--gb-lightest] hover:text-[--gb-light] transition-colors">
            Side Projects
          </Link>
          <Link href="/contact" className="font-pixel text-[10px] text-[--gb-lightest] hover:text-[--gb-light] transition-colors">
            Contact
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <header className="mb-8 text-center">
          <h1 className="font-pixel text-xl text-[--gb-lightest] mb-2">KEVIN HANNIGAN</h1>
          <p className="text-[--gb-light] text-sm">khannigan94@gmail.com | 262.573.2242 | Chicago, IL</p>
        </header>

        {/* Summary */}
        <section className="mb-12">
          <h2 className="font-pixel text-sm text-[--gb-light] mb-4 pb-2 border-b border-[--gb-dark]">SUMMARY</h2>
          <p className="text-sm text-[--gb-light] leading-relaxed opacity-85">{summary}</p>
        </section>

        {/* Experience */}
        <section className="mb-12">
          <h2 className="font-pixel text-sm text-[--gb-light] mb-6 pb-2 border-b border-[--gb-dark]">PROFESSIONAL EXPERIENCE</h2>
          {experience.map((job, i) => (
            <div key={i} className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-1">
                <h3 className="font-pixel text-xs text-[--gb-lightest]">{job.title}</h3>
                <span className="font-pixel text-[8px] text-[--gb-dark]">{job.location}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-3">
                <p className="text-sm text-[--gb-light]">{job.company}</p>
                <span className="font-pixel text-[8px] text-[--gb-dark]">{job.period}</span>
              </div>
              <ul className="space-y-2">
                {job.bullets.map((b, j) => (
                  <li key={j} className="text-sm text-[--gb-light] leading-relaxed pl-4 relative opacity-85">
                    <span className="absolute left-0 text-[--gb-dark]">·</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Education */}
        <section className="mb-12">
          <h2 className="font-pixel text-sm text-[--gb-light] mb-6 pb-2 border-b border-[--gb-dark]">EDUCATION</h2>
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-1">
            <h3 className="font-pixel text-xs text-[--gb-lightest]">{education.degree}</h3>
            <span className="font-pixel text-[8px] text-[--gb-dark]">{education.location}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
            <p className="text-sm text-[--gb-light]">{education.school}</p>
            <span className="font-pixel text-[8px] text-[--gb-dark]">{education.period}</span>
          </div>
        </section>

        {/* Skills & Interests */}
        <section className="mb-12">
          <h2 className="font-pixel text-sm text-[--gb-light] mb-6 pb-2 border-b border-[--gb-dark]">SKILLS & INTERESTS</h2>

          <div className="mb-4">
            <h3 className="font-pixel text-[9px] text-[--gb-lightest] mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((s, i) => (
                <span key={i} className="font-pixel text-[8px] bg-[--gb-dark] text-[--gb-light] px-3 py-1.5 border border-[--gb-light] rounded-sm">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-pixel text-[9px] text-[--gb-lightest] mb-2">Certifications</h3>
            <ul className="space-y-1">
              {certifications.map((c, i) => (
                <li key={i} className="text-sm text-[--gb-light] pl-4 relative opacity-85">
                  <span className="absolute left-0 text-[--gb-dark]">·</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-pixel text-[9px] text-[--gb-lightest] mb-2">Interests</h3>
            <p className="text-sm text-[--gb-light] opacity-85">{interests}</p>
          </div>
        </section>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 border-t border-[--gb-dark]">
          <Link href="/play" className="gb-btn">▶ PLAY THE GAME</Link>
          <Link href="/contact" className="gb-btn gb-btn-secondary">CONTACT KEVIN</Link>
          <a
            href="https://www.linkedin.com/in/kthannigan/"
            target="_blank"
            rel="noopener noreferrer"
            className="gb-btn gb-btn-secondary"
          >
            LINKEDIN
          </a>
        </div>
      </div>
    </main>
  );
}
