import React from 'react';
import { ExternalLink, Instagram } from 'lucide-react';

export function FeedPage() {
  return (
    <div className="space-y-6 max-w-lg mx-auto text-center">
      <div>
        <h1 className="text-2xl font-heading font-bold text-text mb-2">
          Club Feed
        </h1>
        <p className="text-muted">
          Stay up to date with our latest activities and events
        </p>
      </div>

      {/* Instagram Integration Placeholder */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-8">
        <Instagram className="text-primary mx-auto mb-4" size={48} />
        <h3 className="font-heading font-semibold text-text mb-2">
          Follow us on Instagram
        </h3>
        <p className="text-muted text-sm mb-6">
          See photos from our workshops, build nights, and community events. 
          Get inspired by the amazing projects our members are creating!
        </p>
        <a 
          href="https://www.instagram.com/claudenjit/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          <Instagram size={18} />
          Follow @claudenjit
          <ExternalLink size={16} />
        </a>
      </div>

      {/* Recent Updates */}
      <div className="space-y-4">
        <h2 className="text-lg font-heading font-semibold text-text">
          Recent Updates
        </h2>
        
        <div className="space-y-3">
          <div className="bg-bg/50 border border-border rounded-lg p-4 text-left">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-text">Club Launch! 🎉</h3>
              <span className="text-xs text-muted">Recent</span>
            </div>
            <p className="text-sm text-muted">
              We're excited to officially launch the Claude Builder Club @ NJIT! 
              Our E-Board is formed and we're building our community of 80+ members.
            </p>
          </div>

          <div className="bg-bg/50 border border-border rounded-lg p-4 text-left">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-text">First Involvement Fair 📚</h3>
              <span className="text-xs text-muted">Recent</span>
            </div>
            <p className="text-sm text-muted">
              We successfully attended our first involvement fair and met so many 
              excited students ready to build with AI. Welcome to all our new members!
            </p>
          </div>

          <div className="bg-bg/50 border border-border rounded-lg p-4 text-left">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-text">Anthropic Partnership 🤝</h3>
              <span className="text-xs text-muted">Recent</span>
            </div>
            <p className="text-sm text-muted">
              Proud to be officially supported by Anthropic through the Claude Campus 
              Ambassador program with access to Claude Pro, API credits, and event resources!
            </p>
          </div>
        </div>
      </div>

      <div className="text-center pt-4 border-t border-border">
        <p className="text-xs text-muted">
          Want to share your project or announcement? 
          <br />
          Reach out to our Community Manager on Discord!
        </p>
      </div>
    </div>
  );
}