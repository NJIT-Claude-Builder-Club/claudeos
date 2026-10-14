'use client';

import React, { useEffect, useRef } from 'react';
import { useChatStore } from '@/lib/chat-store';
import { Message } from './Message';

export function MessageList() {
  const messages = useChatStore((state) => state.messages);
  const scrollRef = useRef<HTMLDivElement>(null);
  const followResponse = useRef(true);
  const previousCount = useRef(0);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const newUserMessage = messages.slice(previousCount.current).some((message) => message.role === 'user');
    if (newUserMessage) followResponse.current = true;
    if (followResponse.current) container.scrollTop = container.scrollHeight;
    previousCount.current = messages.length;
  }, [messages]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => {
      if (followResponse.current) container.scrollTop = container.scrollHeight;
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={scrollRef} className="message-scroll" role="log" aria-label="Conversation" aria-live="off" onScroll={() => {
      const container = scrollRef.current;
      if (container) followResponse.current = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    }}>
      <div className="message-thread">
        {messages.map((message) => <Message key={message.id} message={message} />)}
      </div>
    </div>
  );
}
