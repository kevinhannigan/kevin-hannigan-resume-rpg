import Link from 'next/link';

export default function ContactPage() {
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
          <Link href="/resume" className="font-pixel text-[10px] text-[--gb-lightest] hover:text-[--gb-light] transition-colors">
            Resume
          </Link>
          <Link href="/projects" className="font-pixel text-[10px] text-[--gb-lightest] hover:text-[--gb-light] transition-colors">
            Projects
          </Link>
          <Link href="/side-projects" className="font-pixel text-[10px] text-[--gb-lightest] hover:text-[--gb-light] transition-colors">
            Side Projects
          </Link>
        </div>
      </nav>

      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <h1 className="font-pixel text-xl text-[--gb-lightest] mb-4">CONTACT</h1>
        <p className="text-sm text-[--gb-light] mb-12 leading-relaxed opacity-80">
          Interested in connecting? I&apos;d love to hear from you. Whether
          it&apos;s about systems engineering, finance applications, product
          leadership, or just to say hello.
        </p>

        <div className="space-y-6 mb-12">
          <a
            href="mailto:kevin@example.com"
            className="gb-card flex items-center gap-4 hover:border-[--gb-lightest] transition-colors"
          >
            <span className="font-pixel text-lg">✉</span>
            <div className="text-left">
              <p className="font-pixel text-xs text-[--gb-lightest]">Email</p>
              <p className="text-sm text-[--gb-light] opacity-80">kevin@example.com</p>
            </div>
          </a>

          <a
            href="https://www.linkedin.com/in/kevin-hannigan/"
            target="_blank"
            rel="noopener noreferrer"
            className="gb-card flex items-center gap-4 hover:border-[--gb-lightest] transition-colors"
          >
            <span className="font-pixel text-lg">in</span>
            <div className="text-left">
              <p className="font-pixel text-xs text-[--gb-lightest]">LinkedIn</p>
              <p className="text-sm text-[--gb-light] opacity-80">linkedin.com/in/kthannigan</p>
            </div>
          </a>
        </div>

        <div className="gb-card mb-8">
          <p className="font-pixel text-xs text-[--gb-lightest] mb-4">Quick Note</p>
          <p className="text-sm text-[--gb-light] leading-relaxed opacity-80">
            I&apos;m always open to conversations about building scalable
            finance systems, product strategy, or interesting engineering
            challenges. Don&apos;t hesitate to reach out.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/play" className="gb-btn">▶ PLAY THE GAME</Link>
          <Link href="/resume" className="gb-btn gb-btn-secondary">VIEW RESUME</Link>
        </div>
      </div>
    </main>
  );
}
