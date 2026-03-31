import React from 'react';
import { ShieldCheck, User } from 'lucide-react';

export const Navbar = ({ onSignInClick, onHomeClick }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3 md:px-8 md:py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-panel rounded-full px-6 py-3 ambient-shadow">
        <button
          onClick={onHomeClick}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <ShieldCheck className="text-white w-5 h-5" />
          </div>
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