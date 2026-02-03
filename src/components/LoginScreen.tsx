'use client';

import React, { useState, useEffect } from 'react';

interface LoginScreenProps {
  onLoginComplete: () => void;
}

export function LoginScreen({ onLoginComplete }: LoginScreenProps) {
  const [currentText, setCurrentText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [loginStep, setLoginStep] = useState<'initial' | 'typing' | 'authenticating' | 'complete'>('initial');

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, []);

  const targetPassword = 'ClaudeChat2024';
  const typingSpeed = 120; // ms between characters

  // Cursor blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Start typing animation after initial delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoginStep('typing');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Auto-typing effect
  useEffect(() => {
    if (loginStep !== 'typing') return;

    let index = 0;
    const typeChar = () => {
      if (index < targetPassword.length) {
        setCurrentText(targetPassword.slice(0, index + 1));
        index++;
        setTimeout(typeChar, typingSpeed + Math.random() * 50); // Add slight variation
      } else {
        // Password typed, start authentication
        setTimeout(() => {
          setLoginStep('authenticating');
          setTimeout(() => {
            setLoginStep('complete');
            setTimeout(onLoginComplete, 800);
          }, 1200);
        }, 500);
      }
    };

    typeChar();
  }, [loginStep, onLoginComplete]);

  return (
    <div className="fixed inset-0 bg-bg flex items-center justify-center">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-3"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, var(--primary) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, var(--primary) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          backgroundPosition: '0 0, 25px 25px'
        }}
      />

      {/* Login container */}
      <div className="relative z-10 bg-surface border border-border rounded-lg p-8 w-96 shadow-2xl">
        {/* Chat Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-4xl">💬</span>
          </div>
          <h2 className="text-xl font-semibold text-text mb-1">Claude Chat Simulator</h2>
          <p className="text-sm text-muted">Claude Builder Club @ NJIT</p>
        </div>

        {/* Login form */}
        <div className="space-y-6">
          {/* User field (pre-filled) */}
          <div>
            <label className="block text-sm ui text-muted mb-2">Username</label>
            <div className="bg-bg border border-border rounded px-3 py-2 text-text">
              visitor
            </div>
          </div>

          {/* Password field */}
          <div>
            <label className="block text-sm ui text-muted mb-2">Password</label>
            <div className="bg-bg border border-border rounded px-3 py-2 text-text font-mono relative min-w-0">
              <span className="select-none inline-block min-w-[180px]">
                {'•'.repeat(currentText.length)}
                {loginStep === 'typing' && showCursor && (
                  <span className="animate-pulse">|</span>
                )}
              </span>
            </div>
          </div>

          {/* Status/Login button */}
          <div className="pt-4">
            {loginStep === 'initial' && (
              <div className="h-10 flex items-center justify-center">
                <span className="text-sm text-muted">Initializing...</span>
              </div>
            )}

            {loginStep === 'typing' && (
              <div className="h-10 flex items-center justify-center">
                <span className="text-sm text-muted">Auto-login in progress...</span>
              </div>
            )}

            {loginStep === 'authenticating' && (
              <div className="h-10 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-muted">Authenticating...</span>
                </div>
              </div>
            )}

            {loginStep === 'complete' && (
              <div className="h-10 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="text-sm text-green-400">Login successful</span>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}