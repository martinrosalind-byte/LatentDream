import React, { useState } from 'react';

/**
 * @file DreamInput.jsx
 * @description Core frontend interface component enabling users to log their initial manifest dream narratives.
 * This component directly satisfies Functional Requirement FR-003 (Dream Logging Interface) as specified
 * within the LatentDream Software Requirements Specification (SRS) documentation.
 * * Theoretical Context:
 * In classical Freudian psychoanalysis (Freud, 1899), the "manifest content" represents the literal imagery 
 * and conscious narrative of a dream before clinical decomposition reveals the hidden, subconscious "latent content".
 * This component acts as the baseline empirical data-capture layer for that process.
 * * Architecture & UI Design Patterns:
 * - Implements the Controlled Component Pattern to govern form state mutations via local React state variables.
 * - Enforces client-side validation thresholds to prevent null or white-space payloads from entering the network layer.
 * - Incorporates a visible, non-clinical advisory boundary to support ethical reflection guardrails.
 * - Utilizes Glassmorphic UI (NFR-003): Implements semi-transparent layers and luminous focus states 
 *   to maintain contextual immersion within the global application state.
 */
export default function DreamInput({ onSubmit }) {
  // Local state tracking the raw string data entered into the text area element
  const [dreamText, setDreamText] = useState('');
  
  // State handling client-side error boundaries before remote API dispatch
  const [error, setError] = useState('');

  /**
   * @function handleSubmit
   * @description Interceptor function handling standard HTML form submission. Validates text structural 
   * integrity and lifts state payload up to trigger the backend FastAPI / LangChain loop.
   * @param {React.FormEvent} event - Synthetic form submission event architecture.
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Guard Clause: Prevent processing empty text or white-space anomalies
    if (!dreamText.trim()) {
      setError('Please type out a description of your dream first so we can explore it.');
      return;
    }

    // Clear error flags upon validation pass
    setError('');
    
    // Lifting state upward to parent page component to initiate the integration loop (FR-004)
    onSubmit(dreamText);
  };

  return (
    /* 1. GLASSMORPHIC WRAPPER: 
        Replaced static bg-white with .dream-card and applied the .ethereal-float animation 
        to maintain the zero-gravity immersion established in App.jsx.
    */
    <div className="max-w-2xl mx-auto p-8 dream-card ethereal-float w-full relative">
      
      {/* Non-Clinical Safety Disclaimer Banner */}
      <div className="mb-6 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl text-center">
        <p className="text-xs text-amber-300 font-medium tracking-wide">
          ✨ For reflection and self-exploration only &middot; Not clinical advice or mental health treatment
        </p>
      </div>

      {/* Component Header: Provides clear contextual instructions to optimize User Experience (NFR-003) */}
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">
          Write Down Your Dream
        </h2>
        <p className="text-sm text-purple-200/80 mt-3 leading-relaxed">
          According to classical psychoanalytic theory, the literal story of your dream holds hidden 
          clues to your subconscious thoughts. Describe your dream elements exactly as you remember them.
        </p>
      </div>

      {/* Controlled Form Architecture */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label 
            htmlFor="dream-narrative" 
            className="block text-sm font-medium text-purple-200 mb-2 drop-shadow-sm"
          >
            Your Dream Diary Entry
          </label>
          
          {/* 2. TRANSLUCENT INPUT SURFACE: 
              The textarea is now semi-transparent black (bg-black/40) with a faint white border. 
              When clicked (focus:), it glows with a soft purple ring. 
          */}
          <textarea
            id="dream-narrative"
            rows="6"
            className="w-full px-4 py-3 text-white bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 focus:bg-black/60 transition-all duration-300 resize-none placeholder-purple-300/30 shadow-inner text-sm leading-relaxed"
            placeholder="What setting, events, and feelings do you remember most from your dream?"
            value={dreamText}
            onChange={(e) => setDreamText(e.target.value)}
          />
        </div>

        {/* Dynamic Exception UI Layout */}
        {error && (
          <div className="text-sm text-red-200 bg-red-900/40 p-3 rounded-lg border border-red-500/30 backdrop-blur-sm transition-fade">
            {error}
          </div>
        )}

        {/* 3. LUMINOUS ACTION BUTTON: 
            Features a dynamic box-shadow that creates an ambient purple glow around the button,
            which intensifies when the user hovers over it.
        */}
        <button
          type="submit"
          className="w-full py-4 px-4 bg-purple-600/80 hover:bg-purple-500 text-white font-medium rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] border border-purple-400/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-purple-400 cursor-pointer"
        >
          Explore the Meaning
        </button>
      </form>
    </div>
  );
}