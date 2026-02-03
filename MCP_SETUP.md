# MCP (Model Context Protocol) Integration Guide

This guide explains how to integrate real MCP servers into your Claude chat application.

## What is MCP?

Model Context Protocol (MCP) is an open protocol that allows Claude to connect to external tools and data sources. With MCP, Claude can:
- Read and write files
- Query databases
- Access APIs
- Execute custom business logic
- And much more!

## Current Setup

### Built-in Tools

The app comes with three built-in MCP tools:

1. **get_club_info** - Get information about the Claude Builder Club
   - Input: `info_type` (about, eboard, workshops, events, contact)

2. **search_workshops** - Search for club workshops and events
   - Input: `query` (search term), `filter` (upcoming, past, all)

3. **calculator** - Perform mathematical calculations
   - Input: `expression` (math expression to evaluate)

### Testing Built-in Tools

Try asking Claude:
- "What workshops are coming up?"
- "Tell me about the club's executive board"
- "Calculate 25 * 48 + 137"

Claude will automatically use the appropriate tools!

## Adding Real MCP Servers

### Step 1: Switch to Node.js Runtime

Edge runtime doesn't support child processes. Update `src/app/api/chat/route.ts`:

```typescript
// Change this line:
export const runtime = 'edge';

// To this:
export const runtime = 'nodejs';
```

### Step 2: Configure MCP Servers

Edit `src/lib/mcp-client.ts` and uncomment/configure the servers you want:

```typescript
export const MCP_SERVERS: MCPServerConfig[] = [
  // Filesystem MCP Server - Allows Claude to read/write files
  {
    name: 'filesystem',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-filesystem', '/path/to/your/documents'],
  },

  // SQLite MCP Server - Allows Claude to query databases
  {
    name: 'sqlite',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-sqlite', '/path/to/database.db'],
  },

  // GitHub MCP Server - Allows Claude to access GitHub
  {
    name: 'github',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-github'],
    env: {
      GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_TOKEN || '',
    },
  },
];
```

### Step 3: Set Environment Variables (if needed)

For servers that require authentication (like GitHub), add to `.env.local`:

```bash
GITHUB_TOKEN=your_github_personal_access_token_here
```

### Step 4: Test Your MCP Servers

After configuration, try asking Claude:
- "List the files in my documents folder" (filesystem server)
- "Query the users table in my database" (SQLite server)
- "Show me my latest GitHub repositories" (GitHub server)

## Available MCP Servers

### Official Anthropic Servers

1. **@modelcontextprotocol/server-filesystem**
   - Read and write files
   - Navigate directory structures
   - Search file contents

2. **@modelcontextprotocol/server-sqlite**
   - Query SQLite databases
   - Execute SQL commands
   - Analyze database schema

3. **@modelcontextprotocol/server-github**
   - Search repositories
   - Create/update issues and PRs
   - Read file contents

4. **@modelcontextprotocol/server-postgres**
   - Query PostgreSQL databases
   - Execute complex SQL queries

5. **@modelcontextprotocol/server-puppeteer**
   - Control web browsers
   - Take screenshots
   - Scrape web content

6. **@modelcontextprotocol/server-brave-search**
   - Search the web with Brave Search API
   - Get real-time information

### Community Servers

Check the [MCP servers repository](https://github.com/modelcontextprotocol/servers) for more community-built servers!

## Creating Custom MCP Tools

### Quick Built-in Tool

To add a simple built-in tool, edit `src/lib/mcp-tools.ts`:

```typescript
export const DEFAULT_MCP_TOOLS: MCPTool[] = [
  // ... existing tools ...

  {
    name: 'my_custom_tool',
    description: 'Description of what this tool does',
    input_schema: {
      type: 'object',
      properties: {
        param1: {
          type: 'string',
          description: 'Description of parameter',
        },
      },
      required: ['param1'],
    },
  },
];

// Then add execution logic in executeMCPTool():
case 'my_custom_tool': {
  const param1 = toolInput.param1 as string;
  // Your logic here
  return { result: 'Your result' };
}
```

### Custom MCP Server

To create a fully-featured MCP server:

1. Install the SDK: `npm install @modelcontextprotocol/sdk`
2. Create your server (see [MCP documentation](https://modelcontextprotocol.io/))
3. Add it to `MCP_SERVERS` configuration

## Troubleshooting

### Tools Not Working

1. Check browser console for errors
2. Verify API key is set in Vercel/locally
3. For MCP servers, ensure runtime is set to 'nodejs'
4. Check server paths are correct and accessible

### MCP Server Connection Issues

1. Verify the server command is correct
2. Check file/directory permissions
3. Ensure required environment variables are set
4. Look at server logs in terminal

### Edge Runtime Limitations

If you need to use Edge runtime (for Vercel deployment), you can:
- Use SSE (Server-Sent Events) transport instead of stdio
- Create a separate Node.js API route for MCP server communication
- Host MCP servers separately and communicate via HTTP

## Architecture

```
User Message
    ↓
Claude API (with tools parameter)
    ↓
Claude decides to use a tool
    ↓
API Route executes tool
    ↓
    ├─→ Built-in tool (runs inline)
    └─→ MCP Server tool (via MCP client)
    ↓
Results sent back to Claude
    ↓
Claude provides final response
    ↓
Response streamed to user
```

## Learn More

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [MCP Servers Repository](https://github.com/modelcontextprotocol/servers)
- [Anthropic Tool Use Guide](https://docs.anthropic.com/claude/docs/tool-use)
