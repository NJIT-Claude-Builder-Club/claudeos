'use client';

import React, { useState, useRef } from 'react';
import { useWindowStore, type WindowId } from '@/lib/window-store';
import { cn } from '@/lib/utils';

interface FolderIconProps {
  id: WindowId;
  label: string;
  position: { x: number; y: number };
  onMove: (id: WindowId, position: { x: number; y: number }) => void;
}

export function FolderIcon({ id, label, position, onMove }: FolderIconProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const { open } = useWindowStore();
  const iconRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.detail === 2) {
      // Double click - open window
      open(id);
      return;
    }

    // Single click - start drag
    setIsDragging(true);
    const rect = iconRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newPosition = {
      x: Math.max(0, Math.min(window.innerWidth - 80, e.clientX - dragOffset.x)),
      y: Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragOffset.y)),
    };
    
    onMove(id, newPosition);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  return (
    <div
      ref={iconRef}
      className={cn(
        'absolute flex flex-col items-center p-2 cursor-pointer',
        'hover:bg-surface/50 rounded-lg transition-colors duration-150',
        'select-none group',
        isDragging && 'opacity-80'
      )}
      style={{
        left: position.x,
        top: position.y,
        zIndex: isDragging ? 1000 : 1
      }}
      onMouseDown={handleMouseDown}
      role="button"
      tabIndex={0}
      aria-label={`Open ${label}`}
    >
      <img
        src="/claudeosfolder.png"
        alt="Folder"
        width="48"
        height="48"
        className="mb-1 group-hover:opacity-80 transition-opacity"
        style={{ width: '48px', height: 'auto', flexShrink: 0 }}
      />
      <span className="ui text-xs text-text bg-surface/80 px-2 py-1 rounded backdrop-blur-sm">
        {label}
      </span>
    </div>
  );
}