# ClaudeOS - Claude Builder Club @ NJIT Website

A desktop-style website for the Claude Builder Club @ NJIT, built with Next.js and designed to look like a simple operating system interface.

## 🎯 Project Overview

ClaudeOS is a creative website that simulates a desktop environment where visitors can click on folder icons to open windows containing different sections about the club. The design features:

- **Desktop metaphor** with draggable folder icons
- **Windows** that can be opened, closed, minimized, and dragged around
- **Responsive design** that switches to a mobile-friendly interface on small screens
- **Theme switching** between light and dark modes
- **Custom orange accent color** (#E46E55) with Gruvbox-inspired palette

## 🚀 Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS v4 with custom CSS variables
- **State Management**: Zustand for window management
- **Fonts**: EB Garamond (headings) and Inter (body text)
- **Icons**: Lucide React
- **Deployment**: Vercel

## 🛠️ Development

### Setup
```bash
npm install
npm run dev
```

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Architecture

### Window Management System
The core of the application is built around a Zustand store that manages:
- Window z-order and focus states
- Window positions and drag operations
- Minimization and restoration
- Persistent state across sessions

### Component Structure
```
src/components/
├── Desktop.tsx          # Main desktop container with responsive detection
├── MobileDesktop.tsx    # Mobile-specific interface
├── Window.tsx           # Draggable window component
├── FolderIcon.tsx       # Draggable desktop icons
├── Taskbar.tsx          # Bottom taskbar with controls
└── pages/              # Page content components
```

## 🎨 Design System

### Colors (Gruvbox-inspired)
- **Primary**: #E46E55 (Orange accent)
- **Light theme**: Warm cream backgrounds
- **Dark theme**: Dark grays with warm undertones

### Typography
- **Headings**: EB Garamond (serif)
- **Body text**: Inter (sans-serif)

## 🗂️ Content Sections

1. **About**: Club introduction, mission, and social links
2. **E-Board**: Executive board member grid (loaded from JSON)
3. **Feed**: Instagram integration and recent updates
4. **Workshops**: Upcoming events and learning resources
5. **Contact**: Contact information and meeting details

## 📱 Mobile Experience

On mobile devices, the interface automatically switches to a card-based layout with full-screen page views and touch-optimized interactions.

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
