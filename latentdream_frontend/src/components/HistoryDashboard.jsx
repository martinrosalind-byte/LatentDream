import React, { useState, useEffect } from 'react';

/**
 * @file HistoryDashboard.jsx
 * @description Chronological ledger timeline visualizing archived dream interpretations.
 * 
 * Academic & Psychoanalytic Alignment:
 * This component directly satisfies Functional Requirement FR-008 (Secure Journal Dashboard) by 
 * providing users with a timeline of their past entries. In classical Freudian 
 * psychoanalysis, isolated dream logs contain limited clinical utility[cite: 1]. Genuine 
 * self-discovery relies on tracking systemic, repetitive compromises over long-term timelines to 
 * expose recurring patterns and persistent hidden desires[cite: 1]. 
 * 
 * Technical Design Architecture:
 * - Executes asynchronous HTTP GET requests to the FastAPI backend on component mount.
 * - Visualizes persistent array payloads returned from the PostgreSQL storage layer, 
 *   supporting the NFR-002 security requirement for encrypted, isolated user data[cite: 2].
 * - Implements dynamic accordion-style drawers via local state toggling to satisfy NFR-003, 
 *   ensuring the interface remains uncluttered and highly usable[cite: 2].
 */
export default function HistoryDashboard({ onBackToInput }) {
  const [expandedEntryId, setExpandedEntryId] = useState(null);
  const [historicalEntries, setHistoricalEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Resolves the backend URL dynamically
  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Lifecycle hook: Fetches real database records when the dashboard loads
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/history`);
        if (!response.ok) {
          throw new Error('Failed to retrieve journal history from the server.');
        }
        const data = await response.json();
        setHistoricalEntries(data);
      } catch (err) {
        console.error("Database sync error:", err);
        setError("Unable to load your dream journal at this time. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [backendUrl]);

  const toggleExpandEntry = (id) => {
    setExpandedEntryId(expandedEntryId === id ? null : id);
  };

  // Helper function to safely render the formatted HTML paragraphs from the database string
  const renderFormattedText = (text) => {
    if (!text) return null;
    return text.split('\n\n').map((paragraph, index) => (
      <p key={index} className="text-sm text-purple-50 mt-2 leading-relaxed">
        {paragraph.replace(/\*\*/g, '')}
      </p>
    ));
  };

  return (
    <div className="w-full max-w-3xl dream-card ethereal-float overflow-hidden shadow-2xl relative">
      
      {/* Ethical Safety Boundary: Non-Clinical Research Disclaimer */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-3 text-center">
        <p className="text-sm text-amber-300 font-medium tracking-wide">
          ✨ For personal reflection only &middot; Not medical advice or mental health treatment
        </p>
      </div>

      <div className="bg-black/30 backdrop-blur-md border-b border-white/10 p-6 text-white flex justify-between items-center z-10 relative">
        <div>
          <h2 className="text-3xl font-bold tracking-tight drop-shadow-md">Your Dream Journal</h2>
          <p className="text-xs text-purple-300/80 mt-2">A look back at your past dreams</p>
        </div>
        <button
          onClick={onBackToInput}
          className="px-5 py-2.5 bg-purple-600/60 hover:bg-purple-500 border border-purple-400/50 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.6)]"
        >
          &larr; New Entry
        </button>
      </div>

      <div className="p-6 space-y-6 min-h-[300px]">
        {/* Loading State UI */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
             <div className="w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-purple-300/70 text-sm">Loading your past dreams...</p>
          </div>
        )}

        {/* Error State UI */}
        {error && !isLoading && (
          <div className="bg-red-900/40 border border-red-500/30 p-4 rounded-xl text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        {/* Timeline Visualization */}
        {!isLoading && !error && historicalEntries.length > 0 && (
          <div className="relative border-l border-purple-500/30 pl-6 ml-3 space-y-6">
            {historicalEntries.map((entry) => (
              <div key={entry.id} className="relative group animate-fadeIn">
                
                {/* Glowing Timeline Node */}
                <span className="absolute -left-[30px] top-4 bg-purple-500 w-3.5 h-3.5 rounded-full border border-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.8)] group-hover:bg-purple-300 transition-all duration-300"></span>
                
                <div className="bg-black/20 border border-white/10 rounded-2xl p-5 shadow-lg hover:bg-black/40 backdrop-blur-sm transition-all duration-300">
                  <div className="flex justify-between items-start cursor-pointer" onClick={() => toggleExpandEntry(entry.id)}>
                    <div className="pr-4">
                      <span className="text-xs font-bold text-purple-300 tracking-wider font-mono drop-shadow-sm">
                        {new Date(entry.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      <h3 className="text-md font-medium text-white mt-1.5 line-clamp-1 italic leading-relaxed">
                        "{entry.dream_text.substring(0, 80)}..."
                      </h3>
                    </div>
                  </div>

                  {expandedEntryId === entry.id && (
                    <div className="mt-5 pt-5 border-t border-white/10 space-y-4">
                      <div>
                        <h4 className="text-xs font-bold text-purple-300/70 uppercase tracking-wider drop-shadow-sm">
                          Your Original Dream
                        </h4>
                        <p className="text-sm text-gray-200 mt-1.5 italic leading-relaxed">
                          {entry.dream_text}
                        </p>
                      </div>

                      <div className="p-4 bg-purple-900/20 rounded-xl border border-purple-400/20 shadow-inner">
                        <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider drop-shadow-sm border-b border-purple-500/30 pb-2 mb-3">
                          What Your Dream Means
                        </h4>
                        <div className="prose prose-invert max-w-none">
                          {renderFormattedText(entry.interpretation)}
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-3 text-xs text-purple-300/50 font-mono border-t border-white/5 mt-4">
                        <span>Database ID: #{entry.id}</span>
                      </div>
                    </div>
                  )}

                  <div className="mt-3 text-right">
                    <button
                      onClick={() => toggleExpandEntry(entry.id)}
                      className="text-xs text-purple-400 hover:text-purple-200 font-medium transition-colors cursor-pointer flex items-center justify-end w-full"
                    >
                      {expandedEntryId === entry.id ? "Close Entry" : "Read Full Entry"}
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State UI */}
        {!isLoading && !error && historicalEntries.length === 0 && (
          <div className="p-12 text-center text-purple-300/50 text-sm font-mono">
            You haven't logged any dreams yet. Your timeline will appear here once you complete an analysis.
          </div>
        )}
      </div>
    </div>
  );
}