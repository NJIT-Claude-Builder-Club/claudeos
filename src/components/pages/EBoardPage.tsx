import React from 'react';
import eboardData from '@/data/eboard.json';

interface EBoardMember {
  name: string;
  role: string;
  image: string;
}

export function EBoardPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="font-heading text-[var(--step-3)] md:text-[var(--step-2)] tracking-tightish text-text mb-3 font-medium">
          Executive Board
        </h1>
        <p className="font-body text-[var(--step-0)] leading-relaxed text-muted">
          Meet the passionate leaders driving our AI community forward
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eboardData.map((member: EBoardMember, index) => (
          <div 
            key={index}
            className="bg-bg/50 border border-border rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:border-primary/30"
          >
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/30 flex items-center justify-center overflow-hidden">
              {/* Image or initials fallback */}
              <img 
                src={member.image} 
                alt={`${member.name}, ${member.role}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to initials if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector('.initials-fallback')) {
                    const initialsSpan = document.createElement('span');
                    initialsSpan.className = 'initials-fallback text-2xl font-heading font-bold text-primary';
                    initialsSpan.textContent = member.name.split(' ').map(n => n[0]).join('');
                    parent.appendChild(initialsSpan);
                  }
                }}
              />
            </div>
            
            <h3 className="font-heading text-[var(--step-1)] tracking-tightish font-medium text-text mb-1">
              {member.name}
            </h3>
            
            <p className="font-body text-[var(--step--1)] font-medium text-primary">
              {member.role}
            </p>
          </div>
        ))}
      </div>

      <div className="text-center pt-6 border-t border-border">
        <p className="text-[var(--step--1)] text-muted mb-2 font-body">
          Want to get more involved?
        </p>
        <p className="text-[var(--step--1)] text-text font-body leading-relaxed">
          We're always looking for passionate members to join our leadership team. 
          Reach out on Discord to learn about opportunities!
        </p>
      </div>
    </div>
  );
}