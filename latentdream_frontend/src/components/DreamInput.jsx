import React, { useState } from 'react';

/**
 * @file DreamInput.jsx
 * @description Primary ingestion interface for capturing the user's initial manifest dream description.
 * This component directly fulfills Functional Requirement FR-003, ensuring the system can securely record 
 * user dream logs.
 * 
 * Psychoanalytic Theoretical Alignment:
 * Adhering strictly to classical Freudian methodology, this interface isolates the "manifest content" — the 
 * literal, conscious narrative recalled by the dreamer — prior to the application of free association[cite: 1]. 
 * By bypassing rigid, unscientific dream dictionaries, the raw text becomes the foundational dataset for the 
 * subsequent conversational analysis[cite: 1].
 * 
 * Architectural & UI Design Constraints:
 * - Implements the Controlled Component Pattern to manage local state mutations safely.
 * - Enforces a client-side guard clause to prevent empty submissions and unnecessary API requests.
 * - Satisfies Non-Functional Requirement NFR-003 by applying a glassmorphic user interface (UI) to maintain 
 *   an unobtrusive, highly usable environment[cite: 2].
 */
export default function DreamInput({ onSubmit }) {
  const [dreamText, setDreamText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Guard clause: Prevent empty submissions at the client-side boundary
    if (!dreamText.trim()) {
      setError('Please write down your dream details before continuing.');
      return;
    }

    setError('');
    // Elevates the state payload to trigger the LangChain driven prompt loop (FR-004)
    onSubmit(dreamText); 
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
          
          {/* 
            * UI Refraction Update (NFR-003): 
            * Replaced the opaque bg-black/40 utility with bg-white/5 and backdrop-blur-md. 
            * This enforces the nested glass aesthetic, ensuring the interface remains 
            * visually calm and unobtrusive for the user.
            */}
          <textarea
            id="dream-narrative"
            rows="6"
            className="w-full px-4 py-3 text-white bg-white/5 backdrop-blur-md border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-white/30 focus:bg-white/10 transition-all duration-300 resize-none placeholder-purple-300/30 shadow-inner text-sm leading-relaxed"
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