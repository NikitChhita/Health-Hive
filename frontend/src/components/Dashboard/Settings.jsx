import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';
import { Settings as SettingsIcon, User, Lock, Bell, Shield, LogOut } from 'lucide-react';
import { clearStoredAuth, getStoredToken, updateStoredUser } from '../../utils/authStorage';
import { API_BASE_URL } from '../../utils/api';

const defaultNotifications = { email: true, analysis: true, updates: false };

export const Settings = ({ onSignOut, user, onUpdateUser }) => {
  const navigate = useNavigate();
  const [loadingAction, setLoadingAction] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [notifications, setNotifications] = useState(user?.notifications || defaultNotifications);

  useEffect(() => {
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
    });
    setNotifications(user?.notifications || defaultNotifications);
  }, [user]);

  const syncUser = (nextUser) => {
    if (onUpdateUser) {
      onUpdateUser(nextUser);
      return;
    }

    updateStoredUser(nextUser);
  };

  const handleProfileChange = (event) => {
    const { id, value } = event.target;
    const field = id.replace('settings-', '');
    setProfileData((current) => ({ ...current, [field]: value }));
  };

  const handlePasswordChange = (event) => {
    const { id, value } = event.target;
    const fieldMap = {
      'settings-current-pw': 'currentPassword',
      'settings-new-pw': 'newPassword',
      'settings-confirm-pw': 'confirmPassword',
    };

    setPasswordData((current) => ({ ...current, [fieldMap[id]]: value }));
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setLoadingAction('profile');
    setFeedback(null);

    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getStoredToken()}`,
        },
        body: JSON.stringify(profileData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      syncUser(data.user);
      setFeedback({ type: 'success', text: data.message || 'Profile updated successfully.' });
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setLoadingAction(null);
    }
  };

  const updatePassword = async (event) => {
    event.preventDefault();
    setLoadingAction('password');
    setFeedback(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setFeedback({ type: 'error', text: 'New passwords do not match.' });
      setLoadingAction(null);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/me/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getStoredToken()}`,
        },
        body: JSON.stringify(passwordData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update password');
      }

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setFeedback({ type: 'success', text: data.message || 'Password updated successfully.' });
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to update password.' });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleNotificationChange = async (key) => {
    const previous = notifications;
    const nextNotifications = { ...notifications, [key]: !notifications[key] };

    setNotifications(nextNotifications);
    setLoadingAction('notifications');
    setFeedback(null);

    try {
      const response = await fetch(`${API_BASE_URL}/users/me/notifications`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getStoredToken()}`,
        },
        body: JSON.stringify(nextNotifications),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update notification preferences');
      }

      if (data.user) {
        syncUser(data.user);
      } else {
        syncUser({ ...user, notifications: data.notifications || nextNotifications });
      }

      setFeedback({ type: 'success', text: data.message || 'Notification preferences updated.' });
    } catch (err) {
      setNotifications(previous);
      setFeedback({ type: 'error', text: err.message || 'Failed to update notification preferences.' });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteData = async () => {
    if (!window.confirm('Are you sure you want to delete your account and all data? This action cannot be undone.')) {
      return;
    }

    setLoadingAction('delete');
    setFeedback(null);

    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${getStoredToken()}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete account');
      }

      clearStoredAuth();
      onSignOut();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to delete account.' });
      setLoadingAction(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar onSignOut={onSignOut} onNewIntakeClick={() => navigate('/symptom-checker')} activePage="settings" />

      <main className="flex-1 min-w-0 flex flex-col">
        <DashboardHeader user={user} onSignOut={onSignOut} />

        <div className="mx-auto w-full max-w-3xl p-6 md:p-8">
          <header className="mb-10">
            <h1 className="flex items-center gap-3 text-3xl font-headline font-extrabold text-on-surface">
              <SettingsIcon className="w-7 h-7 text-primary" aria-hidden="true" />
              Settings
            </h1>
            <p className="mt-1 text-on-surface-variant">Manage your account and preferences.</p>
          </header>

          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 rounded-xl border p-4 text-sm ${
                feedback.type === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border-red-200 bg-red-50 text-red-800'
              }`}
            >
              {feedback.text}
            </motion.div>
          )}

          <div className="space-y-6">
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-[1.5rem] border border-surface-container bg-white ambient-shadow"
            >
              <div className="flex items-center gap-3 border-b border-surface-container px-6 py-4">
                <User className="w-4 h-4 text-primary" aria-hidden="true" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-on-surface">Profile</h2>
              </div>
              <form onSubmit={saveProfile} className="space-y-4 p-6">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-surface-container bg-primary/10">
                    <User className="w-7 h-7 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">{profileData.name || 'Guest'}</p>
                    <p className="text-sm text-on-surface-variant">{profileData.email || '—'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label htmlFor="settings-name" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      Full Name
                    </label>
                    <input
                      id="settings-name"
                      type="text"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      placeholder="Your name"
                      className="w-full rounded-xl bg-surface-container px-4 py-3 text-sm text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="settings-email" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      Email
                    </label>
                    <input
                      id="settings-email"
                      type="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      placeholder="your@email.com"
                      className="w-full rounded-xl bg-surface-container px-4 py-3 text-sm text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loadingAction === 'profile'}
                  className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-primary-container disabled:opacity-60"
                >
                  {loadingAction === 'profile' ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="overflow-hidden rounded-[1.5rem] border border-surface-container bg-white ambient-shadow"
            >
              <div className="flex items-center gap-3 border-b border-surface-container px-6 py-4">
                <Lock className="w-4 h-4 text-primary" aria-hidden="true" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-on-surface">Password</h2>
              </div>
              <form onSubmit={updatePassword} className="space-y-4 p-6">
                <div className="space-y-1">
                  <label htmlFor="settings-current-pw" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Current Password
                  </label>
                  <input
                    id="settings-current-pw"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full rounded-xl bg-surface-container px-4 py-3 text-sm text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label htmlFor="settings-new-pw" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      New Password
                    </label>
                    <input
                      id="settings-new-pw"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="w-full rounded-xl bg-surface-container px-4 py-3 text-sm text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="settings-confirm-pw" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      Confirm Password
                    </label>
                    <input
                      id="settings-confirm-pw"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="w-full rounded-xl bg-surface-container px-4 py-3 text-sm text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loadingAction === 'password'}
                  className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-primary-container disabled:opacity-60"
                >
                  {loadingAction === 'password' ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="overflow-hidden rounded-[1.5rem] border border-surface-container bg-white ambient-shadow"
            >
              <div className="flex items-center gap-3 border-b border-surface-container px-6 py-4">
                <Bell className="w-4 h-4 text-primary" aria-hidden="true" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-on-surface">Notifications</h2>
              </div>
              <div className="space-y-4 p-6">
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
                      disabled={loadingAction === 'notifications'}
                      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 disabled:opacity-60 ${notifications[key] ? 'bg-primary' : 'bg-surface-container-high'}`}
                    >
                      <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${notifications[key] ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="overflow-hidden rounded-[1.5rem] border border-surface-container bg-white ambient-shadow"
            >
              <div className="flex items-center gap-3 border-b border-surface-container px-6 py-4">
                <Shield className="w-4 h-4 text-primary" aria-hidden="true" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-on-surface">Privacy & Data</h2>
              </div>
              <div className="space-y-3 p-6">
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  Your symptom data is stored securely with role-based access control. Only you and authorised providers can view your submissions.
                </p>
                <button
                  type="button"
                  onClick={handleDeleteData}
                  disabled={loadingAction === 'delete'}
                  className="text-sm font-bold text-error transition-opacity hover:underline disabled:opacity-60"
                >
                  {loadingAction === 'delete' ? 'Processing...' : 'Delete All My Data'}
                </button>
              </div>
            </motion.section>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 }}
            >
              <button
                onClick={onSignOut}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-error/20 bg-error/5 py-4 text-sm font-bold text-error transition-all hover:bg-error/10"
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
