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
 * Incorporates global ethereal aesthetic wrappers to deliver a unified, immersive user experience.
 * * * Architectural & UI Design Patterns:
 * - Centralized State Controller: Maintains top-level data immutability for active session tracking.
 * - Glassmorphism UI Wrapper: Utilizes backdrop-filters and alpha-channel backgrounds for the header/footer.
 * - Reactive Error Isolation: Intercepts network disconnect anomalies to protect local view execution states.
 * - Ethical Guardrails: Embeds a site-wide footer disclaimer clarifying the non-clinical nature of the app.
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
      // Dynamically resolves to the cloud environment variable, falling back to the local host
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/api/analyze`, {
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
      setNetworkError('Failed to communicate with the analysis server. Please verify your FastAPI backend is running.');
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
    /* 1. INJECTED .dream-viewport-bg: 
      Replaces standard grey background with the animated CSS gradient mesh.
      Text is inverted to text-slate-100 to ensure high contrast against dark celestial colors.
    */
    <div className="App antialiased text-slate-100 dream-viewport-bg flex flex-col justify-between font-sans relative min-h-screen">
      
      {/* Universal Application Navigation Header Bar */}
      {currentStage !== 'AUTH' && (
        /* 2. HEADER GLASSMORPHISM: 
          Replaced solid white background with semi-transparent black (bg-black/20) 
          and a frosted glass blur (backdrop-blur-md).
        */
        <header className="w-full bg-black/20 backdrop-blur-md border-b border-white/10 py-4 px-6 shadow-sm z-10">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-purple-300 tracking-tight drop-shadow-md">
              LatentDream <span className="text-xs font-normal text-purple-200/60 ml-2">v1.0 (Freudian Framework)</span>
            </h1>
            
            <div className="flex items-center space-x-4">
              {currentStage !== 'CHAT' && currentStage !== 'PROCESSING' && (
                <button
                  onClick={() => setCurrentStage(currentStage === 'HISTORY' ? 'INPUT' : 'HISTORY')}
                  className="text-xs font-medium text-purple-300 hover:text-purple-100 transition-colors cursor-pointer"
                >
                  {currentStage === 'HISTORY' ? "Back to Workspace" : "View Saved Journal History"}
                </button>
              )}
              <div className="text-xs text-purple-100 bg-purple-900/40 px-3 py-1 rounded-full border border-purple-400/30 shadow-inner">
                Active User Session
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Primary Reactive Application Content Switchboard */}
      <main key={currentStage} className="flex-grow flex items-center justify-center p-4 my-6 z-10 relative animate-fade-in">
        
        {/* Network Exception Alert Drawer Banner */}
        {networkError && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 max-w-xl w-full mx-auto p-4 bg-red-900/80 backdrop-blur-md border border-red-400 text-red-100 rounded-xl text-sm shadow-2xl z-50">
            {networkError}
          </div>
        )}

        {/* Stage 1: Secure Identity Gateway Entry Layer */}
        {currentStage === 'AUTH' && (
          /* 3. DREAM CARD & FLOAT: 
            Replaced the static background box with our custom .dream-card frosted glass effect 
            and the .ethereal-float zero-gravity hovering animation.
          */
          <div className="w-full max-w-md p-8 dream-card ethereal-float">
            <Login onLoginSuccess={handleLoginSuccess} />
            <div className="mt-6 text-center border-t border-white/10 pt-4">
              <button 
                onClick={handleLoginSuccess} 
                className="text-xs text-purple-300 hover:text-purple-100 transition-colors cursor-pointer"
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
          <div className="text-center space-y-5 animate-pulse ethereal-float">
            <div className="w-14 h-14 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
            <h3 className="text-xl font-semibold text-white drop-shadow-md">Reflecting on Dream Elements...</h3>
            <p className="text-sm text-purple-200/70 max-w-sm mx-auto leading-relaxed">
              Synthesizing your narrative and associations to generate personalized psychoanalytic insights.
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

        {/* Stage 5: Live Dream Reflection Panel */}
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
        /* 4. FOOTER GLASSMORPHISM: Matches the translucent header aesthetic */
        <footer className="w-full bg-black/20 backdrop-blur-md border-t border-white/10 py-4 text-center z-10 flex flex-col space-y-1">
          <span className="text-xs text-purple-200/50">
            &copy; 2026 LatentDream Project &middot; National College of Ireland Portfolio.
          </span>
          <span className="text-[10px] text-amber-500/60 uppercase tracking-widest font-semibold">
            For Reflection Only &middot; Not Clinical Advice
          </span>
        </footer>
      )}
    </div>
  );
}

export default App;