/**
 * @file Login.jsx
 * @description Provides the interactive user login portal interface. 
 * This component handles user state input capture and interfaces directly 
 * with the Firebase Authentication SDK core instance to resolve secure 
 * access management criteria (FR-001)[cite: 2].
 */

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const Login = () => {
  // Client-side authentication component state tracks
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Asynchronously dispatches entered credentials to the identity provider context.
   * Enforces form submission validation routines and handles execution errors[cite: 2].
   * 
   * @param {Event} e - Form submission event sequence instance.
   */
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Initiates the network handshake sequence with Firebase Auth API endpoints
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!"); 
    } catch (err) {
      // Parses error codes returned from the authentication system gateway
      setError(err.message || "Failed to authenticate session.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-slate-800 p-8 shadow-2xl border border-slate-700">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            LatentDream Portal
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Secure Classical Freudian Dream Analysis Application[cite: 1]
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLoginSubmit}>
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
                className="w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
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
                className="w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
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
              className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 transition-colors"
            >
              {loading ? "Authenticating Session..." : "Secure Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;