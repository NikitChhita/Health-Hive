import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Added useNavigate
import { Search, User, ChevronDown, LogOut, Settings } from 'lucide-react'; // 2. Added Settings icon

export const DashboardHeader = ({ user, onSignOut }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate(); // 3. Initialize navigate

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-20 bg-white border-b border-surface-container px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant group-focus-within:text-primary transition-colors" aria-hidden="true" />
          <input
            type="search"
            aria-label="Search symptoms or previous analyses"
            placeholder="Search symptoms or previous analyses..."
            className="w-full pl-12 pr-4 py-3 bg-surface-container rounded-2xl text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
          <span aria-hidden="true" className="absolute top-3 right-3 w-2 h-2 bg-error rounded-full border-2 border-white" />

        <div className="h-10 w-px bg-surface-container mx-2" />

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 p-2 hover:bg-surface-container rounded-2xl transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 border-2 border-surface-container hover:border-primary/20 transition-all flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-bold text-on-surface leading-tight">
                {user?.name || 'Guest'}
              </p>
              <p className="text-xs text-on-surface-variant truncate max-w-[140px]">
                {user?.email || ''}
              </p>
            </div>
            <ChevronDown className={`w-3 h-3 text-on-surface-variant transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-surface-container overflow-hidden z-45">
              {/* 4. Added Settings Button */}
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/settings');
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>

              <div className="h-px bg-surface-container" /> {/* Optional Divider */}

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  onSignOut();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-on-surface-variant hover:text-error hover:bg-error/5 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
