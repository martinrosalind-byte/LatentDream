import React from 'react';

/**
 * @file DreamReport.jsx
 * @description Presentational dashboard component rendering the final psychoanalytic evaluation for LatentDream.
 * This module directly satisfies Functional Requirement FR-006 by generating a conclusive summary of the 
 * user's latent psychological meanings[cite: 2].
 * 
 * Psychoanalytic Theoretical Alignment:
 * In strict adherence to classical Freudian methodology, this component isolates the generated interpretation 
 * retrieved from the LangChain backend. It ensures the final output focuses exclusively on personal hidden desires 
 * and dominant emotions uncovered during the free-association phase, strictly bypassing unscientific dream dictionaries[cite: 1].
 * 
 * Architectural & UI Design Constraints:
 * - Implements dynamic string parsing to safely map the raw generative LLM payload into a readable DOM structure.
 * - Maintains the application's glassmorphic visual hierarchy, satisfying NFR-003 (Usability) by providing a 
 *   calm, distraction-free environment for users to review their reflections[cite: 2].
 */
export default function DreamReport({ manifestContent, chatTranscript, liveReport, onReset }) {
  
  // Helper function to safely render the raw text block into HTML paragraphs
  const renderLiveReport = (text) => {
    if (!text) return <p className="text-sm text-purple-50 italic">Waiting for your dream's meaning...</p>;
    
    // Split the LLM text by double newlines to create proper paragraph spacing
    return text.split('\n\n').map((paragraph, index) => (
      <p key={index} className="text-sm text-purple-50 leading-relaxed mb-4">
        {/* Simple cleanup to remove bold asterisks if the LLM includes Markdown formatting */}
        {paragraph.replace(/\*\*/g, '')}
      </p>
    ));
  };

  return (
    <div className="w-full max-w-3xl dream-card ethereal-float overflow-hidden space-y-0 shadow-2xl relative">
      
      {/* Ethical Safety Boundary: Non-Clinical Research Disclaimer */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-3 text-center">
        <p className="text-sm text-amber-300 font-medium tracking-wide">
          ✨ For personal reflection only &middot; Not medical advice or mental health treatment
        </p>
      </div>

      {/* Report Header Block */}
      <div className="bg-black/30 backdrop-blur-md border-b border-white/10 p-6 text-white text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-purple-200 bg-purple-900/40 px-4 py-1.5 rounded-full border border-purple-500/30 shadow-inner">
          Your Dream Report
        </span>
        <h2 className="text-3xl font-bold mt-4 tracking-tight drop-shadow-md">Hidden Meanings and Desires</h2>
        <p className="text-xs text-purple-300/60 mt-2">Based on Sigmund Freud's Theory of Dreams</p>
      </div>

      <div className="p-6 space-y-6">
        
        {/* Panel 1: Original Raw Manifest Text Capture */}
        <div className="bg-white/5 p-5 rounded-xl border border-white/10 shadow-inner">
          <h4 className="text-xs font-bold text-purple-300/70 uppercase tracking-wider mb-2 drop-shadow-sm">
            Your Original Dream Story
          </h4>
          <p className="text-sm text-white italic leading-relaxed">
            "{manifestContent}"
          </p>
        </div>

        {/* Panel 2: Live Generative Analysis Output */}
        <div className="p-6 rounded-xl border border-purple-400/20 bg-purple-900/20 backdrop-blur-sm shadow-inner">
          <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-4 drop-shadow-sm border-b border-purple-500/30 pb-2">
            What Your Dream Means
          </h4>
          
          {/* This injects the ACTUAL detailed report from the Python backend */}
          <div className="prose prose-invert max-w-none">
            {renderLiveReport(liveReport)}
          </div>
        </div>

        {/* Control Button Actions to close loop sequence */}
        <div className="pt-4 border-t border-white/10">
          <button
            onClick={onReset}
            className="w-full py-4 bg-purple-600/80 hover:bg-purple-500 text-white font-medium rounded-xl text-sm transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] border border-purple-400/50 cursor-pointer"
          >
            Log a New Dream
          </button>
        </div>
      </div>
    </div>
  );
}