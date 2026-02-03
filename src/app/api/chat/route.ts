import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';
import { DEFAULT_MCP_TOOLS, executeMCPTool, getAllTools } from '@/lib/mcp-tools';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Note: Edge runtime doesn't support stdio child processes
// To use real MCP servers with stdio transport, switch to nodejs runtime
// and configure MCP_SERVERS in src/lib/mcp-client.ts
export const runtime = 'edge';

const SYSTEM_MESSAGE = `You are a helpful assistant for the Claude Builder Club at NJIT (New Jersey Institute of Technology). You have knowledge about the club and can answer questions about it.

**Club Information:**
- Mission: "Anyone can build with AI"
- Officially supported by Anthropic via Claude Campus Ambassador program
- Community: 80+ members and growing
- Contact: njitclaudebuilderclub@gmail.com
- Discord: https://discord.gg/Z36MRK6jnS
- Instagram: https://www.instagram.com/claudenjit/
- GitHub: https://github.com/NJIT-Claude-Builder-Club

**Executive Board (E-Board):**
1. Donovan McHenry - President & Claude Builder Ambassador
2. Walter Zhong - Vice President
3. Tai Vu - Treasurer
4. Ahmed Asad - External Public Relations
5. Taylor Techaratanaprasert - Secretary
6. Nathalie Villa - Event Coordinator
7. Tasnima Haque - Public Relations
8. Thong Khong - Historian
9. Liezeil Jimenez - Demo Specialist
10. Gia Tailor - Freshman Representative
11. Shukan Dave - Freshman Representative

**Activities:**
- Hands-on workshops on AI development and prompt engineering
- Build nights where members work on AI projects
- Monthly meetups and guest speaker sessions
- Hackathons and collaborative projects
- Regular workshops on building with Claude

When answering questions, be friendly, informative, and helpful. Provide specific details when available.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          let conversationMessages = [...messages];
          let continueLoop = true;

          while (continueLoop) {
            // Call Claude with tools enabled
            const response = await anthropic.messages.create({
              model: 'claude-sonnet-4-20250514',
              max_tokens: 4096,
              system: SYSTEM_MESSAGE,
              messages: conversationMessages,
              tools: DEFAULT_MCP_TOOLS,
            });

            // Send message_start event
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: 'message_start', message: response })}\n\n`
              )
            );

            // Check if Claude wants to use tools
            const toolUseBlocks = response.content.filter(
              (block) => block.type === 'tool_use'
            );

            if (toolUseBlocks.length > 0) {
              // Send tool use events to frontend
              for (const block of response.content) {
                if (block.type === 'text') {
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({
                        type: 'content_block_delta',
                        delta: { type: 'text_delta', text: block.text },
                      })}\n\n`
                    )
                  );
                } else if (block.type === 'tool_use') {
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({
                        type: 'tool_use',
                        tool_use: block,
                      })}\n\n`
                    )
                  );
                }
              }

              // Execute all tools
              const toolResults = [];
              for (const toolBlock of toolUseBlocks) {
                if (toolBlock.type === 'tool_use') {
                  const result = await executeMCPTool(toolBlock.name, toolBlock.input);
                  toolResults.push({
                    type: 'tool_result' as const,
                    tool_use_id: toolBlock.id,
                    content: JSON.stringify(result),
                  });

                  // Send tool result event to frontend
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({
                        type: 'tool_result',
                        tool_use_id: toolBlock.id,
                        result,
                      })}\n\n`
                    )
                  );
                }
              }

              // Add assistant message and tool results to conversation
              conversationMessages.push({
                role: 'assistant',
                content: response.content,
              });
              conversationMessages.push({
                role: 'user',
                content: toolResults,
              });

              // Continue loop to get Claude's final response
            } else {
              // No tool use, send final response
              for (const block of response.content) {
                if (block.type === 'text') {
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({
                        type: 'content_block_delta',
                        delta: { type: 'text_delta', text: block.text },
                      })}\n\n`
                    )
                  );
                }
              }

              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'message_stop' })}\n\n`)
              );
              continueLoop = false;
            }
          }

          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
