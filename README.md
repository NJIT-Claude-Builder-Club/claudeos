# Claude Chat Simulator - Claude Builder Club @ NJIT

An interactive Claude chat simulator for the Claude Builder Club @ NJIT, built with Next.js, featuring real-time streaming responses and MCP (Model Context Protocol) tool integration.

## 🎯 Project Overview

The Claude Chat Simulator provides an immersive experience for exploring Claude's capabilities with:

- **Real-time streaming responses** from Claude API
- **MCP tool integration** for extended functionality
- **Beautiful chat interface** with message history
- **Tool usage visualization** showing when Claude uses tools
- **Responsive design** that works on all devices
- **Auto-login animation** for smooth onboarding
- **Custom orange accent color** (#E46E55) with Gruvbox-inspired palette

## 🚀 Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **AI**: Anthropic Claude API with streaming support
- **MCP**: Model Context Protocol SDK for tool integration
- **Styling**: Tailwind CSS v4 with custom CSS variables
- **State Management**: Zustand for chat management
- **Fonts**: EB Garamond (headings) and Inter (body text)
- **Icons**: Lucide React
- **Deployment**: Vercel

## 🛠️ Development

### Setup

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Configure your API key:**
Create a `.env.local` file in the root directory:
```bash
ANTHROPIC_API_KEY=your-api-key-here
```

To get an API key:
- Sign up at [console.anthropic.com](https://console.anthropic.com/)
- Navigate to API Keys section
- Generate a new key and copy it to your `.env.local` file

3. **Start the development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the chat simulator.

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🏗️ Architecture

### Chat Management System
The application uses Zustand for state management and handles:
- Message history with user and assistant roles
- Streaming responses with real-time updates
- Tool usage tracking and visualization
- Message timestamps and metadata

### Component Structure
```
src/
├── app/
│   ├── api/chat/route.ts    # Claude API streaming endpoint
│   └── page.tsx              # Main page with login flow
├── components/
│   ├── ChatInterface.tsx     # Main chat container
│   ├── LoginScreen.tsx       # Auto-login animation
│   └── chat/
│       ├── Message.tsx       # Individual message component
│       ├── MessageList.tsx   # Scrollable message container
│       └── ChatInput.tsx     # Message input with send button
└── lib/
    ├── chat-store.ts         # Zustand store for chat state
    └── mcp-tools.ts          # MCP tool definitions
```

### API Route
The `/api/chat` endpoint:
- Uses Edge Runtime for optimal performance
- Streams responses from Claude API
- Handles tool calling and execution
- Returns Server-Sent Events (SSE) for real-time updates

## 🎨 Design System

### Colors (Gruvbox-inspired)
- **Primary**: #E46E55 (Orange accent)
- **Light theme**: Warm cream backgrounds
- **Dark theme**: Dark grays with warm undertones

### Typography
- **Headings**: EB Garamond (serif)
- **Body text**: Inter (sans-serif)

## 🔧 MCP Tools

The chat simulator includes built-in MCP tools that Claude can use:

1. **get_club_info**: Retrieve information about the Claude Builder Club
   - Supports: about, eboard, workshops, events, contact

2. **search_workshops**: Search for club workshops and events
   - Filter by: upcoming, past, or all events

3. **calculator**: Perform mathematical calculations
   - Evaluate mathematical expressions safely

### Adding Custom Tools

Edit `src/lib/mcp-tools.ts` to add your own tools:

```typescript
export const DEFAULT_MCP_TOOLS: MCPTool[] = [
  {
    name: 'your_tool_name',
    description: 'What your tool does',
    input_schema: {
      type: 'object',
      properties: {
        // Define your parameters here
      },
      required: ['param1'],
    },
  },
];
```

Then implement the tool execution in `executeMCPTool()`.

## 📱 Features

- **Streaming Responses**: See Claude's responses appear in real-time
- **Tool Usage Display**: Visual indicators when Claude uses tools
- **Message History**: Full conversation history with timestamps
- **Clear Chat**: Reset conversation at any time
- **Settings Panel**: View enabled MCP tools
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Keyboard Shortcuts**:
  - Enter to send message
  - Shift+Enter for new line
  - Ctrl+Shift+L to logout (for testing)

## 🚀 Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

## 🎯 Club Information

**Claude Builder Club @ NJIT**
- Mission: "Anyone can build with AI"
- Officially supported by Anthropic via Claude Campus Ambassador program
- Community: 80+ members and growing
- Status: E-Board formed; completing NJIT recognition process
- Contact: njitclaudebuilderclub@gmail.com
- Discord: https://discord.gg/Z36MRK6jnS
- Instagram: https://www.instagram.com/claudenjit/
- GitHub: https://github.com/NJIT-Claude-Builder-Club
