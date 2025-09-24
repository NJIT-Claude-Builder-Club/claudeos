'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useWindowStore, type WindowId, isWindowMinimized } from '@/lib/window-store';
import { cn } from '@/lib/utils';

const WINDOW_TITLES: Record<WindowId, string> = {
  about: 'About',
  eboard: 'E-Board',
  feed: 'Feed',
  workshops: 'Workshops',
  contact: 'Contact',
};

export function Taskbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { order, minimized, restore, focus } = useWindowStore();

  // Initialize theme from localStorage or default to dark
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const isDark = saved === 'light' ? false : true; // Default to dark
    
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      // Dark mode
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      // Light mode
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleWindowClick = (id: WindowId) => {
    if (isWindowMinimized(id, minimized)) {
      restore(id);
    } else {
      focus(id);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-surface/90 backdrop-blur-md border-t border-border flex items-center px-4 z-50">
      {/* Start Button / Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1 hover:bg-border/50 rounded transition-colors cursor-pointer">
          <img 
            src="/claude-ai.png" 
            alt="Claude AI" 
            className="w-6 h-6 rounded-sm"
          />
          <span className="font-ui text-[var(--step-0)] tracking-tightish text-text">ClaudeOS</span>
        </div>
      </div>

      {/* Window Buttons */}
      <div className="flex-1 flex items-center gap-2 ml-4">
        {order.map((windowId) => (
          <button
            key={windowId}
            onClick={() => handleWindowClick(windowId)}
            className={cn(
              'px-3 py-1 rounded text-sm transition-colors',
              'hover:bg-border/50',
              isWindowMinimized(windowId, minimized)
                ? 'bg-border/30 text-muted'
                : 'bg-primary/20 text-text border border-primary/30'
            )}
          >
            {WINDOW_TITLES[windowId]}
          </button>
        ))}
      </div>

      {/* System Tray */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-border/50 rounded transition-colors"
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? (
            <Sun size={16} className="text-text" />
          ) : (
            <Moon size={16} className="text-text" />
          )}
        </button>
        
        <div className="text-xs text-muted ml-2">
          {new Date().toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
}