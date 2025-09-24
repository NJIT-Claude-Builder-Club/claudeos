import React from 'react';
import { Mail, MessageCircle, MapPin, Clock, Users, UserPlus } from 'lucide-react';

export function ContactPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="text-center">
        <h1 className="text-2xl font-heading font-bold text-text mb-2">
          Get in Touch
        </h1>
        <p className="text-muted">
          Questions? Ideas? Ready to join our AI community? We'd love to hear from you!
        </p>
      </div>

      {/* Join the Club */}
      <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-6 text-center">
        <UserPlus className="text-green-600 mx-auto mb-4" size={48} />
        <h2 className="font-heading font-bold text-text text-xl mb-2">
          Join the Club
        </h2>
        <p className="text-muted text-sm mb-4">
          Ready to become a member? Sign up through our official registration form.
        </p>
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLScP9LuFwiHEx806tv9zczjCIEzqO1Zjb-FjB4XWoa6BS1NNKQ/viewform?usp=send_form"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
        >
          <UserPlus size={20} />
          Sign Up Now
        </a>
      </div>

      {/* Primary Contact */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6 text-center">
        <Mail className="text-primary mx-auto mb-4" size={48} />
        <h2 className="font-heading font-bold text-text text-xl mb-2">
          Official Email
        </h2>
        <a 
          href="mailto:njitclaudebuilderclub@gmail.com"
          className="text-primary hover:underline font-medium text-lg"
        >
          njitclaudebuilderclub@gmail.com
        </a>
        <p className="text-muted text-sm mt-2">
          For official inquiries, partnership requests, and general questions
        </p>
      </div>

      {/* Discord */}
      <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-6 text-center">
        <MessageCircle className="text-blue-600 mx-auto mb-4" size={48} />
        <h2 className="font-heading font-bold text-text text-xl mb-2">
          Discord Community
        </h2>
        <p className="text-muted text-sm mb-4">
          Join our Discord server for daily discussions, quick questions, and community support.
        </p>
        <a
          href="https://discord.gg/Z36MRK6jnS"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
        >
          <MessageCircle size={20} />
          Join Server
        </a>
      </div>

      {/* Meeting Information */}
      <div className="space-y-4">
        <h2 className="text-xl font-heading font-semibold text-text">
          Club Meetings
        </h2>
        
        <div className="bg-bg/50 border border-border rounded-xl p-6">
          <div className="text-center mb-4">
            <p className="font-medium text-text mb-2">Meeting Schedule Coming Soon!</p>
            <p className="text-sm text-muted">
              We're currently organizing our meeting schedule as we complete NJIT's 
              recognition process. Join our Discord for the latest updates.
            </p>
          </div>
          
          <div className="p-4 bg-primary/10 rounded-lg">
            <p className="text-sm text-text text-center">
              <span className="font-medium">New members always welcome!</span> No experience required. 
              We'll help you get started with AI tools and connect you with like-minded peers.
            </p>
          </div>
        </div>
      </div>

      {/* Leadership Contact */}
      <div>
        <h2 className="text-xl font-heading font-semibold text-text mb-4">
          Leadership Team
        </h2>
        <div className="space-y-3">
          <div className="bg-bg/50 border border-border rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-text">General Questions & Membership</p>
              <p className="text-sm text-muted">Contact our President or Vice President</p>
            </div>
            <button className="text-primary hover:underline text-sm font-medium">
              View E-Board →
            </button>
          </div>
          
          <div className="bg-bg/50 border border-border rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-text">Workshop Ideas & Technical Support</p>
              <p className="text-sm text-muted">Reach out to our President</p>
            </div>
            <button className="text-primary hover:underline text-sm font-medium">
              Discord: @President
            </button>
          </div>

          <div className="bg-bg/50 border border-border rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-text">Events & Community Engagement</p>
              <p className="text-sm text-muted">Connect with our External Public Representative</p>
            </div>
            <button className="text-primary hover:underline text-sm font-medium">
              Discord: @ExtPubRep
            </button>
          </div>
        </div>
      </div>

      <div className="text-center pt-6 border-t border-border">
        <p className="text-sm text-muted">
          Response time is typically within 24 hours for email inquiries.
          <br />
          For urgent matters, Discord is your best bet!
        </p>
      </div>
    </div>
  );
}