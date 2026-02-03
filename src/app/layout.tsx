import type { Metadata } from "next";
import "./globals.css";
import { tiempos, styrene } from "./fonts";

export const metadata: Metadata = {
  title: "Claude Chat Simulator - Claude Builder Club @ NJIT",
  description: "An interactive chat simulator for exploring Claude's capabilities with real-time streaming and MCP tool integration. Built by the Claude Builder Club at NJIT.",
  icons: {
    icon: "/claude-ai.png",
    shortcut: "/claude-ai.png",
    apple: "/claude-ai.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${tiempos.variable} ${styrene.variable}`} suppressHydrationWarning>
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  );
}
