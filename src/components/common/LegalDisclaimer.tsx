'use client';

import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { LEGAL_DISCLAIMER } from '@/lib/utils';
import { cn } from '@/lib/utils';

export interface LegalDisclaimerProps {
  variant?: 'banner' | 'inline' | 'footer';
  className?: string;
  text?: string;
  children?: React.ReactNode;
}

export default function LegalDisclaimer({ 
  variant = 'banner', 
  className,
  text,
  children
}: LegalDisclaimerProps) {
  const disclaimerText = text || children || LEGAL_DISCLAIMER || "LegalLens is an AI tool and does not provide legal advice. Always consult a qualified attorney.";
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible && variant === 'banner') return null;

  if (variant === 'inline') {
    return (
      <div className={cn("text-xs text-gray-500 italic", className)}>
        {disclaimerText}
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={cn("text-sm text-gray-600", className)}>
        <strong>Disclaimer:</strong> {disclaimerText}
      </div>
    );
  }

  return (
    <div className={cn("bg-amber-100 border-b border-amber-200 text-amber-900 px-4 py-3 sm:px-6 relative", className)} role="alert">
      <div className="container mx-auto pr-8 flex items-start sm:items-center space-x-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
        <p className="text-sm font-medium">
          {disclaimerText}
        </p>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-3 right-4 sm:top-1/2 sm:-translate-y-1/2 text-amber-600 hover:text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-sm p-1"
        aria-label="Dismiss disclaimer"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
