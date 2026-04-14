import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';
import { Settings as SettingsIcon, User, Lock, Bell, Shield, LogOut } from 'lucide-react';
import { clearStoredAuth, getStoredToken, updateStoredUser } from '../../utils/authStorage';

export const Settings = ({ onSignOut, user }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({ email: true, analysis: true, updates: false });
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileMsg, setProfileMsg] = useState(null);
  const [passwordMsg, setPasswordMsg] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  const token = getStoredToken();

  const handleSaveChanges = async () => {
    setProfileMsg(null);
    try {
      const res = await fetch(`${BASE_URL}/api/users/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: profileName, email: profileEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      updateStoredUser(data.user);
      setProfileMsg({ type: 'success', text: 'Profile updated.' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message });
    }
  };

  const handleUpdatePassword = async () => {
    setPasswordMsg(null);
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/api/users/me/password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordMsg({ type: 'success', text: 'Password updated.' });
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.message });
    }
  };

  const handleDeleteData = async () => {
    if (!window.confirm('Are you sure? This will permanently delete your account and all data.')) return;
    try {
      const res = await fetch(`${BASE_URL}/api/users/me`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Delete failed');
      }
      clearStoredAuth();
      onSignOut();
    } catch (err) {
      alert(err.message);
    }
  };

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
                      value={profileName}
                      onChange={e => setProfileName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-4 py-3 bg-surface-container rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="settings-email" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Email</label>
                    <input
                      id="settings-email"
                      type="email"
                      value={profileEmail}
                      onChange={e => setProfileEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 bg-surface-container rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>
                {profileMsg && (
                  <p className={`text-sm font-medium ${profileMsg.type === 'success' ? 'text-primary' : 'text-error'}`}>{profileMsg.text}</p>
                )}
                <button onClick={handleSaveChanges} className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-container transition-all">
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
                  <input id="settings-current-pw" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" className="w-full px-4 py-3 bg-surface-container rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="settings-new-pw" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">New Password</label>
                    <input id="settings-new-pw" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password" className="w-full px-4 py-3 bg-surface-container rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="settings-confirm-pw" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Confirm Password</label>
                    <input id="settings-confirm-pw" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password" className="w-full px-4 py-3 bg-surface-container rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                  </div>
                </div>
                {passwordMsg && (
                  <p className={`text-sm font-medium ${passwordMsg.type === 'success' ? 'text-primary' : 'text-error'}`}>{passwordMsg.text}</p>
                )}
                <button onClick={handleUpdatePassword} className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-container transition-all">
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
                <button onClick={handleDeleteData} className="text-sm font-bold text-error hover:underline">
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
