import React from 'react';

export const Footer = ({ onHomeClick }) => {
  return (
    <footer className="bg-surface-container-low py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
          <button
            onClick={onHomeClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <svg viewBox="0 0 1024 1024" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="1024" height="1024" rx="200" fill="#006070"/>
              <path d="M512 210 L720 332 L720 676 L512 798 L304 676 L304 332 Z" stroke="#FFFFFF" strokeWidth="36" fill="none"/>
              <path d="M512 382 L512 626 M398 504 L626 504" stroke="#FFFFFF" strokeWidth="40" strokeLinecap="round"/>
            </svg>
            <span className="font-headline font-bold text-xl tracking-tight text-primary">HealthHive</span>
          </button>

          <div className="flex items-center gap-8">
            <a href="#how-it-works" className="text-sm text-on-surface-variant hover:text-primary transition-colors">How It Works</a>
            <a href="#ethics" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Ethics & Safety</a>
          </div>
        </div>

        <div className="pt-8 border-t border-surface-container-high flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-on-surface-variant">© 2026 HealthHive. A proof-of-concept research platform. Not for medical use.</p>
          <p className="text-xs text-on-surface-variant">Built with the MERN Stack</p>
        </div>
      </div>
    </footer>
  );
};