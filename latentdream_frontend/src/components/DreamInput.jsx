import React, { useState } from 'react';

/**
 * @file DreamInput.jsx
 * @description Core frontend interface component enabling users to log their initial manifest dream narratives.
 * This component directly satisfies Functional Requirement FR-003 (Dream Logging Interface) as specified
 * within the LatentDream Software Requirements Specification (SRS) documentation.
 * 
 * Theoretical Context:
 * In classical Freudian psychoanalysis (Freud, 1899), the "manifest content" represents the literal imagery 
 * and conscious narrative of a dream before clinical decomposition reveals the hidden, subconscious "latent content".
 * This component acts as the baseline empirical data-capture layer for that process.
 * 
 * Architecture & Design Patterns:
 * - Implements the Controlled Component Pattern to govern form state mutations via local React state variables.
 * - Enforces client-side validation thresholds to prevent null or white-space payloads from entering the network layer.
 * - Utilizes an inverse data-flow architecture (state lifting) to communicate the finalized text payload to the parent orchestrator.
 */
export default function DreamInput({ onSubmit }) {
  // Local state tracking the raw string data entered into the text area element
  const [dreamText, setDreamText] = useState('');
  
  // State handling client-side error boundaries before remote API dispatch
  const [error, setError] = useState('');

  /**
   * @function handleSubmit
   * @description interceptor function handling standard HTML form submission. Validates text structural 
   * integrity and lifts state payload up to trigger the backend FastAPI / LangChain loop.
   * @param {React.FormEvent} event - Synthetic form submission event architecture.
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Guard Clause: Prevent processing empty text or white-space anomalies
    if (!dreamText.trim()) {
      setError('Please provide a description of your dream before initiating analysis.');
      return;
    }

    // Clear error flags upon validation pass
    setError('');
    
    // Lifiting state upward to parent page component to initiate the integration loop (FR-004)
    onSubmit(dreamText);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100">
      {/* Component Header: Provides clear contextual instructions to optimize User Experience (NFR-003) */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
          Record Your Manifest Dream Content
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          According to classical psychoanalytic theory, the literal story of your dream holds hidden 
          clues to your subconscious conflicts. Describe your dream elements exactly as you recall them.
        </p>
      </div>

      {/* Controlled Form Architecture */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="dream-narrative" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Dream Narrative Text Log
          </label>
          <textarea
            id="dream-narrative"
            rows="6"
            className="w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all duration-200 resize-none"
            placeholder="Describe your dream setting, events, and prominent emotional feelings..."
            value={dreamText}
            onChange={(e) => setDreamText(e.target.value)}
          />
        </div>

        {/* Dynamic Exception UI Layout */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200 transition-fade">
            {error}
          </div>
        )}

        {/* Dispatch Action Button element to progress into the LangChain conversational state */}
        <button
          type="submit"
          className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Begin Freudian Analysis
        </button>
      </form>
    </div>
  );
}