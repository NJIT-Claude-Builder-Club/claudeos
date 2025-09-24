'use client';

import React, { useState, useRef } from 'react';
import { X, Minus } from 'lucide-react';
import { useWindowStore, type WindowId, getWindowZIndex, getWindowPosition } from '@/lib/window-store';
import { cn } from '@/lib/utils';

interface WindowProps {
  id: WindowId;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Window({ id, title, children, className }: WindowProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const { close, minimize, focus, move, order, positions, activeId } = useWindowStore();
  const windowRef = useRef<HTMLDivElement>(null);

  const position = getWindowPosition(id, positions);
  const zIndex = getWindowZIndex(id, order);
  const isActive = activeId === id;

  const handleMouseDown = (e: React.MouseEvent) => {
    focus(id);
    setIsDragging(true);
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    e.preventDefault();
  };

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const newPosition = {
      x: Math.max(0, Math.min(window.innerWidth - 400, e.clientX - dragOffset.x)),
      y: Math.max(0, Math.min(window.innerHeight - 300, e.clientY - dragOffset.y)),
    };
    
    move(id, newPosition);
  }, [isDragging, dragOffset, id, move]);

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={windowRef}
      className={cn(
        'fixed bg-surface border border-border rounded-lg shadow-window',
        'min-w-[400px] min-h-[300px] max-w-2xl max-h-[80vh]',
        'flex flex-col overflow-hidden',
        isDragging && 'opacity-90',
        !isActive && 'opacity-75',
        className
      )}
      style={{
        left: position.x,
        top: position.y,
        zIndex: zIndex,
      }}
      onClick={() => focus(id)}
      role="dialog"
      aria-label={title}
    >
      {/* Window Header - Rebuilt for Perfect Alignment */}
      <div 
        className={cn(
          'flex items-stretch border-b border-border',
          'cursor-move select-none bg-surface/80 backdrop-blur-sm h-12'
        )}
        onMouseDown={handleMouseDown}
      >
        {/* Title Section - Expands to fill available space */}
        <div className="flex-1 flex items-center px-4 min-w-0">
          <span 
            className="font-ui tracking-tightish text-text truncate"
            style={{
              lineHeight: '1',
              fontSize: '14px',
              fontFamily: 'var(--font-styrene)',
              fontWeight: '500',
              margin: '0',
              padding: '0'
            }}
          >
            {title}
          </span>
        </div>
        
        {/* Controls Section - Fixed width, centered content */}
        <div className="flex items-center px-2 gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              minimize(id);
            }}
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-border/50 transition-colors"
            aria-label="Minimize window"
          >
            <Minus size={14} className="text-muted" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              close(id);
            }}
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-red-500/20 hover:text-red-500 transition-colors"
            aria-label="Close window"
          >
            <X size={14} className="text-muted hover:text-red-500" />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-auto p-6 bg-surface">
        {children}
      </div>
    </div>
  );
}