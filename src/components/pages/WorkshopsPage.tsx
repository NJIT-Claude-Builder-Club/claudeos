import React from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

export function WorkshopsPage() {
  // Upcoming workshops - to be scheduled
  const upcomingWorkshops = [
    {
      id: 1,
      title: "Claude Code Workshop",
      date: "September 24th, 2024",
      time: "6:30 PM - 8:00 PM",
      description: "Learn how to use Claude Code for enhanced AI-powered development. This hands-on workshop will cover the fundamentals of Claude Code and practical applications for your projects. This is a virtual workshop accessible through Google Meet.",
      instructor: "Anthropic Technical Staff",
      location: "Virtual (Google Meet)",
      meetLink: "https://meet.google.com/mna-nsra-fnb"
    }
  ];

  // Past/planned workshop topics
  const workshopTopics = [
    "Building Agents",
    "Societal Impacts of AI",
    "Building with MCP",
    "Entering the workforce in a post AI world",
    "AI Research Salon"
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-heading font-bold text-text mb-2">
          Workshops & Events
        </h1>
        <p className="text-muted">
          Hands-on learning experiences to help you master AI tools and concepts
        </p>
      </div>

      {/* Upcoming Workshops */}
      <div>
        <h2 className="text-xl font-heading font-semibold text-text mb-4">
          Upcoming Workshops
        </h2>
        {upcomingWorkshops.length === 0 ? (
          <div className="bg-bg/50 border border-border rounded-xl p-6 text-center">
            <h3 className="font-heading font-semibold text-text mb-2">
              Workshops Coming Soon!
            </h3>
            <p className="text-muted text-sm mb-4">
              We're currently planning our workshop schedule. Join our Discord to stay 
              updated on upcoming hands-on learning sessions.
            </p>
            <a 
              href="https://discord.gg/Z36MRK6jnS"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              Join Discord for Updates
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingWorkshops.map((workshop, index) => (
              <div
                key={index}
                className="bg-bg/50 border border-border rounded-xl p-6 hover:border-primary/30 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-text text-xl mb-2">
                      {workshop.title}
                    </h3>
                    <p className="text-muted text-sm mb-3">
                      {workshop.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted">
                        <Calendar size={16} />
                        <span>{workshop.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted">
                        <Clock size={16} />
                        <span>{workshop.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted">
                        <Users size={16} />
                        <span>Taught by {workshop.instructor}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted">
                        <MapPin size={16} />
                        <span>{workshop.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <a
                      href={workshop.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium text-center"
                    >
                      Join Google Meet
                    </a>
                    <a
                      href="https://calendar.google.com/calendar/u/0/share?slt=1AWn26rP9EMBJ5jtsyvL83R_Rezc1sXkwaCWax5F2Uw4COXa_pC1PZclvEq1zFj2Q3zamqbdHbnlR3w"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium text-center"
                    >
                      RSVP
                    </a>
                    <a
                      href="https://discord.gg/Z36MRK6jnS"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium text-center"
                    >
                      Join Discord
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


      {/* Workshop Topics */}
      <div>
        <h2 className="text-xl font-heading font-semibold text-text mb-4">
          Planned Workshop Topics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {workshopTopics.map((topic, index) => (
            <div 
              key={index}
              className="bg-bg/30 border border-border/50 rounded-lg p-3 text-sm text-muted"
            >
              {topic}
            </div>
          ))}
        </div>
      </div>

      <div className="text-center pt-6 border-t border-border">
        <p className="text-sm text-muted mb-2">
          Have an idea for a workshop?
        </p>
        <p className="text-sm text-text">
          We love member-led sessions! Propose your topic in our Discord server.
        </p>
      </div>
    </div>
  );
}