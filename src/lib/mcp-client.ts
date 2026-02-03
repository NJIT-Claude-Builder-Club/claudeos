// MCP Server Client for connecting to real MCP servers
// This client can connect to MCP servers via stdio or SSE transport

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { MCPTool } from './mcp-tools';

export interface MCPServerConfig {
  name: string;
  command: string;
  args?: string[];
  env?: Record<string, string>;
}

// Example MCP server configurations
// These are commented out by default - uncomment to use
export const MCP_SERVERS: MCPServerConfig[] = [
  // Filesystem MCP Server
  // {
  //   name: 'filesystem',
  //   command: 'npx',
  //   args: ['-y', '@modelcontextprotocol/server-filesystem', '/path/to/allowed/directory'],
  // },

  // SQLite MCP Server
  // {
  //   name: 'sqlite',
  //   command: 'npx',
  //   args: ['-y', '@modelcontextprotocol/server-sqlite', '/path/to/database.db'],
  // },

  // GitHub MCP Server
  // {
  //   name: 'github',
  //   command: 'npx',
  //   args: ['-y', '@modelcontextprotocol/server-github'],
  //   env: {
  //     GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_TOKEN || '',
  //   },
  // },
];

class MCPClientManager {
  private clients: Map<string, Client> = new Map();
  private tools: MCPTool[] = [];

  async initialize() {
    // Initialize all configured MCP servers
    for (const serverConfig of MCP_SERVERS) {
      try {
        await this.connectToServer(serverConfig);
      } catch (error) {
        console.error(`Failed to connect to MCP server ${serverConfig.name}:`, error);
      }
    }
  }

  async connectToServer(config: MCPServerConfig) {
    try {
      const transport = new StdioClientTransport({
        command: config.command,
        args: config.args || [],
        env: config.env,
      });

      const client = new Client(
        {
          name: 'claudeos-client',
          version: '1.0.0',
        },
        {
          capabilities: {},
        }
      );

      await client.connect(transport);
      this.clients.set(config.name, client);

      // Get tools from this server
      const toolsResult = await client.listTools();

      // Convert MCP server tools to our MCPTool format
      const serverTools: MCPTool[] = toolsResult.tools.map((tool) => ({
        name: `${config.name}_${tool.name}`,
        description: tool.description || '',
        input_schema: tool.inputSchema as MCPTool['input_schema'],
      }));

      this.tools.push(...serverTools);

      console.log(`Connected to MCP server: ${config.name}, loaded ${serverTools.length} tools`);
    } catch (error) {
      console.error(`Error connecting to ${config.name}:`, error);
      throw error;
    }
  }

  async executeToolOnServer(
    serverName: string,
    toolName: string,
    toolInput: Record<string, unknown>
  ): Promise<unknown> {
    const client = this.clients.get(serverName);
    if (!client) {
      throw new Error(`MCP server ${serverName} not connected`);
    }

    try {
      const result = await client.callTool({
        name: toolName,
        arguments: toolInput,
      });

      return result;
    } catch (error) {
      console.error(`Error executing tool ${toolName} on ${serverName}:`, error);
      throw error;
    }
  }

  getTools(): MCPTool[] {
    return this.tools;
  }

  async disconnect() {
    for (const [name, client] of this.clients.entries()) {
      try {
        await client.close();
        console.log(`Disconnected from MCP server: ${name}`);
      } catch (error) {
        console.error(`Error disconnecting from ${name}:`, error);
      }
    }
    this.clients.clear();
    this.tools = [];
  }
}

// Singleton instance
let mcpClientManager: MCPClientManager | null = null;

export async function getMCPClientManager(): Promise<MCPClientManager> {
  if (!mcpClientManager) {
    mcpClientManager = new MCPClientManager();
    await mcpClientManager.initialize();
  }
  return mcpClientManager;
}

export async function executeMCPServerTool(
  toolName: string,
  toolInput: Record<string, unknown>
): Promise<unknown> {
  // Parse tool name (format: servername_toolname)
  const parts = toolName.split('_');
  if (parts.length < 2) {
    throw new Error(`Invalid MCP tool name: ${toolName}`);
  }

  const serverName = parts[0];
  const actualToolName = parts.slice(1).join('_');

  const manager = await getMCPClientManager();
  return manager.executeToolOnServer(serverName, actualToolName, toolInput);
}

export async function getAllMCPTools(): Promise<MCPTool[]> {
  try {
    const manager = await getMCPClientManager();
    return manager.getTools();
  } catch (error) {
    console.error('Error getting MCP tools:', error);
    return [];
  }
}
