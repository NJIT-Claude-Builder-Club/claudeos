export interface MCPTool {
  name: string;
  description: string;
  input_schema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export const DEFAULT_MCP_TOOLS: MCPTool[] = [
  {
    name: 'get_club_info',
    description: 'Get information about the Claude Builder Club at NJIT — mission, eboard members, contact details, social links, or general about info.',
    input_schema: {
      type: 'object',
      properties: {
        info_type: {
          type: 'string',
          enum: ['about', 'mission', 'eboard', 'contact', 'activities'],
          description: 'The category of club information to retrieve.',
        },
      },
      required: ['info_type'],
    },
  },
  {
    name: 'get_hackathon_info',
    description: 'Get information about the CBC Spring 2026 Hackathon happening today — overview, schedule, tracks, or location/logistics.',
    input_schema: {
      type: 'object',
      properties: {
        info_type: {
          type: 'string',
          enum: ['overview', 'schedule', 'tracks', 'location', 'prizes', 'eligibility'],
          description: 'The category of hackathon information to retrieve.',
        },
      },
      required: ['info_type'],
    },
  },
  {
    name: 'search_workshops',
    description: 'Search for past or upcoming workshops and events run by the club.',
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'What to search for.',
        },
        filter: {
          type: 'string',
          enum: ['upcoming', 'past', 'all'],
          description: 'Filter by time.',
        },
      },
      required: ['query'],
    },
  },
];

export async function getAllTools(): Promise<MCPTool[]> {
  return DEFAULT_MCP_TOOLS;
}

export async function executeMCPTool(
  toolName: string,
  toolInput: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case 'get_club_info': {
      const data: Record<string, string> = {
        about:
          'The Claude Builder Club at NJIT (New Jersey Institute of Technology) is a student organization focused on building real projects with AI. We are officially supported by Anthropic through the Claude Campus Ambassador program. Our community has 80+ members and is growing every semester.',
        mission:
          '"Anyone can build with AI." We believe AI development should be accessible to everyone, regardless of background or experience level.',
        eboard:
          '1. Donovan McHenry — President & Claude Builder Ambassador\n2. Walter Zhong — Vice President\n3. Tai Vu — Treasurer\n4. Ahmed Asad — External Public Relations\n5. Taylor Techaratanaprasert — Secretary\n6. Nathalie Villa — Event Coordinator\n7. Tasnima Haque — Public Relations\n8. Thong Khong — Historian\n9. Liezeil Jimenez — Demo Specialist\n10. Gia Tailor — Freshman Representative\n11. Shukan Dave — Freshman Representative',
        contact:
          'Email: njitclaudebuilderclub@gmail.com\nDiscord: https://discord.gg/Z36MRK6jnS\nInstagram: https://www.instagram.com/claudenjit/\nGitHub: https://github.com/NJIT-Claude-Builder-Club',
        activities:
          'Hands-on workshops on AI development and prompt engineering, build nights where members work on their own AI projects, monthly meetups and guest speaker sessions, hackathons, and regular workshops on building with Claude.',
      };
      const result = data[toolInput.info_type as string];
      return result ?? 'Information not found.';
    }

    case 'get_hackathon_info': {
      const data: Record<string, string> = {
        overview:
          'The CBC Spring 2026 Hackathon was held on Sunday, April 26, 2026 at NJIT, hosted by the Claude Builder Club in partnership with Anthropic. The theme is social impact, inspired by Anthropic CEO Dario Amodei\'s essay "Machines of Loving Grace" — a vision of AI helping eliminate disease, expand opportunity, strengthen democracy, and help people find meaning. Teams built AI-powered prototypes across three tracks. This is part of a global event spanning 78 Claude Builder Club universities in 12 countries: United States, United Kingdom, Canada, Ireland, Germany, Switzerland, India, Ghana, Nigeria, Uganda, Rwanda, and Kenya.',
        schedule:
          '8:00 AM — Setup / Room Access\n8:30 AM — Registration & Breakfast\n9:00 AM — Opening Ceremony & Challenge Announcement\n9:15 AM — Team Formation\n9:30 AM — Hacking Begins\n12:30 PM — Lunch Break\n1:15 PM — Hacking Resumes\n5:45 PM — Dinner\n6:15 PM — Hacking Resumes\n6:45 PM — Judges Arrive\n7:00 PM — Final Submission Deadline\n7:15 PM — Presentations Begin\n~8:07 PM — Judges\' Deliberation\n~8:27 PM — Closing Ceremony & Winner Announcement\n~8:47 PM — Event Ends\n\nTotal hacking time: ~9.5 hours',
        tracks:
          '1. Healthcare & Wellbeing — Make healthcare more accessible, expand mental health support, and help people manage their physical and emotional wellbeing. Think: diagnostic aids, patient education, medication tools, mental health literacy, accessibility for neurodivergent individuals.\n\n2. Economic Empowerment & Education — Remove barriers to learning and opportunity. Help people learn skills, find jobs, and improve their economic situation. Think: adaptive tutoring, career guidance, financial literacy, job interview prep, scholarship matching.\n\n3. Creative Flourishing — Amplify human creativity, help people find meaning, and support cultural expression and preservation. Think: community storytelling, music/art education, language preservation, intergenerational knowledge exchange.\n\nAll projects must: solve a real problem for specific people, use Claude in a meaningful way, be a new build (no prior projects), and be submitted via Devpost.',
        location:
          'Kupfrian Hall, Newark, New Jersey (NJIT campus). Food and beverages are provided throughout the event.',
        prizes:
          'Each track winner receives $500 in API credits plus $100 cash. There are three tracks, so three sets of prizes are awarded.\n\nBonus: Attendees who participated in CBC meetings beforehand are eligible for $25 in API credits to use during the hackathon.',
        eligibility:
          'Open to all NJIT students. Rules:\n• Must be a new build — no prior projects\n• Must incorporate Claude in some meaningful capacity\n• Teams of up to 4 members; solo participants welcome\n• Submit your project via Devpost before the 7:00 PM deadline\n• Contact: claude.njit@anthropic.com for questions',
      };
      const result = data[toolInput.info_type as string];
      return result ?? 'Information not found.';
    }

    case 'search_workshops': {
      return 'Check our Discord (https://discord.gg/Z36MRK6jnS) or Instagram (@claudenjit) for the latest workshop announcements and upcoming events.';
    }

    default:
      return 'Tool not found.';
  }
}
