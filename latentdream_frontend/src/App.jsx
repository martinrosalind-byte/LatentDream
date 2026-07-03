import React, { useState } from 'react';
import Login from './components/Login';
import DreamInput from './components/DreamInput';
import DreamChat from './components/DreamChat';
import DreamReport from './components/DreamReport';
import HistoryDashboard from './components/HistoryDashboard';
import './index.css';

/**
 * @file App.jsx
 * @description Centralized state orchestrator and root architectural node for the LatentDream React application.
 * This component implements a deterministic Finite State Machine (FSM) to handle secure layout routing 
 * and coordinate data payloads across the dream logging, free-association chat, and diagnostic reporting phases.
 * 
 * Architectural Design Patterns:
 * - Centralized State Hub: Hoists structural domain state variables to the root node to enforce data immutability.
 * - Stateful Navigation Matrix: Coordinates child lifecycle state closures via high-level hook setters.
 * - Structural Decoupling: Separates individual step operations into self-contained presentational sandboxes.
 */
function App() {
  // Bounded view state engine tracking execution layers: 'AUTH' | 'INPUT' | 'PROCESSING' | 'CHAT' | 'REPORT' | 'HISTORY'
  // Defaults securely to 'AUTH' to satisfy user isolation specifications (FR-001, FR-002).
  const [currentStage, setCurrentStage] = useState('AUTH');
  
  // Volatile data state caches governing active user data streams across components
  const [manifestContent, setManifestContent] = useState('');
  const [chatTranscript, setChatTranscript] = useState([]);

  /**
   * @function handleLoginSuccess
   * @description Pipeline transition method executed upon verified Firebase identity token resolution.
   * Deactivates the entry guard layout and renders the primary application interface layer.
   */
  const handleLoginSuccess = () => {
    setCurrentStage('INPUT');
  };

  /**
   * @function handleDreamSubmit
   * @description Data intake hook that captures manifest dream strings into root memory 
   * and initializes asynchronous pipeline loading animations.
   * @param {string} submittedText - Raw narrative payload from the dream input text field.
   */
  const handleDreamSubmit = (submittedText) => {
    setManifestContent(submittedText);
    setCurrentStage('PROCESSING');

    // Emulates external network latency budgets before generating the interrogation conversational loop
    setTimeout(() => {
      setCurrentStage('CHAT');
    }, 1500);
  };

  /**
   * @function handleChatComplete
   * @description Terminal loop handler running immediately when the 3-question sequence concludes.
   * Commits the speech matrix to high-level cache prior to structural rendering.
   * @param {Array} transcript - Compiled sequential message collection arrays.
   */
  const handleChatComplete = (transcript) => {
    setChatTranscript(transcript);
    setCurrentStage('REPORT');
  };

  /**
   * @function handleResetSession
   * @description Routine clear function that flushes short-term active diagnostic data properties, 
   * returning state structures cleanly to the baseline log interface.
   */
  const handleResetSession = () => {
    setManifestContent('');
    setChatTranscript([]);
    setCurrentStage('INPUT');
  };

  return (
    <div className="App antialiased text-slate-800 bg-gray-50 min-h-screen flex flex-col justify-between font-sans">
      
      {/* Universal Application Navigation Header Block */}
      {currentStage !== 'AUTH' && (
        <header className="w-full bg-white border-b border-gray-200 py-4 px-6 shadow-sm">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-purple-700 tracking-tight">
              LatentDream <span className="text-xs font-normal text-gray-400">v1.0 (Freudian Framework)</span>
            </h1>
            
            {/* Contextual Navigation Controls optimized for development verification loops */}
            <div className="flex items-center space-x-4">
              {currentStage !== 'CHAT' && currentStage !== 'PROCESSING' && (
                <button
                  onClick={() => setCurrentStage(currentStage === 'HISTORY' ? 'INPUT' : 'HISTORY')}
                  className="text-xs font-medium text-purple-600 hover:text-purple-800 underline cursor-pointer"
                >
                  {currentStage === 'HISTORY' ? "Back to Workspace" : "View Saved Journal History"}
                </button>
              )}
              <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full border">
                Active User Session
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Dynamic Sub-Component Switchboard Workspace */}
      <main className="flex-grow flex items-center justify-center p-4 my-6">
        
        {/* Step 1: Secure Identity Gateway */}
        {currentStage === 'AUTH' && (
          <div className="w-full max-w-md bg-slate-900 p-6 rounded-2xl shadow-xl text-slate-200">
            <Login onLoginSuccess={handleLoginSuccess} />
            <div className="mt-4 text-center">
              <button 
                onClick={handleLoginSuccess} 
                className="text-xs text-purple-400 hover:underline cursor-pointer"
              >
                (Dev Mode Bypass: Click here to enter app directly)
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Manifest Narrative Ingestion Portal */}
        {currentStage === 'INPUT' && (
          <DreamInput onSubmit={handleDreamSubmit} />
        )}

        {/* Step 3: API Pipeline Latency Buffer Sim */}
        {currentStage === 'PROCESSING' && (
          <div className="text-center space-y-4 animate-pulse">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h3 className="text-lg font-semibold text-gray-700">Decomposing Manifest Content...</h3>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              Engaging LangChain prompt routing protocols to extract symbols using historical Freudian literature frameworks.
            </p>
          </div>
        )}

        {/* Step 4: Contextual Dialogue Free Association Thread */}
        {currentStage === 'CHAT' && (
          <DreamChat 
            manifestContent={manifestContent} 
            onChatComplete={handleChatComplete} 
          />
        )}

        {/* Step 5: Completed Psychoanalytic Interpretation Summary */}
        {currentStage === 'REPORT' && (
          <DreamReport 
            manifestContent={manifestContent}
            chatTranscript={chatTranscript}
            onReset={handleResetSession}
          />
        )}

        {/* Step 6: Longitudinal Timeline Journal Ledger Dashboard */}
        {currentStage === 'HISTORY' && (
          <HistoryDashboard onBackToInput={() => setCurrentStage('INPUT')} />
        )}
      </main>

      {/* Structural Academic Identification Footer */}
      {currentStage !== 'AUTH' && (
        <footer className="w-full bg-white border-t border-gray-200 py-3 text-center text-xs text-gray-400">
          &copy; 2026 LatentDream Project &middot; National College of Ireland Portfolio.
        </footer>
      )}
    </div>
  );
}

export default App;