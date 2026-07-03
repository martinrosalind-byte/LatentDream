import React, { useState } from 'react';
import Login from './components/Login';
import DreamInput from './components/DreamInput';
import DreamChat from './components/DreamChat';
import DreamReport from './components/DreamReport';
import './index.css';

/**
 * @file App.jsx
 * @description Central state orchestrator and entry point for the LatentDream React application.
 * This component acts as a stateful Finite State Machine (FSM) that controls the lifecycle 
 * of a dream analysis session while enforcing secure user authorization boundaries.
 * 
 * Architectural Design Patterns:
 * - Centralized State Hub: Hoists state definitions to the root node to establish a single source of truth.
 * - Inverse Data Flow: Uses callback functions passed to child modules to lift up data payloads.
 * - Conditional Layout Rendering: Implements short-circuit evaluation for efficient screen transitions.
 */
function App() {
  // Bounded view state machine tracking session phases: 'AUTH' | 'INPUT' | 'PROCESSING' | 'CHAT' | 'REPORT'
  const [currentStage, setCurrentStage] = useState('AUTH');
  
  // High-level data caches storing data between lifecycle views
  const [manifestContent, setManifestContent] = useState('');
  const [chatTranscript, setChatTranscript] = useState([]);

  /**
   * @function handleLoginSuccess
   * @description Transitions the interface from authentication into the data logging view.
   */
  const handleLoginSuccess = () => {
    setCurrentStage('INPUT');
  };

  /**
   * @function handleDreamSubmit
   * @description Caches the user's initial dream narrative text and advances the system state.
   * @param {string} submittedText - Raw manifest content string from the text input form.
   */
  const handleDreamSubmit = (submittedText) => {
    setManifestContent(submittedText);
    setCurrentStage('PROCESSING');

    // Replicates network latency for backend handshake before launching conversation loop
    setTimeout(() => {
      setCurrentStage('CHAT');
    }, 1500);
  };

  /**
   * @function handleChatComplete
   * @description Stores the conversation history and moves the interface to the final evaluation panel.
   * @param {Array} transcript - Collection of message objects from the conversational loop.
   */
  const handleChatComplete = (transcript) => {
    setChatTranscript(transcript);
    setCurrentStage('REPORT');
  };

  /**
   * @function handleResetSession
   * @description Flushes the temporary application caches to allow a clean recurring analysis loop.
   */
  const handleResetSession = () => {
    setManifestContent('');
    setChatTranscript([]);
    setCurrentStage('INPUT');
  };

  return (
    <div className="App antialiased text-slate-800 bg-gray-50 min-h-screen flex flex-col justify-between font-sans">
      
      {/* Top Application Header (Hidden on Login View) */}
      {currentStage !== 'AUTH' && (
        <header className="w-full bg-white border-b border-gray-200 py-4 px-6 shadow-sm">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-purple-700 tracking-tight">
              LatentDream <span className="text-xs font-normal text-gray-400">v1.0 (Freudian Framework)</span>
            </h1>
            <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full border">
              Active User Session
            </div>
          </div>
        </header>
      )}

      {/* Main App Switchboard Window */}
      <main className="flex-grow flex items-center justify-center p-4 my-6">
        
        {/* Stage 1: Security and Authentication Entry Gateway */}
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

        {/* Stage 2: Manifest Content Submission Box */}
        {currentStage === 'INPUT' && (
          <DreamInput onSubmit={handleDreamSubmit} />
        )}

        {/* Stage 3: Network Pipeline Handshake Wait Visual */}
        {currentStage === 'PROCESSING' && (
          <div className="text-center space-y-4 animate-pulse">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h3 className="text-lg font-semibold text-gray-700">Decomposing Manifest Content...</h3>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              Engaging LangChain prompt routing protocols to extract symbols using historical Freudian literature frameworks.
            </p>
          </div>
        )}

        {/* Stage 4: Free Association Conversation Interrogation Feed */}
        {currentStage === 'CHAT' && (
          <DreamChat 
            manifestContent={manifestContent} 
            onChatComplete={handleChatComplete} 
          />
        )}

        {/* Stage 5: Final Psychoanalytic Diagnostic Outcome Panel */}
        {currentStage === 'REPORT' && (
          <DreamReport 
            manifestContent={manifestContent}
            chatTranscript={chatTranscript}
            onReset={handleResetSession}
          />
        )}
      </main>

      {/* App Structural Footer */}
      {currentStage !== 'AUTH' && (
        <footer className="w-full bg-white border-t border-gray-200 py-3 text-center text-xs text-gray-400">
          &copy; 2026 LatentDream Project &middot; National College of Ireland Portfolio.
        </footer>
      )}
    </div>
  );
}

export default App;