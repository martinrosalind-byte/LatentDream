/**
 * @file Login.jsx
 * @description Implements client-side user authentication management loops.
 * This component orchestrates internal React states to dynamically pivot the user 
 * interface between session validation frameworks (FR-001) and credential registration 
 * pipelines (FR-002), executing non-blocking asynchronous handshakes with the 
 * underlying Firebase Identity Provider architecture.
 */

import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const Login = () => {
  // Encapsulates transactional state hooks for interface tracking
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Dispatches client input signatures to remote cloud authentication nodes.
   * Leverages catch blocks to safely intercept runtime transaction rejections.
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
        alert("Account registered successfully!");
        setIsSignUp(false); 
      } else {
        // Dispatches identity signatures to validate an active session domain (FR-001)
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login successful!");
      }
    } catch (err) {
      // Isolates state anomalies and exposes standardized network exception descriptors
      setError(err.message || "Authentication synchronization anomaly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-slate-800 p-8 shadow-2xl border border-slate-700">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            {isSignUp ? "Create Dreamer Account" : "LatentDream Portal"}
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleAuthSubmit}>
          {error && (
            <div className="rounded-md bg-red-900/50 p-3 text-sm text-red-400 border border-red-800">
              {error}
            </div>
          )}
          
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                className="w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none sm:text-sm"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none sm:text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors"
            >
              {loading ? "Processing..." : isSignUp ? "Register Account" : "Secure Login"}
            </button>
          </div>

          <div className="text-center mt-4">
            <button
              type="button"
              className="text-sm font-medium text-indigo-400 hover:text-indigo-300 bg-transparent border-none cursor-pointer"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
            >
              {isSignUp ? "Already have an account? Sign In" : "New to LatentDream? Create an Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;