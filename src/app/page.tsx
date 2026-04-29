import Link from 'next/link';

const CHAPTERS = [
  { name: 'UW — College of Engineering', year: '2012–2016', desc: 'Industrial & Systems Engineering. Process design, optimization, simulation.' },
  { name: 'Baker Tilly', year: '2016–2017', desc: 'ERP & manufacturing execution. EDI, MRP, shop floor, purchasing, cost accounting.' },
  { name: 'Deloitte Digital', year: '2017–2021', desc: 'Product ownership, agile delivery, CRM/ERP, revenue recognition, pre-IPO scale.' },
  { name: 'Reddit', year: '2021–Present', desc: 'Finance Applications Manager. Order management, 20+ integrations, subledger, data pipelines, SOX. Close reduced from 12 → 3 days.' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[--gb-dark]">
        <span className="font-pixel text-xs text-[--gb-light]">KH</span>
        <div className="flex gap-6">
          <Link href="/play" className="font-pixel text-[10px] text-[--gb-lightest] hover:text-[--gb-light] transition-colors">
            Play
          </Link>
          <Link href="/resume" className="font-pixel text-[10px] text-[--gb-lightest] hover:text-[--gb-light] transition-colors">
            Resume
          </Link>
          <Link href="/projects" className="font-pixel text-[10px] text-[--gb-lightest] hover:text-[--gb-light] transition-colors">
            Projects
          </Link>
          <Link href="/side-projects" className="font-pixel text-[10px] text-[--gb-lightest] hover:text-[--gb-light] transition-colors">
            Side Projects
          </Link>
          <a href="/pixel-editor.html" className="font-pixel text-[10px] text-[--gb-lightest] hover:text-[--gb-light] transition-colors">
            Sprite Editor
          </a>
          <Link href="/contact" className="font-pixel text-[10px] text-[--gb-lightest] hover:text-[--gb-light] transition-colors">
            Contact
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="animate-slide-up">
          <h1 className="font-pixel text-2xl md:text-3xl text-[--gb-lightest] mb-4">
            KEVIN HANNIGAN
          </h1>
          <p className="font-pixel text-xs md:text-sm text-[--gb-light] mb-2">
            Interactive Resume
          </p>
          <p className="text-sm md:text-base text-[--gb-light] max-w-lg mx-auto mb-10 leading-relaxed opacity-80">
            Walk through my career journey — from systems engineering at the
            University of Wisconsin to finance applications leadership at Reddit
            — in a retro Game Boy-inspired adventure.
          </p>
        </div>

        <div className="animate-slide-up delay-200 flex flex-col sm:flex-row gap-4 mb-16">
          <Link href="/play" className="gb-btn text-sm">
            ▶ PRESS START
          </Link>
          <Link href="/resume" className="gb-btn gb-btn-secondary text-sm">
            VIEW RESUME
          </Link>
        </div>

        {/* Game Boy frame preview */}
        <div className="animate-slide-up delay-300 relative w-72 h-64 md:w-96 md:h-80 border-4 border-[--gb-dark] rounded-lg bg-[--gb-dark] flex items-center justify-center mb-12">
          <div className="absolute inset-3 bg-[--gb-darkest] rounded flex items-center justify-center border-2 border-[--gb-dark]">
            <div className="text-center px-4">
              <p className="font-pixel text-[10px] text-[--gb-lightest] animate-blink mb-4">
                ▶ START ADVENTURE
              </p>
              <p className="font-pixel text-[8px] text-[--gb-dark]">
                Arrow keys to move
              </p>
              <p className="font-pixel text-[8px] text-[--gb-dark]">
                SPACE to interact
              </p>
              <p className="font-pixel text-[8px] text-[--gb-dark]">
                ESC for menu
              </p>
            </div>
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[--gb-light] border-2 border-[--gb-dark]" />
        </div>
      </section>

      {/* Career chapters preview */}
      <section className="px-6 py-16 max-w-4xl mx-auto w-full">
        <h2 className="font-pixel text-sm text-[--gb-light] mb-8 text-center">
          THE JOURNEY
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {CHAPTERS.map((ch, i) => (
            <div key={i} className="gb-card animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-pixel text-xs text-[--gb-lightest]">{ch.name}</span>
                <span className="font-pixel text-[8px] text-[--gb-dark]">{ch.year}</span>
              </div>
              <p className="text-sm text-[--gb-light] leading-relaxed opacity-80">{ch.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Project highlights */}
      <section className="px-6 py-16 max-w-4xl mx-auto w-full">
        <h2 className="font-pixel text-sm text-[--gb-light] mb-8 text-center">
          HIGHLIGHTS
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/projects" className="gb-card animate-slide-up hover:border-[--gb-lightest] transition-colors block">
            <h3 className="font-pixel text-xs text-[--gb-lightest] mb-2">Work Projects</h3>
            <p className="text-sm text-[--gb-light] leading-relaxed opacity-80">
              Deep dives into TMS implementations, crypto accounting, international revenue automation, and billing scalability.
            </p>
          </Link>
          <Link href="/side-projects" className="gb-card animate-slide-up delay-100 hover:border-[--gb-lightest] transition-colors block">
            <h3 className="font-pixel text-xs text-[--gb-lightest] mb-2">Side Projects</h3>
            <p className="text-sm text-[--gb-light] leading-relaxed opacity-80">
              iOS apps, multiplayer games, wave-forecasting tools, and this very resume RPG.
            </p>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[--gb-dark] px-6 py-8 text-center">
        <p className="font-pixel text-[8px] text-[--gb-dark] mb-2">
          Built with Next.js + Phaser 3 — Inspired by classic handheld RPGs
        </p>
        <div className="flex justify-center gap-6 flex-wrap">
          <Link href="/resume" className="font-pixel text-[8px] text-[--gb-light] hover:text-[--gb-lightest] transition-colors">
            Resume
          </Link>
          <Link href="/projects" className="font-pixel text-[8px] text-[--gb-light] hover:text-[--gb-lightest] transition-colors">
            Projects
          </Link>
          <Link href="/side-projects" className="font-pixel text-[8px] text-[--gb-light] hover:text-[--gb-lightest] transition-colors">
            Side Projects
          </Link>
          <Link href="/contact" className="font-pixel text-[8px] text-[--gb-light] hover:text-[--gb-lightest] transition-colors">
            Contact
          </Link>
          <a href="https://www.linkedin.com/in/kthannigan/" target="_blank" rel="noopener noreferrer" className="font-pixel text-[8px] text-[--gb-light] hover:text-[--gb-lightest] transition-colors">
            LinkedIn
          </a>
        </div>
      </footer>
    </main>
  );
}
