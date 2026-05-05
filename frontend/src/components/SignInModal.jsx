import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, ArrowRight, User } from 'lucide-react';
import {
  clearRememberedEmail,
  getRememberedEmail,
  persistAuth,
  persistRememberedEmail,
} from '../utils/authStorage';
import { API_BASE_URL } from '../utils/api';

export const SignInModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const rememberedEmail = getRememberedEmail();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: rememberedEmail, password: '' });
  const [rememberMe, setRememberMe] = useState(Boolean(rememberedEmail));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');

  useEffect(() => {
    if (!isOpen || isSignUp) return;

    const savedEmail = getRememberedEmail();

    setRememberMe(Boolean(savedEmail));
    setFormData((current) => ({
      ...current,
      email: current.email || savedEmail,
      password: '',
    }));
  }, [isOpen, isSignUp]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isSignUp ? '/users/signup' : '/users/login';
    const body = isSignUp
      ? formData
      : { email: formData.email, password: formData.password };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      if (!isSignUp) {
        if (rememberMe) {
          persistRememberedEmail(formData.email);
        } else {
          clearRememberedEmail();
        }
      }

      persistAuth({
        token: data.token,
        user: data.user,
        remember: isSignUp ? true : rememberMe,
      });
      onAuthSuccess(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setForgotMessage('');
    try {
      const response = await fetch(`${API_BASE_URL}/users/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await response.json();
      setForgotMessage(data.message);
    } catch (err) {
      setForgotMessage('Something went wrong, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-on-surface/20 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ opacity: 0, scale: 1, y: 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1, y: 20 }}
            className="relative w-full max-w-md bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-y-auto max-h-[90vh] scale-90 sm:scale-100 transition-transform"
          >
            <button
              aria-label="Close dialog"
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>

            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                {isSignUp ? <User className="text-primary w-6 h-6" /> : <Lock className="text-primary w-6 h-6" />}
              </div>
              <h2 id="modal-title" className="text-2xl font-headline font-extrabold text-on-surface">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="text-sm text-on-surface-variant mt-2">
                {isSignUp ? "Join HealthHive and start your wellness journey." : "Enter your credentials to access your account."}
              </p>
            </div>

            <div className="flex bg-surface-container rounded-2xl p-1 mb-6" role="group" aria-label="Authentication mode">
              <button
                onClick={() => { setIsSignUp(false); setError(''); }}
                aria-pressed={!isSignUp}
                className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${!isSignUp ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setIsSignUp(true); setError(''); }}
                aria-pressed={isSignUp}
                className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${isSignUp ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                Sign Up
              </button>
            </div>

            {error && (
              <div role="alert" className="mb-4 px-4 py-3 bg-error/10 text-error text-sm font-medium rounded-2xl">
                {error}
              </div>
            )}
            {showForgotPassword && (
              <div className="mb-4 p-4 bg-surface-container rounded-2xl space-y-3">
                <p className="text-sm font-bold text-on-surface">Reset your password</p>
                {forgotMessage ? (
                  <p className="text-sm text-primary">{forgotMessage}</p>
                ) : (
                  <>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 bg-white rounded-xl text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        disabled={loading}
                        className="flex-1 py-2 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-60"
                      >
                        {loading ? 'Sending...' : 'Send reset link'}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowForgotPassword(false); setForgotMessage(''); }}
                        className="flex-1 py-2 bg-surface-container-high text-on-surface rounded-xl text-sm font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2"
                >
                  <label htmlFor="modal-name" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" aria-hidden="true" />
                    <input
                      id="modal-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      autoComplete="name"
                      className="w-full pl-12 pr-4 py-4 bg-surface-container rounded-2xl text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </motion.div>
              )}

              <div className="space-y-2">
                <label htmlFor="modal-email" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" aria-hidden="true" />
                  <input
                    id="modal-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    required
                    autoComplete="email"
                    className="w-full pl-12 pr-4 py-4 bg-surface-container rounded-2xl text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="modal-password" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" aria-hidden="true" />
                  <input
                    id="modal-password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    minLength="6"
                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                    className="w-full pl-12 pr-4 py-4 bg-surface-container rounded-2xl text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              {!isSignUp && (
                <div className="flex items-center justify-between px-1">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-surface-container-high text-primary focus:ring-primary/20"
                    />
                    <span className="text-xs font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-container transition-all shadow-lg mt-4 group disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : (isSignUp ? "Create Account" : "Sign In")}
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />}
              </button>
            </form>

            <p className="text-center text-xs text-on-surface-variant mt-8">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                className="font-bold text-primary hover:underline"
              >
                {isSignUp ? "Sign In" : "Create account"}
              </button>
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
