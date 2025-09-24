'use client';

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { type WindowId } from '@/lib/window-store';
import { cn } from '@/lib/utils';

// Import page components
import { AboutPage } from './pages/AboutPage';
import { EBoardPage } from './pages/EBoardPage';
import { FeedPage } from './pages/FeedPage';
import { WorkshopsPage } from './pages/WorkshopsPage';
import { ContactPage } from './pages/ContactPage';

const MOBILE_PAGES = [
  { id: 'about' as WindowId, label: 'About', icon: '📖' },
  { id: 'eboard' as WindowId, label: 'E-Board', icon: '👥' },
  { id: 'feed' as WindowId, label: 'Feed', icon: '📱' },
  { id: 'workshops' as WindowId, label: 'Workshops', icon: '🛠️' },
  { id: 'contact' as WindowId, label: 'Contact', icon: '📧' },
];

const PAGE_COMPONENTS: Record<WindowId, React.ComponentType> = {
  about: AboutPage,
  eboard: EBoardPage,
  feed: FeedPage,
  workshops: WorkshopsPage,
  contact: ContactPage,
};

const PAGE_TITLES: Record<WindowId, string> = {
  about: 'About Claude Builder Club',
  eboard: 'Executive Board',
  feed: 'Club Feed',
  workshops: 'Workshops & Events',
  contact: 'Contact Us',
};

export function MobileDesktop() {
  const [currentPage, setCurrentPage] = useState<WindowId | null>(null);

  if (currentPage) {
    const PageComponent = PAGE_COMPONENTS[currentPage];
    return (
      <div className="h-screen bg-bg text-text flex flex-col">
        {/* Mobile Header */}
        <div className="bg-surface/90 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => setCurrentPage(null)}
            className="p-1 hover:bg-border/50 rounded transition-colors"
          >
            <ArrowLeft size={20} className="text-text" />
          </button>
          <h1 className="font-heading font-semibold text-text">
            {PAGE_TITLES[currentPage]}
          </h1>
        </div>

        {/* Page Content */}
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden p-4"
          style={{
            maxHeight: 'calc(100vh - 60px)',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <PageComponent />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-bg text-text flex flex-col">
      {/* Mobile Header */}
      <div className="bg-surface/90 backdrop-blur-md border-b border-border px-6 py-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <img
            src="/claude-ai.png"
            alt="Claude AI"
            className="w-8 h-8 rounded-lg"
          />
          <div>
            <h1 className="font-heading text-[var(--step-1)] tracking-tightish text-text font-medium">
              ClaudeOS
            </h1>
            <p className="font-ui text-[var(--step--2)] tracking-tightish text-muted font-normal">Claude Builder Club @ NJIT</p>
          </div>
        </div>
      </div>

      {/* Mobile Menu Grid */}
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden p-6"
        style={{
          maxHeight: 'calc(100vh - 80px)',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div className="mb-6">
          <h2 className="font-heading text-[var(--step-2)] tracking-tightish text-text mb-3 font-medium">
            Welcome to Claude Builder Club @ NJIT
          </h2>
          <p className="font-body text-[var(--step-0)] text-muted leading-relaxed font-normal">
            "Anyone can build with AI."
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {MOBILE_PAGES.map((page) => (
            <button
              key={page.id}
              onClick={() => setCurrentPage(page.id)}
              className={cn(
                'bg-surface border border-border rounded-xl p-6',
                'flex flex-col items-center text-center gap-3',
                'hover:border-primary/30 hover:bg-surface/80 transition-all duration-200',
                'active:scale-95'
              )}
            >
              <span className="text-3xl">{page.icon}</span>
              <span className="font-ui tracking-tightish font-medium text-text text-[var(--step--1)]">
                {page.label}
              </span>
            </button>
          ))}
        </div>

        {/* Mobile Footer */}
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="font-body text-[var(--step--2)] text-muted leading-relaxed">
            Tap any icon above to explore our community
          </p>
        </div>
      </div>
    </div>
  );
}