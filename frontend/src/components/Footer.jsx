import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer = ({ onHomeClick }) => {
  return (
    <footer className="bg-surface-container-low py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
          <button
            onClick={onHomeClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ShieldCheck className="text-white w-5 h-5" />
            </div>
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