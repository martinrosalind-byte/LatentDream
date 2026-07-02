import React, { useState } from 'react';

/**
 * @file App.jsx
 * @description Central UI Architectural Orchestrator for the LatentDream web application[cite: 2].
 * Manages foundational user visibility states and context routing mechanisms
 * to satisfy core functional specifications for data ingestion and terminal session safety[cite: 2].
 */
function App() {
  // Application view controller state: 'dashboard' or 'chat'
  const [currentView, setCurrentView] = useState('dashboard');
  
  // Buffered storage string holding the explicit manifest narrative payload (FR-003)[cite: 2]
  const [dreamText, setDreamText] = useState('');

  /**
   * Evaluates and dispatches the manifest text entry submission.
   * Transitions the client interface state from log writing to interrogation mode.
   * @param {Event} e - The semantic form submission event context.
   */
  const handleDreamLogSubmit = (e) => {
    e.preventDefault();
    if (!dreamText.trim()) return;
    
    // Dispatches layout transition to initialize conversation loop (FR-004)[cite: 2]
    setCurrentView('chat');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Core Global Header Framework */}
        <header className="border-b border-slate-800 pb-4 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-indigo-400">LatentDream</h1>
          <p className="text-xs text-slate-500 font-mono mt-1">
            NCI Year 1 Semester 3 Project Framework[cite: 3]
          </p>
        </header>

        {/* VIEW 1: Manifest Data Ingestion Screen Container (FR-003)[cite: 2] */}
        {currentView === 'dashboard' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl space-y-4">
            <div>
              <h2 className="text-base font-semibold text-slate-200">Record Manifest Content</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Input the surface narrative layer of your dream state exactly as it was explicitly recalled[cite: 2].
              </p>
            </div>

            <form onSubmit={handleDreamLogSubmit} className="space-y-4">
              <textarea
                value={dreamText}
                onChange={(e) => setDreamText(e.target.value)}
                placeholder="Type your literal dream description here..."
                className="w-full h-36 bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none transition-colors"
              />
              <button
                type="submit"
                disabled={!dreamText.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-xs font-semibold py-2.5 rounded-lg transition-colors"
              >
                Initialize Freudian Dialogue Core
              </button>
            </form>
          </div>
        )}

        {/* VIEW 2: Interactive Interrogation Terminal Placeholder (FR-005)[cite: 2] */}
        {currentView === 'chat' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl text-center space-y-4">
            <h2 className="text-sm font-bold text-indigo-400 uppercase font-mono tracking-wider">
              Psychoanalytical Dialogue Core Active
            </h2>
            <div className="p-3 bg-slate-950 rounded border border-slate-850 text-xs text-slate-400 italic text-left">
              "{dreamText}"
            </div>
            <button
              onClick={() => { setDreamText(''); setCurrentView('dashboard'); }}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded transition"
            >
              Reset Application State
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;