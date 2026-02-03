import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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

    const stream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: SYSTEM_MESSAGE,
      messages,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            const chunk = encoder.encode(
              `data: ${JSON.stringify(event)}\n\n`
            );
            controller.enqueue(chunk);
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
