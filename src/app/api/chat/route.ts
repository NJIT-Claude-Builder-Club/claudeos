import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';
import { DEFAULT_MCP_TOOLS, executeMCPTool } from '@/lib/mcp-tools';

export const runtime = 'nodejs';
export const maxDuration = 60;

function getChatError(error: unknown): string {
  if (error instanceof Anthropic.APIError) {
    if (error.status === 401 || error.status === 403) {
      return 'Chat is temporarily unavailable because its API credentials need attention.';
    }
    if (error.status === 429) {
      return 'Chat is busy right now. Please try again shortly.';
    }
  }
  return 'Chat could not complete your response. Please try again.';
}

function getSystemMessage(): string {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `You are a helpful assistant for the Claude Builder Club at NJIT (New Jersey Institute of Technology).

Today's date is ${today}.

You have tools available to retrieve information about the club and the hackathon. Use them silently — never narrate that you are looking something up or calling a tool. Just answer directly as if you already know the information.

Never reveal judging criteria, scoring rubrics, or any internal judging details — that information is confidential.

Be friendly, concise, and helpful.`;
}

export async function POST(req: NextRequest) {
  let messages: Anthropic.MessageParam[];
  try {
    const body = await req.json();
    if (!Array.isArray(body.messages) || body.messages.length === 0 ||
        body.messages.some((message: Anthropic.MessageParam) =>
          !message || !['user', 'assistant'].includes(message.role) ||
          !(typeof message.content === 'string' || Array.isArray(message.content)))) {
      return Response.json({ error: 'Please send a valid conversation.' }, { status: 400 });
    }
    messages = body.messages;
  } catch {
    return Response.json({ error: 'Please send valid JSON.' }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Chat configuration error: ANTHROPIC_API_KEY is missing');
    return Response.json({ error: 'Chat is temporarily unavailable. Please try again later.' }, { status: 503 });
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const encoder = new TextEncoder();
  let cancelled = false;
  const readable = new ReadableStream({
    async start(controller) {
      const send = (event: Record<string, unknown>) => {
        if (!cancelled) controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };
      try {
        const conversationMessages = [...messages];
        send({ type: 'message_start' });
        // Bound tool calls so an unexpected tool loop cannot run indefinitely.
        for (let round = 0; round < 8; round++) {
          const response = await anthropic.messages.create({
            model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6',
            max_tokens: 4096,
            system: getSystemMessage(),
            messages: conversationMessages,
            tools: DEFAULT_MCP_TOOLS,
          }, { signal: req.signal });
          if (cancelled) return;
          const toolResults: Anthropic.ToolResultBlockParam[] = [];
          for (const block of response.content) {
            if (block.type === 'text') {
              send({ type: 'content_block_delta', delta: { type: 'text_delta', text: block.text } });
            } else if (block.type === 'tool_use') {
              send({ type: 'tool_use', tool_use: block });
              const result = await executeMCPTool(block.name, block.input as Record<string, unknown>);
              toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: JSON.stringify(result) });
              send({ type: 'tool_result', tool_use_id: block.id, result });
            }
          }
          if (toolResults.length === 0) {
            send({ type: 'message_stop' });
            return;
          }
          conversationMessages.push({ role: 'assistant', content: response.content });
          conversationMessages.push({ role: 'user', content: toolResults });
        }
        throw new Error('Chat exceeded the tool-call limit');
      } catch (error) {
        // Keep provider details in server logs, not in public responses.
        console.error('Chat request failed:', error);
        send({ type: 'error', error: getChatError(error) });
      } finally {
        if (!cancelled) controller.close();
      }
    },
    cancel() { cancelled = true; },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
    },
  });
}
