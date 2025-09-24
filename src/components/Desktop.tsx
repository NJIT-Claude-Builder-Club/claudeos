'use client';

import React, { useEffect, useState } from 'react';
import { FolderIcon } from './FolderIcon';
import { Taskbar } from './Taskbar';
import { Window } from './Window';
import { MobileDesktop } from './MobileDesktop';
import { useWindowStore, type WindowId, isWindowMinimized } from '@/lib/window-store';

// Import page components (we'll create these next)
import { AboutPage } from './pages/AboutPage';
import { EBoardPage } from './pages/EBoardPage';
import { FeedPage } from './pages/FeedPage';
import { WorkshopsPage } from './pages/WorkshopsPage';
import { ContactPage } from './pages/ContactPage';

const DESKTOP_ICONS = [
  { id: 'about' as WindowId, label: 'About', position: { x: 60, y: 50 } },
  { id: 'eboard' as WindowId, label: 'E-Board', position: { x: 180, y: 50 } },
  { id: 'feed' as WindowId, label: 'Feed', position: { x: 300, y: 50 } },
  { id: 'workshops' as WindowId, label: 'Workshops', position: { x: 420, y: 50 } },
  { id: 'contact' as WindowId, label: 'Contact', position: { x: 540, y: 50 } },
];

const PAGE_COMPONENTS: Record<WindowId, React.ComponentType> = {
  about: AboutPage,
  eboard: EBoardPage,
  feed: FeedPage,
  workshops: WorkshopsPage,
  contact: ContactPage,
};

const WINDOW_TITLES: Record<WindowId, string> = {
  about: 'About Claude Builder Club',
  eboard: 'Executive Board',
  feed: 'Club Feed',
  workshops: 'Workshops & Events',
  contact: 'Contact Us',
};

export function Desktop() {
  const [isMobile, setIsMobile] = useState(false);
  const { order, minimized, move } = useWindowStore();

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleIconMove = (id: WindowId, position: { x: number; y: number }) => {
    // Only update window store for window positioning, keep icons in fixed positions
    move(id, position);
  };

  // Use mobile interface on small screens
  if (isMobile) {
    return <MobileDesktop />;
  }

  return (
    <div 
      className="fixed inset-0 bg-bg overflow-hidden select-none"
      role="application"
      aria-label="ClaudeOS Desktop"
    >
      {/* Wallpaper with subtle pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, var(--primary) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, var(--primary) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          backgroundPosition: '0 0, 25px 25px'
        }}
      />
      
      {/* Desktop Icons */}
      <div className="relative z-10">
        {DESKTOP_ICONS.map((icon) => (
          <FolderIcon
            key={icon.id}
            id={icon.id}
            label={icon.label}
            position={icon.position}
            onMove={handleIconMove}
          />
        ))}
      </div>

      {/* Windows */}
      {order.map((windowId) => {
        if (isWindowMinimized(windowId, minimized)) return null;
        
        const PageComponent = PAGE_COMPONENTS[windowId];
        return (
          <Window
            key={windowId}
            id={windowId}
            title={WINDOW_TITLES[windowId]}
          >
            <PageComponent />
          </Window>
        );
      })}

      {/* Taskbar */}
      <Taskbar />
    </div>
  );
}