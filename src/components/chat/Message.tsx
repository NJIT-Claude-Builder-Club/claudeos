'use client';

import React, { useState } from 'react';
import { Message as MessageType } from '@/lib/chat-store';
import { Copy, ThumbsUp, ThumbsDown, RotateCcw, User, Wrench } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface MessageProps {
  message: MessageType;
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <div className="py-8 px-4">
        <div className="max-w-3xl mx-auto flex gap-4 items-start">
          {/* User Avatar */}
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted/20 flex items-center justify-center text-text">
            <User className="w-5 h-5" />
          </div>

          {/* User Message Bubble */}
          <div className="bg-user-bg rounded-2xl px-4 py-3 max-w-[80%]">
            <div className="text-text break-words leading-relaxed prose prose-invert max-w-none">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex gap-4 items-start">
          {/* Spacer to align with user message */}
          <div className="flex-shrink-0 w-8"></div>

          {/* Assistant Message */}
          <div className="flex-1 min-w-0">
            {/* Tool Usage Display */}
            {message.toolsUsed && message.toolsUsed.length > 0 && (
              <div className="mb-3 space-y-2">
                {message.toolsUsed.map((tool, idx) => (
                  <div
                    key={idx}
                    className="bg-surface/30 border border-border/20 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-2 text-sm text-primary mb-2">
                      <Wrench className="w-4 h-4" />
                      <span className="font-medium">Using tool: {tool.name}</span>
                    </div>
                    <div className="text-xs text-muted space-y-1">
                      <div>
                        <span className="text-muted/70">Input:</span>
                        <pre className="mt-1 bg-bg/50 rounded p-2 overflow-x-auto">
                          {JSON.stringify(tool.input, null, 2)}
                        </pre>
                      </div>
                      {tool.result !== undefined && (
                        <div className="mt-2">
                          <span className="text-muted/70">Result:</span>
                          <pre className="mt-1 bg-bg/50 rounded p-2 overflow-x-auto">
                            {JSON.stringify(tool.result, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="text-text leading-relaxed prose prose-invert max-w-none">
              <ReactMarkdown>{message.content}</ReactMarkdown>
              {message.isStreaming && message.content && (
                <span className="inline-block w-1.5 h-5 ml-1 bg-primary animate-pulse align-middle" />
              )}
            </div>

            {/* Action Buttons */}
            {!message.isStreaming && (
              <div className="flex items-center gap-1 mt-4">
                <button
                  onClick={handleCopy}
                  className="p-2 hover:bg-surface/50 rounded-md transition-colors group"
                  title={copied ? 'Copied!' : 'Copy'}
                >
                  {copied ? (
                    <span className="text-xs text-primary">Copied!</span>
                  ) : (
                    <Copy className="w-4 h-4 text-muted group-hover:text-text" />
                  )}
                </button>
                <button
                  className="p-2 hover:bg-surface/50 rounded-md transition-colors group"
                  title="Good response"
                >
                  <ThumbsUp className="w-4 h-4 text-muted group-hover:text-text" />
                </button>
                <button
                  className="p-2 hover:bg-surface/50 rounded-md transition-colors group"
                  title="Bad response"
                >
                  <ThumbsDown className="w-4 h-4 text-muted group-hover:text-text" />
                </button>
                <button
                  className="p-2 hover:bg-surface/50 rounded-md transition-colors group ml-2"
                  title="Retry"
                >
                  <span className="text-sm text-muted group-hover:text-text flex items-center gap-1">
                    Retry <RotateCcw className="w-3 h-3" />
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        {!message.isStreaming && (
          <div className="mt-4 text-xs text-muted/70 text-center">
            Claude can make mistakes. Please double-check responses.
          </div>
        )}
      </div>
    </div>
  );
}
