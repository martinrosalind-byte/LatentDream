import React, { useState } from 'react';

/**
 * @file HistoryDashboard.jsx
 * @description Secure journal dashboard component mapping an empirical historical timeline of user dream submissions.
 * This component satisfies Functional Requirement FR-008 (Secure Journal Dashboard) and complies with usability standards.
 * * Theoretical Context:
 * In classical Freudian interpretation (Freud, 1899), analyzing isolated dream logs provides limited diagnostic value. 
 * True psychoanalytic discovery relies on evaluating structural repetitions across a prolonged longitudinal dataset. 
 * By tracking entries chronologically, the analyst can identify recurring themes, emerging day-residues, 
 * and persistent defense patterns that indicate deeply buried, unresolved unconscious complexes.
 * * Technical Design Considerations:
 * - Implements data extraction rendering patterns to visualize structured historical arrays.
 * - Features local UI state mapping to dynamically expand and examine specific past Freudian report nodes.
 * - Utilizes Tailwind utility frameworks to build an accessible, highly scannable visual layout.
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
    <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      
      {/* Dashboard Top Identity Frame */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-950 p-6 text-white flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your Psychoanalytic Journal</h2>
          <p className="text-xs text-purple-200 mt-1">Chronological Timeline of Subconscious Logs</p>
        </div>
        <button
          onClick={onBackToInput}
          className="px-4 py-2 bg-purple-700 bg-opacity-50 hover:bg-opacity-80 border border-purple-500 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer"
        >
          &larr; New Entry
        </button>
      </div>

      {/* Main Timeline List Container */}
      <div className="p-6 space-y-6">
        <div className="relative border-l-2 border-purple-200 pl-6 ml-3 space-y-6">
          
          {mockHistoricalEntries.map((entry) => (
            <div key={entry.id} className="relative group">
              
              {/* Timeline Indicator Node Bullet */}
              <span className="absolute -left-[31px] top-1.5 bg-purple-600 w-4 h-4 rounded-full border-4 border-white group-hover:bg-indigo-600 transition-colors duration-150"></span>
              
              {/* Collapsible Card Element Wrapper */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-start cursor-pointer" onClick={() => toggleExpandEntry(entry.id)}>
                  <div>
                    <span className="text-xs font-bold text-purple-700 tracking-wider font-mono">
                      {entry.date}
                    </span>
                    <h3 className="text-sm font-medium text-gray-800 mt-1 line-clamp-1 italic">
                      "{entry.manifestSnippet}"
                    </h3>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded border font-mono">
                    {entry.mechanism}
                  </span>
                </div>

                {/* Conditional Expansion Drawer View Block */}
                {expandedEntryId === entry.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-3 animate-fadeIn">
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Full Manifest Segment Snippet
                      </h4>
                      <p className="text-sm text-gray-600 mt-1 italic leading-relaxed">
                        {entry.manifestSnippet}
                      </p>
                    </div>

                    <div className="p-3 bg-purple-50 bg-opacity-40 rounded-lg border border-purple-100">
                      <h4 className="text-xs font-bold text-purple-800 uppercase tracking-wider">
                        Latent Evaluation Translation Summary
                      </h4>
                      <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                        {entry.latentSummary}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-2 text-xs text-gray-400 font-mono">
                      <span>Database ID: {entry.id}</span>
                      <span>Loop Sessions Completed: {entry.questionsAnswered}/3</span>
                    </div>
                  </div>
                )}

                {/* Expand Toggle Button Prompt Area */}
                <div className="mt-2 text-right">
                  <button
                    onClick={() => toggleExpandEntry(entry.id)}
                    className="text-xs text-purple-600 hover:text-purple-800 font-medium underline cursor-pointer"
                  >
                    {expandedEntryId === entry.id ? "Minimize Overview" : "Examine Deep Interpretation Report"}
                  </button>
                </div>

              </div>
            </div>
          ))}

        </div>
      </div>

      {/* Empty Data Placeholder Safe Boundary Check */}
      {mockHistoricalEntries.length === 0 && (
        <div className="p-12 text-center text-gray-400 text-sm">
          No entries recorded in this psychological ledger yet.
        </div>
      )}
    </div>
  );
}