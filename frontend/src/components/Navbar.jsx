import React from 'react';
import { User } from 'lucide-react';

export const Navbar = ({ onSignInClick, onHomeClick }) => {
  return (
    <nav aria-label="Main navigation" className="fixed top-0 left-0 right-0 z-50 px-4 py-3 md:px-8 md:py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-white rounded-full px-6 py-3 ambient-shadow">
        <button
          onClick={onHomeClick}
          className="flex items-center gap-2 hover:opacity-100 transition-opacity"
        >
          <svg viewBox="0 0 1024 1024" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="1024" height="1024" rx="200" fill="#006070"/>
            <path d="M512 210 L720 332 L720 676 L512 798 L304 676 L304 332 Z" stroke="#FFFFFF" strokeWidth="36" fill="none"/>
            <path d="M512 382 L512 626 M398 504 L626 504" stroke="#FFFFFF" strokeWidth="40" strokeLinecap="round"/>
          </svg>
          <span className="font-headline font-bold text-xl tracking-tight text-primary">HealthHive</span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">How It Works</a>
          <a href="#ethics" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Ethics & Safety</a>
          <a href="#about" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">About</a>
        </div>

        <button
          onClick={onSignInClick}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary-container transition-all"
        >
          <User className="w-4 h-4" />
          Sign In
        </button>
      </div>
    </nav>
  );
};