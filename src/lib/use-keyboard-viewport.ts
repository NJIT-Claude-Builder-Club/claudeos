'use client';

import { useEffect, useRef } from 'react';

// Safari keeps the layout viewport tall when the keyboard covers the screen.
// Size only the chat shell to the visible area, without interfering with zoom.
export function useKeyboardViewport() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const viewport = window.visualViewport;
    const shell = ref.current;
    if (!viewport || !shell) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const editing = document.activeElement instanceof HTMLTextAreaElement;
        if (viewport.scale === 1 && editing) {
          shell.style.setProperty('--chat-height', `${viewport.height}px`);
          shell.style.setProperty('--chat-top', `${viewport.offsetTop}px`);
        } else {
          shell.style.removeProperty('--chat-height');
          shell.style.removeProperty('--chat-top');
        }
      });
    };
    viewport.addEventListener('resize', update);
    viewport.addEventListener('scroll', update);
    document.addEventListener('focusin', update);
    document.addEventListener('focusout', update);
    return () => {
      cancelAnimationFrame(frame);
      viewport.removeEventListener('resize', update);
      viewport.removeEventListener('scroll', update);
      document.removeEventListener('focusin', update);
      document.removeEventListener('focusout', update);
    };
  }, []);
  return ref;
}
