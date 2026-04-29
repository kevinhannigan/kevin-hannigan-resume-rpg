'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

const GameCanvas = dynamic(() => import('@/components/GameCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full bg-[#081820]">
      <p className="font-pixel text-xs text-[#88c070] animate-blink">
        Loading...
      </p>
    </div>
  ),
});

export default function PlayPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[--gb-darkest]">
      <nav className="flex items-center justify-between px-4 py-2 border-b border-[--gb-dark] shrink-0">
        <Link href="/" className="font-pixel text-[10px] text-[--gb-light] hover:text-[--gb-lightest] transition-colors">
          ← Home
        </Link>
        <span className="font-pixel text-[8px] text-[--gb-dark]">
          Arrow keys / WASD to move · SPACE to interact · ESC for menu
        </span>
        <Link href="/resume" className="font-pixel text-[10px] text-[--gb-light] hover:text-[--gb-lightest] transition-colors">
          Resume
        </Link>
      </nav>
      <div className="flex-1 relative">
        <GameCanvas />
      </div>
    </div>
  );
}
