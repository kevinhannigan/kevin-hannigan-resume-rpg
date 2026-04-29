export interface ProjectSection {
  heading: string;
  content: string;
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  tags: string[];
  sections: ProjectSection[];
}

// ─── Work Projects ──────────────────────────────────────────────────────────
// Add, edit, or remove entries below. Each project renders as an expandable
// card on the /projects page. Sections are displayed in order.

export const workProjects: Project[] = [
  {
    slug: 'tms-implementation',
    title: 'TMS Implementation',
    tagline:
      'Designed and delivered a Treasury Management Solution integrating ERP, procurement, and forecasting tools.',
    tags: ['Treasury', 'ERP Integration', 'NetSuite', 'IPaaS', 'Procurement'],
    sections: [
      {
        heading: 'Challenge',
        content:
          'Reddit\'s treasury operations relied on fragmented spreadsheets and manual bank reconciliations across multiple entities. Cash positioning, forecasting, and bank connectivity lacked a single source of truth, creating delays and risk during rapid revenue growth.',
      },
      {
        heading: 'Architecture & Integrations',
        content:
          'Led the RFP, selection, and implementation of a Treasury Management System. Designed integrations between the TMS, NetSuite ERP, the procurement tool, and the forecasting platform so that bank balances, AP/AR flows, and cash forecasts reconciled automatically. Middleware (IPaaS) orchestrated nightly syncs and real-time payment status updates.',
      },
      {
        heading: 'Outcomes',
        content:
          'Achieved a consolidated cash position across all bank accounts and entities. Reduced manual bank reconciliation effort significantly, improved forecast accuracy, and provided leadership real-time visibility into liquidity — critical during Reddit\'s pre- and post-IPO scaling.',
      },
    ],
  },
  {
    slug: 'crypto-accounting',
    title: 'Crypto Accounting',
    tagline:
      'Stood up accounting infrastructure for Reddit\'s crypto-based creator payouts including KYC, cost-basis tracking, and GL automation.',
    tags: ['Crypto', 'Blockchain', 'KYC', 'Subledger', 'SQL', 'Compliance'],
    sections: [
      {
        heading: 'Context',
        content:
          'Reddit entered the cryptocurrency market to enable creators on the platform to receive crypto-based payouts. This introduced complex accounting requirements around KYC compliance, revenue recognition, and expense classification tied to blockchain transactions.',
      },
      {
        heading: 'Blockchain-to-GL Mapping',
        content:
          'Mapped on-chain wallet movements to revenue and expense accounts across different cost centers. Each blockchain transaction type (minting, transfer, payout, gas fee) was classified and routed to the correct GL account. Evaluated and selected a blockchain analytics platform capable of tracking cost-basis, impairment values, and fair-market-value reporting.',
      },
      {
        heading: 'Custom Reporting & Automation',
        content:
          'Built custom SQL reports against the blockchain platform\'s data warehouse to calculate cost-basis and impairment values per ASC 350-60. Automated the feed of these reports into the General Ledger, eliminating manual journal entries and ensuring auditability for SOX compliance.',
      },
      {
        heading: 'Outcomes',
        content:
          'Enabled Reddit to launch crypto creator payouts with a fully compliant accounting backbone. Reduced close-cycle effort for crypto transactions and established a scalable framework for additional token-based product launches.',
      },
    ],
  },
  {
    slug: 'international-stripe-automation',
    title: 'International Stripe Automation',
    tagline:
      'Automated international revenue recognition, taxation, and intercompany accounting for Stripe-based transactions across multiple entities.',
    tags: ['Stripe', 'ASC 606', 'BigQuery', 'IPaaS', 'Revenue Recognition', 'International'],
    sections: [
      {
        heading: 'Challenge',
        content:
          'Reddit\'s international expansion introduced Stripe as a payment processor across multiple entities and currencies. Revenue recognition under ASC 606 required distinguishing what was delivered versus what was charged in a given period, while taxation and intercompany elimination rules varied by jurisdiction.',
      },
      {
        heading: 'Architecture',
        content:
          'Leveraged BigQuery as the central data warehouse and IPaaS as the integration backbone. Source Stripe transactions were enriched with delivery data, currency conversion, and entity mapping. An accounting rules engine applied ASC 606 recognition schedules, tax logic, and intercompany allocation before generating journal entries.',
      },
      {
        heading: 'Automated Booking',
        content:
          'The rules engine automatically classified and booked transactions across Revenue, Accounts Receivable, Fees, Disputes, Refunds, and Intercompany accounts — internationally and in real time. Manual intervention was only required for exception handling.',
      },
      {
        heading: 'Outcomes',
        content:
          'Reduced manual revenue accounting effort dramatically, ensured ASC 606 compliance across all international entities, and provided a repeatable framework that scaled as Reddit launched in additional markets.',
      },
    ],
  },
  {
    slug: 'billing-scalability',
    title: 'Billing Scalability Initiative',
    tagline:
      'Designed an end-to-end billing system unifying CRM, ads platform, and ERP — cutting month-end close while enabling flexible pricing and discounting.',
    tags: ['Billing', 'CRM', 'NetSuite', 'SuiteScript', 'IPaaS', 'Automation'],
    sections: [
      {
        heading: 'Problem',
        content:
          'Customer data in the CRM, billing data from the ads platform, and customer creation / invoicing in NetSuite were all managed manually across disconnected systems. This created bottlenecks at month-end close and made it nearly impossible to scale as new pricing, discounting, and credit structures were introduced.',
      },
      {
        heading: 'Customer Master & Onboarding',
        content:
          'Defined and integrated a unified Customer Master across CRM, ads platform, and ERP. Automated advertiser onboarding so that campaign setup and payment method integration flowed directly from Sales into the billing pipeline without manual data entry.',
      },
      {
        heading: 'Fulfillment & Invoicing',
        content:
          'Fulfillment records were automatically calculated from campaign delivery data and integrated back into the CRM for Sales visibility. Upon Sales approval, invoices were automatically synced to NetSuite via IPaaS and SuiteScript — no manual invoice creation required.',
      },
      {
        heading: 'Outcomes',
        content:
          'Month-end close time was reduced drastically. The architecture was designed to be flexible and scalable — additional pricing models, discount structures, and credit options could be onboarded without rearchitecting the pipeline.',
      },
    ],
  },
];

// ─── Personal / Side Projects ───────────────────────────────────────────────
// Same structure — add, reorder, or remove entries freely.

export const personalProjects: Project[] = [
  {
    slug: 'pool',
    title: 'Pool',
    tagline:
      'iOS app for friends to catalog baby gear, discover what others love, and share or loan items through a community pool.',
    tags: ['Swift', 'iOS', 'Firebase', 'SwiftUI', 'Social'],
    sections: [
      {
        heading: 'Concept',
        content:
          'New parents are overwhelmed by baby product choices. Pool lets friends catalog and rate the items they own — strollers, cribs, toys, clothes — so others can see honest recommendations from people they trust before buying.',
      },
      {
        heading: 'Community Pool',
        content:
          'Beyond cataloging, users can mark items they\'re willing to loan or part with. The "Community Pool" feed surfaces available strollers, appliances, clothes, and toys from your circle, reducing waste and saving money.',
      },
      {
        heading: 'Tech Stack',
        content:
          'Built natively in Swift with SwiftUI for the interface, Firebase for real-time data sync and authentication, and Cloud Functions for notification delivery when friends list new items.',
      },
    ],
  },
  {
    slug: 'scattergories-multiplayer',
    title: 'Scattergories Multiplayer',
    tagline:
      'Real-time multiplayer Scattergories built with React and WebSockets — lobbies, scoring, and a spicy mode that roasts your friends.',
    tags: ['React', 'WebSockets', 'Node.js', 'Multiplayer', 'Game'],
    sections: [
      {
        heading: 'How It Works',
        content:
          'Players create a game lobby and share a code with friends. The app generates random Scattergories categories and a letter. When the timer runs out, the party leader reviews answers and awards points based on cleverness and uniqueness.',
      },
      {
        heading: 'Spicy Mode',
        content:
          'Toggle on "Spicy Mode" and the category generator uses the names of players in the lobby to create personalized (and hilarious) categories — turning the game into a roast session.',
      },
      {
        heading: 'Tech Stack',
        content:
          'React frontend with global context for game state management. A Node.js backend uses WebSockets for real-time communication between players — lobby creation, timer sync, answer submission, and scoring all happen live.',
      },
    ],
  },
  {
    slug: 'fetch-waves',
    title: 'Fetch Waves',
    tagline:
      'Full-stack app for forecasting Lake Michigan surf conditions — NOAA data, cron scraping, and a social layer for solo-surfer safety.',
    tags: ['Python', 'React', 'MongoDB', 'NOAA', 'Cron', 'Full Stack'],
    sections: [
      {
        heading: 'Data Pipeline',
        content:
          'Cron jobs scrape wave height, period, and wind data from NOAA buoys stationed across Lake Michigan using Python. The scraped data is normalized and written to MongoDB on a regular schedule.',
      },
      {
        heading: 'Frontend',
        content:
          'A React web app reads from MongoDB and presents wave forecasts, historical trends, and current conditions in an easy-to-scan interface so surfers can quickly decide if conditions are worth the drive.',
      },
      {
        heading: 'Social Safety Layer',
        content:
          'Surfing alone on Lake Michigan can be dangerous. Users can sign up and signal the time and date they plan to surf at a given beach. Other surfers see who else will be in the water — reducing the fear of paddling out solo.',
      },
    ],
  },
  {
    slug: 'resume-rpg',
    title: 'Resume RPG',
    tagline:
      'This very site — an immersive Game Boy-style RPG that walks through my education and career as a playable adventure.',
    tags: ['Next.js', 'Phaser 3', 'TypeScript', 'Pixel Art', 'Game Dev'],
    sections: [
      {
        heading: 'Concept',
        content:
          'Traditional resumes are static. Resume RPG turns my career journey into a playable Game Boy adventure — from the UW-Madison campus interview experience, to moving to Chicago for consulting, to navigating ERP implementations and product management at Reddit.',
      },
      {
        heading: 'Gameplay',
        content:
          'Players navigate grid-based maps, battle trainers representing interview rounds and client engagements, collect items, and evolve their companion Pokémon (Bucky the Badger) through each career chapter. Dialogue and encounters are driven by real experience and skills.',
      },
      {
        heading: 'Tech Stack',
        content:
          'Built with Next.js for the web shell, Phaser 3 for the game engine, and TypeScript throughout. All pixel art is generated programmatically via digit arrays. Game content — maps, dialogues, encounters — is defined in data files for easy editing. A side application (HTML + Alpine JS) was developed to rapidly develop game assets via Pixel Art generator',
      },
    ],
  },
];
