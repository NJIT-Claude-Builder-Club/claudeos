import type { Metadata } from "next";
import "./globals.css";
import { tiempos, styrene } from "./fonts";

export const metadata: Metadata = {
  title: "ClaudeOS - Claude Builder Club @ NJIT",
  description: "Claude Builder Club is a student-led community at the New Jersey Institute of Technology. We help students learn, build, and launch AI projects with Claude through hands-on workshops, build nights, and a supportive peer network.",
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
