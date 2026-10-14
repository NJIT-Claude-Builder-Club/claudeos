'use client';

import { useSyncExternalStore } from 'react';
import { getTimeGreeting } from '@/lib/chat-presentation';

function subscribe(onChange: () => void) {
  const timer = window.setInterval(onChange, 60_000);
  document.addEventListener('visibilitychange', onChange);
  return () => {
    window.clearInterval(timer);
    document.removeEventListener('visibilitychange', onChange);
  };
}

export function TimeGreeting() {
  const greeting = useSyncExternalStore(
    subscribe,
    () => getTimeGreeting(new Date().getHours()),
    () => 'Welcome, Highlander!',
  );
  return <span>{greeting}</span>;
}
