import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, History, Settings, LogOut, Plus } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', page: 'overview', path: '/dashboard' },
  { icon: History, label: 'Analysis History', page: 'history', path: '/history' },
  { icon: Settings, label: 'Settings', page: 'settings', path: '/settings' },
];

export const Sidebar = ({ onSignOut, onNewIntakeClick, activePage = 'overview' }) => {
  const navigate = useNavigate();

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-surface-container h-screen sticky top-0">
      <div className="p-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity"
          aria-label="Go to home"
        >
          <svg viewBox="0 0 1024 1024" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="1024" height="1024" rx="200" fill="#006070"/>
            <path d="M512 210 L720 332 L720 676 L512 798 L304 676 L304 332 Z" stroke="#FFFFFF" strokeWidth="36" fill="none"/>
            <path d="M512 382 L512 626 M398 504 L626 504" stroke="#FFFFFF" strokeWidth="40" strokeLinecap="round"/>
          </svg>
          <span className="text-xl font-headline font-extrabold text-on-surface tracking-tight">HealthHive</span>
        </button>
      </div>

      <div className="px-4 mb-6">
        <button
          onClick={onNewIntakeClick}
          className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-container transition-all"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          New Intake
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2" aria-label="Dashboard navigation">
        {navItems.map((item) => {
          const active = activePage === item.page;
          return (
            <button
              key={item.page}
              onClick={() => navigate(item.path)}
              aria-current={active ? 'page' : undefined}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group ${
                active
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <item.icon className={`w-5 h-5 ${active ? 'text-white' : 'text-on-surface-variant group-hover:text-primary'}`} aria-hidden="true" />
              <span className="font-bold text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-surface-container">
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-2xl transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:text-error" aria-hidden="true" />
          <span className="font-bold text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
};
