import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readChatEvents } from '../src/lib/chat-stream.ts';

function stream(chunks) {
  return new ReadableStream({ start(controller) { chunks.forEach((chunk) => controller.enqueue(chunk)); controller.close(); } });
}
async function collect(chunks) {
  const events = [];
  for await (const event of readChatEvents(stream(chunks))) events.push(event);
  return events;
}
test('handles every byte boundary, multiple events, and split UTF-8', async () => {
  const expected = [
    { type: 'message_start' },
    { type: 'content_block_delta', delta: { type: 'text_delta', text: 'Hello 👋\nNJIT' } },
    { type: 'message_stop' },
  ];
  const bytes = new TextEncoder().encode(expected.map((event) => `data: ${JSON.stringify(event)}\n\n`).join(''));
  assert.deepEqual(await collect([bytes]), expected);
  assert.deepEqual(await collect([...bytes].map((byte) => Uint8Array.of(byte))), expected);
});
test('supports CRLF and comments, including explicit server errors', async () => {
  const event = { type: 'error', error: 'Please try again.' };
  assert.deepEqual(await collect([new TextEncoder().encode(`: keepalive\r\ndata: ${JSON.stringify(event)}\r\n\r\n`)]), [event]);
});
test('rejects malformed or truncated events instead of silently losing them', async () => {
  for (const text of ['data: {oops}\n\n', 'data: {"type":"message_stop"}', 'data: {"type":"message_stop"}\n']) {
    await assert.rejects(collect([new TextEncoder().encode(text)]));
  }
});
