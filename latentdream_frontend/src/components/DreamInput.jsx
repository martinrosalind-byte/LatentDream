import React, { useState } from 'react';

/**
 * @file DreamInput.jsx
 * @description Ingestion interface capturing the user's initial manifest dream description.
 * Direct implementation of Functional Requirement FR-003 (Dream Logging Interface)[cite: 3].
 * 
 * Psychoanalytic Alignment:
 * In Sigmund Freud's classical framework, the "manifest content" is the literal, conscious
 * story recalled by the dreamer. This text entry field captures that raw narrative 
 * without clinical modification, providing the essential baseline data before
 * free association begins.
 * 
 * Design Details:
 * - Implements the Controlled Component Pattern to manage local text state mutations safely.
 * - Restricts blank or empty space submissions, preventing unnecessary API requests.
 * - Glassmorphic UI (NFR-003): Incorporates translucent styling elements with neon 
 *   borders, creating an immersive experience that matches the "dream-like" theme.
 */
export default function DreamInput({ onSubmit }) {
  const [dreamText, setDreamText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Guard clause: Prevent empty submissions at the client-side border
    if (!dreamText.trim()) {
      setError('Please write down your dream details before continuing.');
      return;
    }

    setError('');
    onSubmit(dreamText); // Elevates the state payload to trigger the chat loop (FR-004)
  };

  return (
    <div className="max-w-2xl mx-auto p-8 dream-card ethereal-float w-full relative">
      
      {/* Ethical Safety Boundary: Non-Clinical Research Disclaimer */}
      <div className="mb-6 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl text-center">
        <p className="text-xs text-amber-300 font-medium tracking-wide">
          ✨ For reflection and self-exploration only &middot; Not clinical advice or mental health treatment
        </p>
      </div>

      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">
          Write Down Your Dream
        </h2>
        <p className="text-sm text-purple-200/80 mt-3 leading-relaxed">
          According to classical psychoanalytic theory, the literal story of your dream holds hidden 
          clues to your subconscious thoughts. Describe your dream elements exactly as you remember them.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label 
            htmlFor="dream-narrative" 
            className="block text-sm font-medium text-purple-200 mb-2 drop-shadow-sm"
          >
            Your Dream Diary Entry
          </label>
          
          <textarea
            id="dream-narrative"
            rows="6"
            className="w-full px-4 py-3 text-white bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 focus:bg-black/60 transition-all duration-300 resize-none placeholder-purple-300/30 shadow-inner text-sm leading-relaxed"
            placeholder="What settings, events, and feelings do you remember most from your dream?"
            value={dreamText}
            onChange={(e) => setDreamText(e.target.value)}
          />
        </div>

        {error && (
          <div className="text-sm text-red-200 bg-red-900/40 p-3 rounded-lg border border-red-500/30 backdrop-blur-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-4 px-4 bg-purple-600/80 hover:bg-purple-500 text-white font-medium rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] border border-purple-400/50 transition-all duration-300 focus:outline-none cursor-pointer"
        >
          Explore the Meaning
        </button>
      </form>
    </div>
  );
}