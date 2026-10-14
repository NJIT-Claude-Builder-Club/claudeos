'use client';

import React, { useEffect, useRef, useState, memo } from 'react';
import { Message as MessageType } from '@/lib/chat-store';
import { Check, Copy, LoaderCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const Message = memo(function Message({ message }: { message: MessageType }) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (copyTimer.current) clearTimeout(copyTimer.current); }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setCopyFailed(false);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyFailed(true);
    }
  };

  if (message.role === 'user') {
    return (
      <article className="message-row user-message" aria-label="You">
        <div className="user-message-bubble"><div className="message-markdown"><ReactMarkdown>{message.content}</ReactMarkdown></div></div>
      </article>
    );
  }

  return (
    <article className={`message-row assistant-message${message.isError ? ' has-error' : ''}`} aria-label="Claude">
      {message.content && (
        <div className="assistant-text" data-streaming={message.isStreaming && !message.isThinking}>
          <div className="message-markdown"><ReactMarkdown>{message.content}</ReactMarkdown></div>
        </div>
      )}
      {message.isStreaming && message.isThinking && (
        <div role="status" aria-label="Claude is thinking" className="thinking-status">
          <span className="animate-spin motion-reduce:animate-none"><LoaderCircle size={17} aria-hidden="true" /></span>
          <span>Thinking…</span>
        </div>
      )}
      {!message.isStreaming && message.content && (
        <div className="message-actions">
          <button type="button" onClick={handleCopy} className="message-copy" title={copied ? 'Copied!' : 'Copy response'} aria-label={copied ? 'Copied!' : 'Copy response'}>
            {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
          </button>
          <span role="status" className="copy-status">{copied ? 'Copied' : copyFailed ? 'Could not copy. Please select the text.' : ''}</span>
        </div>
      )}
    </article>
  );
});
