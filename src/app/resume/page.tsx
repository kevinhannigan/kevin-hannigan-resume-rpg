import Link from 'next/link';

const experience = [
  {
    company: 'Reddit',
    title: 'Finance Applications Manager',
    period: '2021 – Present',
    location: 'San Francisco, CA (Remote)',
    bullets: [
      'Designed and implemented finance applications with Sales & Finance, Accounts Receivable, and Functional Accounting teams to optimize Reddits Quoting, Billing, Commissions, Collections, Treasury, Forecasting, and Crypto processes to accelerate financial close and scale product offerings',
      'Developed an order management system integrating our CRM, Ads Platform, and ERP system, reducing month-end close from 12 days to 3 during rapid growth at Reddit ($200M to $2.2B+ annual revenue)',
      'Spearheaded IPaaS tooling adoption, creating 20+ integrations to streamline Sales, Finance, and HR processes eliminating manual tasks, savings thousands of hours of work annually and implementing Agentic AI capabilities',
      'Implemented a subledger accounting tool to automate GL entries and reporting for Reddit’s Direct to Consumer Businesses (iOS, Google Play Store, Stripe, and PayPal transactions related to subscriptions, awards, and NFTs) allowing product teams to rapidly go to market without increasing operational burden',
      'Led multiple RFPs to identify software solutions, establishing criteria for vendor selection for Treasury Management, Cash Application, AR Automation, and Professional Services support.',
      'Created a data pipeline framework from NetSuite to Google Big Query for Analytics, Finance and Commissions teams, ensuring data availability and accuracy.',
      'Colloabroated with controllership and GRC in designing Reddit’s change control process for SOX compliance, maintaining auditability and separation of duties.',
    ],
  },
  {
    company: 'Deloitte Digital',
    title: 'Senior Consultant → Product Owner',
    period: '2017 – 2021',
    location: 'Chicago, IL',
    bullets: [
      "Product owner at Meta for a custom IT application modeling and forecasting data center costs. Led front-end (React JS) and back-end (Python, PHP) development through agile sprints and stakeholder workshops with Finance Directors, Technical Program Managers, and Sourcing Managers",
      "Designed automated ASC 606 compliant Revenue Recognition scenarios for a U.S. RPA solution provider, collaborating with Sales, Order Management, Fulfillment, and Finance teams.",
      "Implemented a CRM and Order Management system for a $3B+ global warehousing client, customizing modules for order entry, fulfillment, inventory management and returns on NetSuite.",
      "Consulted at Cloudflare pre-IPO to scale procurement and order management systems, implemented Dell Boomi to integrate and streamline the order management process, selected and configured a subscription billing tool, and developed a cash application tool to improve DSO.",
      "'Lead to Order,' 'Order to Cash,' and Revenue Recognition lead for five full-cycle ERP and CRM implementations.",
    ],
  },
  {
    company: 'Baker Tilly',
    title: 'Technology Consultant',
    period: '2016 – 2017',
    location: 'Chicago, IL',
    bullets: [
      'Implemented ERP and Manufacturing Execution systems for automotive suppliers.',
      'Gathered business requirements across EDI, material resource planning, shop floor production, purchasing, and cost accounting.',
      'Configured end-to-end manufacturing workflows from purchase, receipt, processing, inventory accounting, to order fulfillment',
    ],
  },
];

const education = {
  school: 'University of Wisconsin — Madison',
  degree: 'B.S. Industrial & Systems Engineering',
  period: '2012 – 2016',
};

const skills = [
  "NetSuite",
  "Salesforce CRM & CPQ",
  "Adaptive Insights",
  "Stripe",
  "Avalara",
  "Looker",
  "JIRA",
  "IPaaS Development",
  "Agile Project Management",
  "SQL",
  "JavaScript",
  "REST APIs",
  "SOX Compliance",
  "IPO Readiness"
];

const certifications = ['Lean Six Sigma', 'NetSuite ERP Administrator'];

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
        <header className="mb-12 text-center">
          <h1 className="font-pixel text-xl text-[--gb-lightest] mb-2">KEVIN HANNIGAN</h1>
          <p className="text-[--gb-light] text-sm">Finance Applications Manager · Systems & Product Leader</p>
          <p className="text-[--gb-dark] text-xs mt-2">San Francisco, CA</p>
        </header>

        {/* Experience */}
        <section className="mb-12">
          <h2 className="font-pixel text-sm text-[--gb-light] mb-6 pb-2 border-b border-[--gb-dark]">EXPERIENCE</h2>
          {experience.map((job, i) => (
            <div key={i} className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-1">
                <h3 className="font-pixel text-xs text-[--gb-lightest]">{job.company}</h3>
                <span className="font-pixel text-[8px] text-[--gb-dark]">{job.period}</span>
              </div>
              <p className="text-sm text-[--gb-light] mb-1">{job.title}</p>
              <p className="text-xs text-[--gb-dark] mb-3">{job.location}</p>
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
            <h3 className="font-pixel text-xs text-[--gb-lightest]">{education.school}</h3>
            <span className="font-pixel text-[8px] text-[--gb-dark]">{education.period}</span>
          </div>
          <p className="text-sm text-[--gb-light]">{education.degree}</p>
        </section>

        {/* Skills */}
        <section className="mb-12">
          <h2 className="font-pixel text-sm text-[--gb-light] mb-6 pb-2 border-b border-[--gb-dark]">SKILLS</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((s, i) => (
              <span key={i} className="font-pixel text-[8px] bg-[--gb-dark] text-[--gb-light] px-3 py-1.5 border border-[--gb-light] rounded-sm">
                {s}
              </span>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section className="mb-12">
          <h2 className="font-pixel text-sm text-[--gb-light] mb-6 pb-2 border-b border-[--gb-dark]">CERTIFICATIONS</h2>
          <ul className="space-y-1">
            {certifications.map((c, i) => (
              <li key={i} className="text-sm text-[--gb-light] pl-4 relative opacity-85">
                <span className="absolute left-0 text-[--gb-dark]">·</span>
                {c}
              </li>
            ))}
          </ul>
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
