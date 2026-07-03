import React, { useState } from 'react';
import Login from './components/Login';
import DreamInput from './components/DreamInput';
import DreamChat from './components/DreamChat';
import DreamReport from './components/DreamReport';
import HistoryDashboard from './components/HistoryDashboard';
import './index.css';

/**
 * @file App.jsx
 * @description Centralized state orchestrator and root network routing node for the LatentDream React client application.
 * This component handles user interaction stages and replaces local mock counters with live network request payloads.
 * * Architectural Design Patterns:
 * - Centralized State Controller: Maintains top-level data immutability for active session tracking.
 * - Asynchronous Boundary Interface: Leverages standard Web Fetch APIs to manage client-server communications cleanly.
 * - Reactive Error Isolation: Intercepts network disconnect anomalies to protect local view execution states.
 */
function App() {
  // Application execution stages: 'AUTH' | 'INPUT' | 'PROCESSING' | 'CHAT' | 'REPORT' | 'HISTORY'
  const [currentStage, setCurrentStage] = useState('AUTH');
  
  // High-level session data caches
  const [manifestContent, setManifestContent] = useState('');
  const [chatTranscript, setChatTranscript] = useState([]);
  
  // Holds the dynamic Freudian text payload returned by the FastAPI LangChain layer
  const [backendReport, setBackendReport] = useState('');
  
  // Local network error notification state
  const [networkError, setNetworkError] = useState('');

  /**
   * @function handleLoginSuccess
   * @description Advances the state beyond the authentication check into the core logging interface.
   */
  const handleLoginSuccess = () => {
    setCurrentStage('INPUT');
  };

  /**
   * @function handleDreamSubmit
   * @description Caches the initial manifest narrative string and moves the stage directly to the conversational chat.
   * @param {string} submittedText - Raw text narrative input by the user.
   */
  const handleDreamSubmit = (submittedText) => {
    setManifestContent(submittedText);
    setCurrentStage('CHAT');
  };

  /**
   * @function handleChatComplete
   * @description Terminal callback triggered when the 3-question sequence finishes. 
   * Transmits the entire session dataset across the internet to the FastAPI server.
   * @param {Array} transcript - Compiled linear list of question and answer message objects.
   */
  const handleChatComplete = async (transcript) => {
    setChatTranscript(transcript);
    setCurrentStage('PROCESSING');
    setNetworkError('');

    try {
      // Execute live HTTP POST communication to the backend pipeline gateway
      const response = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dream_text: manifestContent,
          transcript: transcript.map(msg => ({
            sender: msg.sender,
            text: msg.text
          }))
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned error status: ${response.status}`);
      }

      const data = await response.json();
      
      // Cache the returned dynamic text analysis into local app state
      setBackendReport(data.interpretation);
      setCurrentStage('REPORT');

    } catch (error) {
      console.error("Network integration breakdown:", error);
      setNetworkError('Failed to communicate with the Freudian analysis server. Please verify your FastAPI backend is running.');
      setCurrentStage('INPUT'); // Safe fallback transition to preserve user inputs
    }
  };

  /**
   * @function handleResetSession
   * @description Flushes all volatile session variables to allow a brand-new analysis cycle.
   */
  const handleResetSession = () => {
    setManifestContent('');
    setChatTranscript([]);
    setBackendReport('');
    setNetworkError('');
    setCurrentStage('INPUT');
  };

  return (
    <div className="App antialiased text-slate-800 bg-gray-50 min-h-screen flex flex-col justify-between font-sans">
      
      {/* Universal Application Navigation Header Bar */}
      {currentStage !== 'AUTH' && (
        <header className="w-full bg-white border-b border-gray-200 py-4 px-6 shadow-sm">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-purple-700 tracking-tight">
              LatentDream <span className="text-xs font-normal text-gray-400">v1.0 (Freudian Framework)</span>
            </h1>
            
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

      {/* Primary Reactive Application Content Switchboard */}
      <main className="flex-grow flex items-center justify-center p-4 my-6">
        
        {/* Network Exception Alert Drawer Banner */}
        {networkError && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 max-w-xl w-full mx-auto p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm shadow-md z-50">
            {networkError}
          </div>
        )}

        {/* Stage 1: Secure Identity Gateway Entry Layer */}
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

        {/* Stage 2: Manifest Narrative Ingestion Portal Form */}
        {currentStage === 'INPUT' && (
          <DreamInput onSubmit={handleDreamSubmit} />
        )}

        {/* Stage 3: Live Asynchronous API Network Handshake Loading Visual */}
        {currentStage === 'PROCESSING' && (
          <div className="text-center space-y-4 animate-pulse">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h3 className="text-lg font-semibold text-gray-700">Decomposing Manifest Content...</h3>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              Transmitting dataset over the network to trigger LangChain prompt routing and execute Gemini API symbol extraction.
            </p>
          </div>
        )}

        {/* Stage 4: Contextual Dialogue Interrogation Component Feed */}
        {currentStage === 'CHAT' && (
          <DreamChat 
            manifestContent={manifestContent} 
            onChatComplete={handleChatComplete} 
          />
        )}

        {/* Stage 5: Live Psychoanalytic Diagnostic Outcome Panel */}
        {currentStage === 'REPORT' && (
          <DreamReport 
            manifestContent={manifestContent}
            chatTranscript={chatTranscript}
            liveReport={backendReport}
            onReset={handleResetSession}
          />
        )}

        {/* Stage 6: Longitudinal Timeline Journal Ledger Dashboard */}
        {currentStage === 'HISTORY' && (
          <HistoryDashboard onBackToInput={() => setCurrentStage('INPUT')} />
        )}
      </main>

      {/* Structural Academic Evaluation Identification Footer */}
      {currentStage !== 'AUTH' && (
        <footer className="w-full bg-white border-t border-gray-200 py-3 text-center text-xs text-gray-400">
          &copy; 2026 LatentDream Project &middot; National College of Ireland Portfolio.
        </footer>
      )}
    </div>
  );
}

export default App;