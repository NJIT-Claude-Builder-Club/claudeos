// MCP Tool definitions for Claude chat
// You can add your custom MCP tools here

export interface MCPTool {
  name: string;
  description: string;
  input_schema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

// Example tools - customize these for your club's needs
export const DEFAULT_MCP_TOOLS: MCPTool[] = [
  {
    name: 'get_club_info',
    description: 'Get information about the Claude Builder Club at NJIT',
    input_schema: {
      type: 'object',
      properties: {
        info_type: {
          type: 'string',
          enum: ['about', 'eboard', 'workshops', 'events', 'contact'],
          description: 'The type of information to retrieve',
        },
      },
      required: ['info_type'],
    },
  },
  {
    name: 'search_workshops',
    description: 'Search for workshops and events organized by the club',
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query for workshops',
        },
        filter: {
          type: 'string',
          enum: ['upcoming', 'past', 'all'],
          description: 'Filter workshops by time',
        },
      },
      required: ['query'],
    },
  },
];

// Get all available tools (built-in + MCP server tools)
export async function getAllTools(): Promise<MCPTool[]> {
  // In Edge runtime, only return built-in tools
  // For Node.js runtime with MCP servers, uncomment the import and implementation
  return DEFAULT_MCP_TOOLS;
}

// Execute a tool (built-in or MCP server tool)
export async function executeMCPTool(
  toolName: string,
  toolInput: Record<string, unknown>
): Promise<unknown> {
  // Built-in tools
  switch (toolName) {
    case 'get_club_info': {
      const infoType = toolInput.info_type as string;
      const clubInfo = {
        about: 'Claude Builder Club at NJIT is a student organization focused on building with AI and exploring Claude capabilities.',
        eboard: 'Executive board includes passionate students leading AI initiatives at NJIT.',
        workshops: 'Regular workshops on AI development, prompt engineering, and building with Claude.',
        events: 'Monthly meetups, hackathons, and guest speaker sessions.',
        contact: 'Reach us at claude.builders@njit.edu',
      };
      return { info: clubInfo[infoType as keyof typeof clubInfo] || 'Info not found' };
    }

    case 'search_workshops': {
      return {
        message: 'No specific workshops are currently scheduled. Please check our Discord or Instagram for upcoming events and announcements.',
      };
    }

    default:
      return { error: 'Tool not found' };
  }
}
