import React from 'react';
import { ExternalLink, Github, MessageCircle } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-heading text-[var(--step-3)] md:text-[var(--step-2)] tracking-tightish text-text mb-4 font-medium">
          Welcome to Claude Builder Club @ NJIT
        </h1>
        <p className="font-body text-[var(--step-1)] text-primary font-medium mb-4">
          "Anyone can build with AI."
        </p>
        <p className="font-body text-[var(--step-0)] leading-relaxed text-text">
          Claude Builder Club is a student-led community at the New Jersey Institute of Technology. 
          We help students learn, build, and launch AI projects with Claude through hands-on workshops, 
          build nights, and a supportive peer network. The club is supported by Anthropic with access 
          to Claude Pro, API credits, and event resources. All majors and experience levels are welcome.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="font-heading text-[var(--step-2)] tracking-tightish text-text font-medium">
          What We Do
        </h2>
        <div className="grid gap-4">
          <div className="bg-bg/50 p-4 rounded-lg border border-border">
            <h3 className="font-heading text-[var(--step-0)] tracking-tightish font-medium text-text mb-2">🛠️ Build Nights</h3>
            <p className="font-body text-[var(--step--1)] leading-relaxed text-text/80">
              Collaborative sessions where members work on AI-powered projects, 
              from simple automations to complex applications.
            </p>
          </div>
          <div className="bg-bg/50 p-4 rounded-lg border border-border">
            <h3 className="font-heading text-[var(--step-0)] tracking-tightish font-medium text-text mb-2">📚 Workshops</h3>
            <p className="font-body text-[var(--step--1)] leading-relaxed text-text/80">
              Hands-on learning experiences covering prompt engineering, AI tools, 
              and practical applications across different fields.
            </p>
          </div>
          <div className="bg-bg/50 p-4 rounded-lg border border-border">
            <h3 className="font-heading text-[var(--step-0)] tracking-tightish font-medium text-text mb-2">🏆 Hackathons</h3>
            <p className="font-body text-[var(--step--1)] leading-relaxed text-text/80">
              Competitive events where teams create innovative solutions using 
              AI technologies in limited time frames.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-heading text-[var(--step-2)] tracking-tightish font-medium text-text mb-4">
          Connect With Us
        </h2>
        <div className="flex flex-col gap-3">
          <a 
            href="https://discord.gg/Z36MRK6jnS" 
            className="flex items-center gap-3 p-3 bg-bg/50 hover:bg-border/30 rounded-lg border border-border transition-colors group"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="text-primary" size={20} />
            <div>
              <div className="font-medium text-text group-hover:text-primary transition-colors">
                Join Discord
              </div>
              <div className="text-[var(--step--1)] text-muted font-body">
                Daily discussions, announcements, and community support
              </div>
            </div>
            <ExternalLink className="text-muted group-hover:text-primary transition-colors ml-auto" size={16} />
          </a>

          <a 
            href="https://www.instagram.com/claudenjit/" 
            className="flex items-center gap-3 p-3 bg-bg/50 hover:bg-border/30 rounded-lg border border-border transition-colors group"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="w-5 h-5 text-primary">📸</div>
            <div>
              <div className="font-medium text-text group-hover:text-primary transition-colors">
                Follow Instagram
              </div>
              <div className="text-[var(--step--1)] text-muted font-body">
                Event photos, project showcases, and club updates
              </div>
            </div>
            <ExternalLink className="text-muted group-hover:text-primary transition-colors ml-auto" size={16} />
          </a>

          <a 
            href="https://github.com/NJIT-Claude-Builder-Club" 
            className="flex items-center gap-3 p-3 bg-bg/50 hover:bg-border/30 rounded-lg border border-border transition-colors group"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="text-primary" size={20} />
            <div>
              <div className="font-medium text-text group-hover:text-primary transition-colors">
                Explore GitHub
              </div>
              <div className="text-[var(--step--1)] text-muted font-body">
                Open source projects, code samples, and resources
              </div>
            </div>
            <ExternalLink className="text-muted group-hover:text-primary transition-colors ml-auto" size={16} />
          </a>

          <a 
            href="mailto:njitclaudebuilderclub@gmail.com" 
            className="flex items-center gap-3 p-3 bg-bg/50 hover:bg-border/30 rounded-lg border border-border transition-colors group"
          >
            <div className="w-5 h-5 text-primary">📧</div>
            <div>
              <div className="font-medium text-text group-hover:text-primary transition-colors">
                Contact Us
              </div>
              <div className="text-[var(--step--1)] text-muted font-body">
                njitclaudebuilderclub@gmail.com
              </div>
            </div>
          </a>
        </div>
      </div>

      <div className="text-center pt-6 border-t border-border">
        <p className="text-[var(--step--1)] text-muted font-body">
          Supported by <span className="text-primary font-medium">Anthropic</span>
        </p>
      </div>
    </div>
  );
}