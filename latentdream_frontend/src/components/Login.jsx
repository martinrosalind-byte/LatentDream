/**
 * @file Login.jsx
 * @description Client-side authentication component for the LatentDream application.
 * 
 * Academic & Architectural Alignment:
 * This module directly satisfies Functional Requirement FR-001 (User Management) by 
 * providing secure account creation and session validation[cite: 2]. It also addresses 
 * FR-002 by establishing the boundary that blocks unauthorized access to private journals[cite: 2].
 * 
 * Technical Implementation:
 * - Executes asynchronous Firebase Authentication state management to securely 
 *   isolate user data, satisfying NFR-002 (Security)[cite: 2].
 * - Employs a glassmorphic user interface utilizing Tailwind CSS to align with the 
 *   overarching NFR-003 usability and aesthetic targets.
 * - Integrates robust exception handling to gracefully manage network rejections.
 */

import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const Login = ({ onLoginSuccess }) => {
  // Encapsulates transactional state hooks for interface tracking
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Dispatches client input signatures to remote cloud authentication nodes.
   * Leverages catch blocks to safely intercept runtime transaction rejections.
   * 
   * @param {React.FormEvent} e - Form submission event interface.
   */
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        // Dispatches network payload to establish a novel user identity record (FR-001)
        await createUserWithEmailAndPassword(auth, email, password);
        if (onLoginSuccess) onLoginSuccess();
      } else {
        // Dispatches identity signatures to validate an active session domain (FR-001)
        await signInWithEmailAndPassword(auth, email, password);
        if (onLoginSuccess) onLoginSuccess();
      }
    } catch (err) {
      // Isolates state anomalies and exposes standardized, user-friendly exception text
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-md">
          {isSignUp ? "Create Account" : "LatentDream Login"}
        </h2>
        <p className="mt-2 text-sm text-purple-200/80">
          {isSignUp 
            ? "Sign up to start your private dream journal." 
            : "Log in to access your past dreams and analysis."}
        </p>
      </div>
      
      <form className="mt-6 space-y-5" onSubmit={handleAuthSubmit}>
        {/* Dynamic Exception UI Layout */}
        {error && (
          <div className="rounded-lg bg-red-900/40 p-3 text-sm text-red-200 border border-red-500/30 backdrop-blur-sm shadow-inner">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-1 drop-shadow-sm">
              Email Address
            </label>
            {/* Translucent Dark Glass Input Fields */}
            <input
              type="email"
              required
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-purple-300/30 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50 focus:bg-black/60 focus:outline-none transition-all duration-300 shadow-inner"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-1 drop-shadow-sm">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-purple-300/30 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50 focus:bg-black/60 focus:outline-none transition-all duration-300 shadow-inner"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Luminous Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center rounded-xl bg-purple-600/80 px-4 py-3 text-sm font-medium text-white hover:bg-purple-500 disabled:bg-white/5 disabled:text-purple-300/40 border border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all duration-300"
          >
            {loading ? "Processing..." : isSignUp ? "Sign Up" : "Log In"}
          </button>
        </div>

        {/* State Toggle Link */}
        <div className="text-center mt-4">
          <button
            type="button"
            className="text-xs font-medium text-purple-300 hover:text-purple-100 transition-colors bg-transparent border-none cursor-pointer"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
          >
            {isSignUp ? "Already have an account? Log In" : "New to LatentDream? Create an Account"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;