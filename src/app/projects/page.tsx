'use client';

import Link from 'next/link';
import { useState } from 'react';
import { workProjects, type Project } from '@/data/projects';

function ProjectCard({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="gb-card animate-slide-up">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left cursor-pointer"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-pixel text-xs text-[--gb-lightest] mb-2">
              {project.title}
            </h3>
            <p className="text-sm text-[--gb-light] leading-relaxed opacity-80">
              {project.tagline}
            </p>
          </div>
          <span className="font-pixel text-xs text-[--gb-light] shrink-0 mt-1">
            {open ? '▼' : '▶'}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="font-pixel text-[7px] bg-[--gb-darkest] text-[--gb-light] px-2 py-1 border border-[--gb-dark] rounded-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </button>

      {open && (
        <div className="mt-5 pt-5 border-t border-[--gb-dark] space-y-4">
          {project.sections.map((section) => (
            <div key={section.heading}>
              <h4 className="font-pixel text-[9px] text-[--gb-lightest] mb-1.5">
                {section.heading}
              </h4>
              <p className="text-sm text-[--gb-light] leading-relaxed opacity-85">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <main className="min-h-screen">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[--gb-dark]">
        <Link
          href="/"
          className="font-pixel text-[10px] text-[--gb-light] hover:text-[--gb-lightest] transition-colors"
        >
          ← Home
        </Link>
        <div className="flex gap-6">
          <Link href="/play" className="font-pixel text-[10px] text-[--gb-lightest] hover:text-[--gb-light] transition-colors">
            Play
          </Link>
          <Link href="/resume" className="font-pixel text-[10px] text-[--gb-lightest] hover:text-[--gb-light] transition-colors">
            Resume
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
          <h1 className="font-pixel text-xl text-[--gb-lightest] mb-3">
            WORK PROJECTS
          </h1>
          <p className="text-sm text-[--gb-light] leading-relaxed opacity-80 max-w-xl mx-auto">
            Deep dives into select initiatives — architecture decisions,
            integration challenges, and outcomes. Click any card to expand.
          </p>
        </header>

        <div className="space-y-4">
          {workProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-12 mt-12 border-t border-[--gb-dark]">
          <Link href="/side-projects" className="gb-btn gb-btn-secondary">
            SIDE PROJECTS →
          </Link>
          <Link href="/play" className="gb-btn">▶ PLAY THE GAME</Link>
        </div>
      </div>
    </main>
  );
}
