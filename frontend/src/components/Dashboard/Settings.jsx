import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';
import { Settings as SettingsIcon, User, Lock, Bell, Shield, LogOut } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const Settings = ({ onSignOut, user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // Profile state
  const [profileData, setProfileData] = useState({ name: user?.name || '', email: user?.email || '' });
  
  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Notifications state
  const [notifications, setNotifications] = useState(
    user?.notifications || { email: true, analysis: true, updates: false }
  );
  
  useEffect(() => {
    if (user?.notifications) {
      setNotifications(user.notifications);
    }
  }, [user]);

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const handleProfileChange = (e) => {
    const { id, value } = e.target;
    const fieldName = id.replace('settings-', '');
    setProfileData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handlePasswordChange = (e) => {
    const { id, value } = e.target;
    const fieldMap = {
      'settings-current-pw': 'currentPassword',
      'settings-new-pw': 'newPassword',
      'settings-confirm-pw': 'confirmPassword'
    };
    setPasswordData(prev => ({ ...prev, [fieldMap[id]]: value }));
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to update profile');
        return;
      }

      setMessage('Profile updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Error updating profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(passwordData)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to update password');
        return;
      }

      setMessage('Password updated successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Error updating password: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = async (key) => {
    const newNotifications = { ...notifications, [key]: !notifications[key] };
    setNotifications(newNotifications);

    try {
      const response = await fetch(`${API_BASE_URL}/users/notifications`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(newNotifications)
      });

      if (!response.ok) {
        setNotifications({ ...notifications });
        setError('Failed to update notification preferences');
      }
    } catch (err) {
      setNotifications({ ...notifications });
      setError('Error updating notifications: ' + err.message);
    }
  };

  const handleDeleteData = async () => {
    if (!window.confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to delete data');
        return;
      }

      setMessage('Account and all data deleted successfully. You will be signed out.');
      setTimeout(() => {
        onSignOut();
      }, 2000);
    } catch (err) {
      setError('Error deleting data: ' + err.message);
    } finally {
      setLoading(false);
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

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200"
            >
              {message}
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 text-red-800 rounded-xl border border-red-200"
            >
              {error}
            </motion.div>
          )}

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
              <form onSubmit={saveProfile} className="p-6 space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border-2 border-surface-container flex items-center justify-center">
                    <User className="w-7 h-7 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">{profileData.name || 'Guest'}</p>
                    <p className="text-sm text-on-surface-variant">{profileData.email || '—'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="settings-name" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Full Name</label>
                    <input
                      id="settings-name"
                      type="text"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      placeholder="Your name"
                      className="w-full px-4 py-3 bg-surface-container rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="settings-email" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Email</label>
                    <input
                      id="settings-email"
                      type="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 bg-surface-container rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-container disabled:opacity-60 transition-all"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
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
              <form onSubmit={updatePassword} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label htmlFor="settings-current-pw" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Current Password</label>
                  <input
                    id="settings-current-pw"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full px-4 py-3 bg-surface-container rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="settings-new-pw" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">New Password</label>
                    <input
                      id="settings-new-pw"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="w-full px-4 py-3 bg-surface-container rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="settings-confirm-pw" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Confirm Password</label>
                    <input
                      id="settings-confirm-pw"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="w-full px-4 py-3 bg-surface-container rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-container disabled:opacity-60 transition-all"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
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
                      type="button"
                      role="switch"
                      aria-checked={notifications[key]}
                      aria-label={label}
                      onClick={() => handleNotificationChange(key)}
                      disabled={loading}
                      className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 disabled:opacity-60 ${notifications[key] ? 'bg-primary' : 'bg-surface-container-high'}`}
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
                <button
                  onClick={handleDeleteData}
                  disabled={loading}
                  type="button"
                  className="text-sm font-bold text-error hover:underline disabled:opacity-60"
                >
                  {loading ? 'Processing...' : 'Delete All My Data'}
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
