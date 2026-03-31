import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Ethics } from './components/Ethics';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { BottomNav } from './components/BottomNav';
import { SignInModal } from './components/SignInModal';
import { SymptomChecker } from './components/SymptomChecker';
import { Dashboard } from './components/Dashboard/Dashboard';

// Protected route (It will redirect if a user is not logged in)
const ProtectedRoute = ({ user, children }) => {
  if (!user) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const openSignIn = () => setIsSignInOpen(true);
  const closeSignIn = () => setIsSignInOpen(false);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setIsSignInOpen(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const navigate = useNavigate();

  return (
    <Routes>
      {/* Dashboard - protected */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute user={user}>
            <Dashboard onSignOut={handleSignOut} user={user} />
          </ProtectedRoute>
        }
      />

      {/* Symptom Checker - protected */}
      <Route
        path="/symptom-checker"
        element={
          <ProtectedRoute user={user}>
            <SymptomChecker />
          </ProtectedRoute>
        }
      />

      {/* Home - public */}
      <Route
        path="/"
        element={
          // If already logged in, redirect to dashboard
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <div className="min-h-screen bg-surface">
             <Navbar onSignInClick={openSignIn} onHomeClick={() => navigate('/')} />
              
              <main>
                <Hero onStartClick={openSignIn} />
                <Features />
                <Ethics />
                <CTA onStartClick={openSignIn} />
              </main>
              <Footer onHomeClick={() => navigate('/')} />
              <BottomNav
                onSignInClick={openSignIn}
                onSymptomCheckerClick={openSignIn}
              />
              <SignInModal
                isOpen={isSignInOpen}
                onClose={closeSignIn}
                onAuthSuccess={handleAuthSuccess}
              />
            </div>
          )
        }
      />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}