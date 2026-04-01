import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';
import { Settings as SettingsIcon, User, Lock, Bell, Shield, LogOut } from 'lucide-react';

export const Settings = ({ onSignOut, user }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({ email: true, analysis: true, updates: false });

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar onSignOut={onSignOut} onNewIntakeClick={() => navigate('/symptom-checker')} activePage="settings" />

      <main className="flex-1 flex flex-col min-w-0">
        <DashboardHeader user={user} onSignOut={onSignOut} />

        <div className="p-6 md:p-8 max-w-3xl mx-auto w-full">
          <header className="mb-10">
            <h1 className="text-3xl font-headline font-extrabold text-on-surface flex items-center gap-3">
              <SettingsIcon className="text-primary w-7 h-7" aria-hidden="true" />
              Settings
            </h1>
            <p className="text-on-surface-variant mt-1">Manage your account and preferences.</p>
          </header>

          <div className="space-y-6">

            {/* Profile */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[1.5rem] ambient-shadow border border-surface-container overflow-hidden"
            >
              <div className="flex items-center gap-3 px-6 py-4 border-b border-surface-container">
                <User className="w-4 h-4 text-primary" aria-hidden="true" />
                <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider">Profile</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border-2 border-surface-container flex items-center justify-center">
                    <User className="w-7 h-7 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">{user?.name || 'Guest'}</p>
                    <p className="text-sm text-on-surface-variant">{user?.email || '—'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="settings-name" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Full Name</label>
                    <input
                      id="settings-name"
                      type="text"
                      defaultValue={user?.name || ''}
                      placeholder="Your name"
                      className="w-full px-4 py-3 bg-surface-container rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="settings-email" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Email</label>
                    <input
                      id="settings-email"
                      type="email"
                      defaultValue={user?.email || ''}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 bg-surface-container rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>
                <button className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-container transition-all">
                  Save Changes
                </button>
              </div>
            </motion.section>

            {/* Password */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="bg-white rounded-[1.5rem] ambient-shadow border border-surface-container overflow-hidden"
            >
              <div className="flex items-center gap-3 px-6 py-4 border-b border-surface-container">
                <Lock className="w-4 h-4 text-primary" aria-hidden="true" />
                <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider">Password</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <label htmlFor="settings-current-pw" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Current Password</label>
                  <input id="settings-current-pw" type="password" placeholder="••••••••" autoComplete="current-password" className="w-full px-4 py-3 bg-surface-container rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="settings-new-pw" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">New Password</label>
                    <input id="settings-new-pw" type="password" placeholder="••••••••" autoComplete="new-password" className="w-full px-4 py-3 bg-surface-container rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="settings-confirm-pw" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Confirm Password</label>
                    <input id="settings-confirm-pw" type="password" placeholder="••••••••" autoComplete="new-password" className="w-full px-4 py-3 bg-surface-container rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                  </div>
                </div>
                <button className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-container transition-all">
                  Update Password
                </button>
              </div>
            </motion.section>

            {/* Notifications */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="bg-white rounded-[1.5rem] ambient-shadow border border-surface-container overflow-hidden"
            >
              <div className="flex items-center gap-3 px-6 py-4 border-b border-surface-container">
                <Bell className="w-4 h-4 text-primary" aria-hidden="true" />
                <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider">Notifications</h2>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { key: 'email', label: 'Email notifications', description: 'Receive updates and alerts via email' },
                  { key: 'analysis', label: 'Analysis complete', description: 'Notify when an AI analysis is ready' },
                  { key: 'updates', label: 'Product updates', description: 'Hear about new features and improvements' },
                ].map(({ key, label, description }) => (
                  <div key={key} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-on-surface">{label}</p>
                      <p className="text-xs text-on-surface-variant">{description}</p>
                    </div>
                    <button
                      role="switch"
                      aria-checked={notifications[key]}
                      aria-label={label}
                      onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key] }))}
                      className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${notifications[key] ? 'bg-primary' : 'bg-surface-container-high'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${notifications[key] ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Privacy */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="bg-white rounded-[1.5rem] ambient-shadow border border-surface-container overflow-hidden"
            >
              <div className="flex items-center gap-3 px-6 py-4 border-b border-surface-container">
                <Shield className="w-4 h-4 text-primary" aria-hidden="true" />
                <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider">Privacy & Data</h2>
              </div>
              <div className="p-6 space-y-3">
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Your symptom data is stored securely with role-based access control. Only you and authorised providers can view your submissions.
                </p>
                <button className="text-sm font-bold text-error hover:underline">
                  Delete All My Data
                </button>
              </div>
            </motion.section>

            {/* Sign out */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 }}
            >
              <button
                onClick={onSignOut}
                className="w-full flex items-center justify-center gap-2 py-4 text-error border border-error/20 bg-error/5 hover:bg-error/10 rounded-2xl font-bold text-sm transition-all"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                Sign Out
              </button>
            </motion.div>

          </div>
        </div>
      </main>
    </div>
  );
};
