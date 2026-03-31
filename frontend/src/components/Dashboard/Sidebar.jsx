import React from 'react';
import { LayoutDashboard, History, Settings, LogOut, ShieldCheck, Plus } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', active: true },
  { icon: History, label: 'Analysis History', active: false },
  { icon: Settings, label: 'Settings', active: false },
];

export const Sidebar = ({ onSignOut, onNewIntakeClick }) => {
  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-surface-container h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <ShieldCheck className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-headline font-extrabold text-on-surface tracking-tight">HealthHive</span>
      </div>

      <div className="px-4 mb-6">
        <button 
          onClick={onNewIntakeClick}
          className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-container transition-all"
        >
          <Plus className="w-4 h-4" />
          New Intake
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item, index) => (
          <button
            key={index}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group ${
              item.active 
                ? 'bg-primary text-white shadow-md shadow-primary/20' 
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            <item.icon className={`w-5 h-5 ${item.active ? 'text-white' : 'text-on-surface-variant group-hover:text-primary'}`} />
            <span className="font-bold text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-surface-container">
        <button 
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-2xl transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:text-error" />
          <span className="font-bold text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
};
