'use client';

import { useState, useEffect } from 'react';
import { Desktop } from '@/components/Desktop';
import { LoginScreen } from '@/components/LoginScreen';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDesktop, setShowDesktop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user has already logged in this session
  useEffect(() => {
    const hasLoggedIn = sessionStorage.getItem('claudeos-logged-in');
    if (hasLoggedIn) {
      setIsLoggedIn(true);
      setShowDesktop(true);
    }
    setIsLoading(false);
  }, []);

  // Add keyboard shortcut for logout (Ctrl+Shift+L) for testing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'L') {
        sessionStorage.removeItem('claudeos-logged-in');
        setIsLoggedIn(false);
        setShowDesktop(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLoginComplete = () => {
    sessionStorage.setItem('claudeos-logged-in', 'true');
    setIsLoggedIn(true);

    // Add a small delay for smooth transition
    setTimeout(() => {
      setShowDesktop(true);
    }, 200);
  };

  // Show loading state while checking session
  if (isLoading) {
    return null;
  }

  if (!isLoggedIn) {
    return <LoginScreen onLoginComplete={handleLoginComplete} />;
  }

  return (
    <div className={`transition-opacity duration-500 ${showDesktop ? 'opacity-100' : 'opacity-0'}`}>
      <Desktop />
    </div>
  );
}
