# Setup Instructions

## Current Status
✅ Login screen removed - goes straight to chat
✅ Styling updated to match Claude website
✅ Dev server running on **http://localhost:3001**

## ⚠️ Important: Add Your API Key

The site is displaying a white screen or API errors because you need to add your Claude API key.

### Steps:

1. **Get your API key from Anthropic:**
   - Visit https://console.anthropic.com/
   - Sign in or create an account
   - Go to "API Keys" section
   - Create a new key and copy it

2. **Add the key to your `.env.local` file:**
   ```bash
   # Open the file
   nano .env.local

   # Replace 'your-api-key-here' with your actual key:
   ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
   ```

3. **Restart the dev server:**
   ```bash
   # Kill the current server (Ctrl+C if running in terminal)
   # Or if running in background:
   killall node

   # Start again:
   npm run dev
   ```

4. **Visit the site:**
   - Open http://localhost:3001 in your browser
   - You should now see the chat interface
   - Try sending a message!

## Features

- **Clean UI** matching Claude's website design
- **Streaming responses** from Claude API
- **MCP Tools** for extended functionality
- **Responsive** works on all devices

## Troubleshooting

If you see errors:
- Make sure your API key is valid
- Check that `.env.local` has no extra spaces
- Ensure you restarted the dev server after adding the key
- Check the terminal for any error messages
