import React, { useState } from 'react';

/**
 * @file HistoryDashboard.jsx
 * @description Secure journal dashboard component mapping an empirical historical timeline of user dream submissions.
 * This component satisfies Functional Requirement FR-008 (Secure Journal Dashboard) and complies with usability standards.
 * 
 * Theoretical Context:
 * In classical Freudian interpretation (Freud, 1899), analyzing isolated dream logs provides limited diagnostic value. 
 * True psychoanalytic discovery relies on evaluating structural repetitions across a prolonged longitudinal dataset. 
 * By tracking entries chronologically, the analyst can identify recurring themes, emerging day-residues, 
 * and persistent defense patterns that indicate deeply buried, unresolved unconscious complexes.
 * 
 * Technical & UI Design Considerations:
 * - Implements data extraction rendering patterns to visualize structured historical arrays.
 * - Features local UI state mapping to dynamically expand and examine specific past Freudian report nodes.
 * - Glassmorphic UI Integration: Applies translucent layering and luminous node markers to maintain 
 * the immersive celestial theme without sacrificing data readability (NFR-003).
 */
export default function HistoryDashboard({ onBackToInput }) {
  // Local state tracking which historical entry card is actively expanded for detailed review
  const [expandedEntryId, setExpandedEntryId] = useState(null);

  // Mock array simulating real database rows pulled from the encrypted PostgreSQL logging schema
  const mockHistoricalEntries = [
    {
      id: "dream_001",
      date: "03-Jul-2026",
      manifestSnippet: "I was running down a long corridor trying to find an exit, but the doors were all locked...",
      latentSummary: "Indicates severe waking anxiety or repression regarding an immediate personal or academic milestone constraint.",
      mechanism: "Displacement",
      questionsAnswered: 3
    },
    {
      id: "dream_002",
      date: "28-Jun-2026",
      manifestSnippet: "A giant shadow figure was offering me an old brass key in the middle of an open desert field...",
      latentSummary: "Symbolic compromise-formation representing a hidden urge for autonomy and unlocking unconscious desires.",
      mechanism: "Condensation",
      questionsAnswered: 3
    },
    {
      id: "dream_003",
      date: "15-Jun-2026",
      manifestSnippet: "I was flying over a vast ocean quite effortlessly, looking down at ships moving backward...",
      latentSummary: "Classic regressive wish-fulfillment escape fantasy protecting the conscious ego from deep exhaustion stresses.",
      mechanism: "Wish-Fulfillment",
      questionsAnswered: 3
    }
  ];

  /**
   * @function toggleExpandEntry
   * @description Modifies local state variables to expand or collapse specific journal logs.
   * @param {string} id - The unique record ID of the targeted dream entry.
   */
  const toggleExpandEntry = (id) => {
    setExpandedEntryId(expandedEntryId === id ? null : id);
  };

  return (
    /* 1. DASHBOARD WRAPPER: 
       Utilizes the global .dream-card glassmorphism utility and an ethereal float.
    */
    <div className="w-full max-w-3xl dream-card ethereal-float overflow-hidden shadow-2xl">
      
      {/* Dashboard Top Identity Frame */}
      <div className="bg-black/30 backdrop-blur-md border-b border-white/10 p-6 text-white flex justify-between items-center z-10 relative">
        <div>
          <h2 className="text-3xl font-bold tracking-tight drop-shadow-md">Your Psychoanalytic Journal</h2>
          <p className="text-xs text-purple-300/80 mt-2">Chronological Timeline of Subconscious Logs</p>
        </div>
        <button
          onClick={onBackToInput}
          className="px-5 py-2.5 bg-purple-600/60 hover:bg-purple-500 border border-purple-400/50 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.6)]"
        >
          &larr; New Entry
        </button>
      </div>

      {/* Main Timeline List Container */}
      <div className="p-6 space-y-6">
        {/* Timeline structural line: updated to a soft translucent purple */}
        <div className="relative border-l border-purple-500/30 pl-6 ml-3 space-y-6">
          
          {mockHistoricalEntries.map((entry) => (
            <div key={entry.id} className="relative group">
              
              {/* 2. GLOWING TIMELINE NODES:
                 Replaced static grey/purple dots with glowing neon markers that illuminate further on hover.
              */}
              <span className="absolute -left-[30px] top-4 bg-purple-500 w-3.5 h-3.5 rounded-full border border-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.8)] group-hover:bg-purple-300 group-hover:shadow-[0_0_15px_rgba(216,180,254,1)] transition-all duration-300"></span>
              
              {/* 3. COLLAPSIBLE CARD ELEMENT: 
                 Translucent black plates (bg-black/20) replacing solid white boxes.
              */}
              <div className="bg-black/20 border border-white/10 rounded-2xl p-5 shadow-lg hover:bg-black/40 backdrop-blur-sm transition-all duration-300">
                <div className="flex justify-between items-start cursor-pointer" onClick={() => toggleExpandEntry(entry.id)}>
                  <div className="pr-4">
                    <span className="text-xs font-bold text-purple-300 tracking-wider font-mono drop-shadow-sm">
                      {entry.date}
                    </span>
                    <h3 className="text-md font-medium text-white mt-1.5 line-clamp-1 italic leading-relaxed">
                      "{entry.manifestSnippet}"
                    </h3>
                  </div>
                  {/* Mechanism Badge */}
                  <span className="text-xs bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full border border-purple-400/30 font-mono whitespace-nowrap shadow-inner">
                    {entry.mechanism}
                  </span>
                </div>

                {/* Conditional Expansion Drawer View Block */}
                {expandedEntryId === entry.id && (
                  <div className="mt-5 pt-5 border-t border-white/10 space-y-4 animate-fadeIn">
                    <div>
                      <h4 className="text-xs font-bold text-purple-300/70 uppercase tracking-wider drop-shadow-sm">
                        Full Manifest Segment Snippet
                      </h4>
                      <p className="text-sm text-gray-200 mt-1.5 italic leading-relaxed">
                        {entry.manifestSnippet}
                      </p>
                    </div>

                    {/* Latent Summary Insight Box */}
                    <div className="p-4 bg-purple-900/20 rounded-xl border border-purple-400/20 shadow-inner">
                      <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider drop-shadow-sm">
                        Latent Evaluation Translation Summary
                      </h4>
                      <p className="text-sm text-purple-50 mt-2 leading-relaxed">
                        {entry.latentSummary}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-3 text-xs text-purple-300/50 font-mono border-t border-white/5 mt-4">
                      <span>Database ID: {entry.id}</span>
                      <span>Loop Sessions Completed: {entry.questionsAnswered}/3</span>
                    </div>
                  </div>
                )}

                {/* Expand Toggle Button Prompt Area */}
                <div className="mt-3 text-right">
                  <button
                    onClick={() => toggleExpandEntry(entry.id)}
                    className="text-xs text-purple-400 hover:text-purple-200 font-medium transition-colors cursor-pointer flex items-center justify-end w-full"
                  >
                    {expandedEntryId === entry.id ? "Collapse Record" : "Examine Deep Interpretation"}
                  </button>
                </div>

              </div>
            </div>
          ))}

        </div>
      </div>

      {/* Empty Data Placeholder Safe Boundary Check */}
      {mockHistoricalEntries.length === 0 && (
        <div className="p-12 text-center text-purple-300/50 text-sm font-mono">
          No entries recorded in this psychological ledger yet.
        </div>
      )}
    </div>
  );
}