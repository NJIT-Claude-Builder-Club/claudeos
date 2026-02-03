'use client';

import React from 'react';
import { useChatStore } from '@/lib/chat-store';
import { MessageList } from './chat/MessageList';
import { ChatInput } from './chat/ChatInput';
import { Trash2 } from 'lucide-react';

export function ChatInterface() {
  const { messages, addMessage, updateMessage, clearMessages, isLoading, setLoading } =
    useChatStore();

  const sendMessage = async (content: string, images?: string[]) => {
    // Add user message
    addMessage({
      role: 'user',
      content,
    });

    setLoading(true);

    try {
      // Prepare messages for API
      type MessageContent =
        | string
        | Array<
            | { type: 'image'; source: { type: 'base64'; media_type: string; data: string } }
            | { type: 'text'; text: string }
          >;

      const apiMessages: Array<{ role: string; content: MessageContent }> = messages.map(
        (msg) => ({
          role: msg.role,
          content: msg.content,
        })
      );

      // Add the new user message with optional images
      if (images && images.length > 0) {
        // Format message with images for Claude API
        const messageContent: Exclude<MessageContent, string> = [];

        // Add images first
        images.forEach((imageData) => {
          // Extract base64 data and media type
          const matches = imageData.match(/^data:([^;]+);base64,(.+)$/);
          if (matches) {
            const mediaType = matches[1];
            const base64Data = matches[2];
            messageContent.push({
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64Data,
              },
            });
          }
        });

        // Add text content if present
        if (content) {
          messageContent.push({
            type: 'text',
            text: content,
          });
        }

        apiMessages.push({
          role: 'user',
          content: messageContent,
        });
      } else {
        // Text-only message
        apiMessages.push({
          role: 'user',
          content,
        });
      }

      // Call the chat API with streaming
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No reader available');
      }

      let assistantMessageId: string | null = null;
      let currentContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              // Handle different event types
              if (data.type === 'message_start') {
                assistantMessageId = addMessage({
                  role: 'assistant',
                  content: '',
                  isStreaming: true,
                });
              } else if (data.type === 'content_block_delta') {
                if (data.delta?.type === 'text_delta') {
                  currentContent += data.delta.text;
                  if (assistantMessageId) {
                    updateMessage(assistantMessageId, {
                      content: currentContent,
                      isStreaming: true,
                    });
                  }
                }
              } else if (data.type === 'message_stop') {
                if (assistantMessageId) {
                  updateMessage(assistantMessageId, {
                    isStreaming: false,
                  });
                }
              }
            } catch (e) {
              console.error('Error parsing event:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-bg flex flex-col">
      {/* Minimal Header */}
      <div className="border-b border-border/20 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted">Claude Builder Club @ NJIT</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              if (confirm('Clear all messages?')) {
                clearMessages();
              }
            }}
            className="p-2 hover:bg-surface/30 rounded-lg transition-colors text-muted hover:text-text"
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <MessageList />

      {/* Input */}
      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
}
