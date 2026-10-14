'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const labels = ['Thinking', 'Considering', 'Mulling', 'Working through it'];

export function ThinkingIndicator() {
  const [label, setLabel] = useState(0);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer: ReturnType<typeof setInterval> | undefined;
    const update = () => {
      clearInterval(timer);
      if (preference.matches) setLabel(0);
      else timer = setInterval(() => setLabel(value => (value + 1) % labels.length), 3500);
    };
    update();
    preference.addEventListener('change', update);
    return () => {
      clearInterval(timer);
      preference.removeEventListener('change', update);
    };
  }, []);

  return (
    <div role="status" className="thinking-status">
      <span className="sr-only">Claude is thinking</span>
      <span className="thinking-mark" aria-hidden="true">
        <Image className="thinking-animated" src="/claude-thinking.gif" width={28} height={28} alt="" unoptimized />
        <Image className="thinking-still" src="/claude-ai.png" width={28} height={28} alt="" />
      </span>
      <span aria-hidden="true" className="thinking-label">{labels[label]}</span>
    </div>
  );
}
