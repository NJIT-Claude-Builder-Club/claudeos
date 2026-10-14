'use client';

import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ArrowUp, Plus, X } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string, images?: string[]) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, [input]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if ((input.trim() || images.length > 0) && !disabled) {
      onSend(input.trim(), images);
      setInput('');
      setImages([]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const processFiles = (files: FileList | File[]) => {
    if (disabled) return;
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          setImages((prev) => [...prev, base64]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    processFiles(files);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set dragging to false if we're leaving the drop zone entirely
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div
      className={`chat-composer${isDragging ? ' is-dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {images.length > 0 && (
        <div className="attachment-list">
          {images.map((image, index) => (
            <div key={index} className="attachment-preview">
              <Image src={image} alt={`Attachment ${index + 1}`} width={64} height={64} unoptimized />
              <button type="button" onClick={() => removeImage(index)} aria-label={`Remove attachment ${index + 1}`} className="remove-attachment">
                <X size={12} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="How can I help you today?"
        aria-label="Message Claude"
        disabled={disabled}
        className="composer-textarea"
        rows={2}
      />
      <div className="composer-toolbar">
        <div className="composer-tools">
          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageSelect} disabled={disabled} className="hidden" aria-label="Attach images" />
          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={disabled} className="composer-attach" title="Attach images" aria-label="Attach images">
            <Plus size={22} strokeWidth={1.7} aria-hidden="true" />
          </button>
        </div>
        <div className="composer-send-tools">
          <span className="composer-model" aria-label="Model: Claude Sonnet 4.6">Sonnet 4.6</span>
          <button type="button" onClick={handleSend} disabled={(!input.trim() && images.length === 0) || disabled} className="composer-send" aria-label="Send message" title="Send message">
            <ArrowUp size={22} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
