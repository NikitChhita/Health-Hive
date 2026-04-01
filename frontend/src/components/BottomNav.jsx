import React from 'react';
import { Home, Activity, Heart, User, Settings } from 'lucide-react';

export const BottomNav = ({ onSignInClick, onHomeClick, onSymptomCheckerClick }) => {
  return (
    <nav aria-label="Mobile navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pointer-events-none">
      <div className="max-w-md mx-auto glass-panel rounded-full px-6 py-4 ambient-shadow flex items-center justify-between pointer-events-auto">
        <button
          aria-label="Home"
          onClick={onHomeClick}
          className="p-2 text-primary hover:bg-surface-container rounded-full transition-colors"
        >
          <Home className="w-6 h-6" aria-hidden="true" />
        </button>
        <button
          aria-label="Symptom checker"
          onClick={onSymptomCheckerClick}
          className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors"
        >
          <Activity className="w-6 h-6" aria-hidden="true" />
        </button>
        <button aria-label="Health" className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
          <Heart className="w-6 h-6" aria-hidden="true" />
        </button>
        <button
          aria-label="Sign in"
          onClick={onSignInClick}
          className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors"
        >
          <User className="w-6 h-6" aria-hidden="true" />
        </button>
        <button aria-label="Settings" className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
          <Settings className="w-6 h-6" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
};
