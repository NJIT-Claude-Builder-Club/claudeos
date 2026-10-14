export type ChatEvent =
  | { type: 'message_start' }
  | { type: 'content_block_delta'; delta: { type: 'text_delta'; text: string } }
  | { type: 'tool_use'; tool_use: { id: string; name: string; input: Record<string, unknown> } }
  | { type: 'tool_result'; tool_use_id: string; result: unknown }
  | { type: 'message_stop' }
  | { type: 'error'; error: string };

// Network chunks may split JSON, event delimiters, or a UTF-8 character.
export async function* readChatEvents(body: ReadableStream<Uint8Array>): AsyncGenerator<ChatEvent> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let data: string[] = [];
  let ended = false;
  try {
    while (true) {
      const { done, value } = await reader.read();
      ended = done;
      buffer += done ? decoder.decode() : decoder.decode(value, { stream: true });
      let newline: number;
      while ((newline = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, newline).replace(/\r$/, '');
        buffer = buffer.slice(newline + 1);
        if (line === '' && data.length) {
          const event = JSON.parse(data.join('\n')) as ChatEvent;
          data = [];
          yield event;
        } else if (line.startsWith('data:')) {
          data.push(line.slice(5).replace(/^ /, ''));
        }
      }
      if (done) {
        if (buffer.trim() || data.length) throw new Error('Chat response was interrupted. Please try again.');
        return;
      }
    }
  } finally {
    if (!ended) await reader.cancel();
    reader.releaseLock();
  }
}
