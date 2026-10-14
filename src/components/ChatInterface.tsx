'use client';

import React from 'react';
import { useChatStore } from '@/lib/chat-store';
import { MessageList } from './chat/MessageList';
import { ChatInput } from './chat/ChatInput';
import { readChatEvents } from '@/lib/chat-stream';
import { Trash2 } from 'lucide-react';

export function ChatInterface() {
  const { messages, addMessage, updateMessage, clearMessages, isLoading, setLoading } =
    useChatStore();

  const sendMessage = async (content: string, images?: string[]) => {
    if (isLoading) return;
    let assistantMessageId: string | null = null;
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

      const apiMessages: Array<{ role: string; content: MessageContent }> = messages.filter((msg) => !msg.isError).map(
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
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || 'Chat is temporarily unavailable. Please try again.');
      }

      if (!response.body) throw new Error('Chat returned an empty response. Please try again.');
      let currentContent = '';
      const toolsUsed: Array<{ id: string; name: string; input: unknown; result?: unknown }> = [];
      let completed = false;
      for await (const data of readChatEvents(response.body)) {
        if (data.type === 'error') throw new Error(data.error);
        if (data.type === 'message_start' && !assistantMessageId) {
          assistantMessageId = addMessage({ role: 'assistant', content: '', isStreaming: true, toolsUsed: [] });
        } else if (data.type === 'content_block_delta' && data.delta.type === 'text_delta') {
          currentContent += data.delta.text;
          if (assistantMessageId) updateMessage(assistantMessageId, { content: currentContent });
        } else if (data.type === 'tool_use') {
          toolsUsed.push(data.tool_use);
          if (assistantMessageId) updateMessage(assistantMessageId, { toolsUsed: [...toolsUsed] });
        } else if (data.type === 'tool_result') {
          const tool = toolsUsed.find((item) => item.id === data.tool_use_id);
          if (tool) tool.result = data.result;
          if (assistantMessageId) updateMessage(assistantMessageId, { toolsUsed: [...toolsUsed] });
        } else if (data.type === 'message_stop') {
          completed = true;
        }
      }
      if (!completed || !currentContent.trim()) {
        throw new Error('Chat returned an incomplete response. Please try again.');
      }
      if (assistantMessageId) updateMessage(assistantMessageId, { isStreaming: false });
    } catch (error) {
      console.error('Error sending message:', error);
      const content = error instanceof Error ? error.message : 'Chat could not complete your response. Please try again.';
      if (assistantMessageId) {
        updateMessage(assistantMessageId, { content, isStreaming: false, isError: true });
      } else {
        addMessage({ role: 'assistant', content, isError: true });
      }
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
