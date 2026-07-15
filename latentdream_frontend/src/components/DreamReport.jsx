import React from 'react';

/**
 * @file DreamReport.jsx
 * @description Presentational dashboard component rendering the final psychoanalytic evaluation.
 * This component satisfies Functional Requirement FR-006 (Freudian Interpretation Report).
 * * Psychoanalytic Alignment:
 * The 'liveReport' prop ingests the raw, dynamically generated text from the FastAPI LangChain
 * backend. This text represents the clinical unmasking of the dream-work, translating the 
 * user's 'manifest content' into its 'latent' unconscious desires. 
 * * Technical Design:
 * - Removed legacy mock data arrays to ensure the live, generative LLM payload is rendered.
 * - Implements dynamic string parsing (splitting by newline characters) to map the raw text 
 * response into readable HTML paragraph blocks.
 * - Retains the Glassmorphic UI (NFR-003) visual hierarchy.
 */
export default function DreamReport({ manifestContent, chatTranscript, liveReport, onReset }) {
  
  // Helper function to safely render the raw text block into HTML paragraphs
  const renderLiveReport = (text) => {
    if (!text) return <p className="text-sm text-purple-50 italic">Awaiting clinical synthesis...</p>;
    
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
      
      {/* Non-Clinical Safety Disclaimer Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-3 text-center">
        <p className="text-sm text-amber-300 font-medium tracking-wide">
          ✨ For reflection and self-exploration only &middot; Not clinical advice or mental health treatment
        </p>
      </div>

      {/* Report Header Block */}
      <div className="bg-black/30 backdrop-blur-md border-b border-white/10 p-6 text-white text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-purple-200 bg-purple-900/40 px-4 py-1.5 rounded-full border border-purple-500/30 shadow-inner">
          Your Dream Reflection Profile
        </span>
        <h2 className="text-3xl font-bold mt-4 tracking-tight drop-shadow-md">Latent Content Interpretation</h2>
        <p className="text-xs text-purple-300/60 mt-2">Generated via Historical Freudian Metrics</p>
      </div>

      <div className="p-6 space-y-6">
        
        {/* Panel 1: Original Raw Manifest Text Capture */}
        <div className="bg-white/5 p-5 rounded-xl border border-white/10 shadow-inner">
          <h4 className="text-xs font-bold text-purple-300/70 uppercase tracking-wider mb-2 drop-shadow-sm">
            Recorded Manifest Narrative (Literal Story)
          </h4>
          <p className="text-sm text-white italic leading-relaxed">
            "{manifestContent}"
          </p>
        </div>

        {/* Panel 2: Live Generative Analysis Output */}
        <div className="p-6 rounded-xl border border-purple-400/20 bg-purple-900/20 backdrop-blur-sm shadow-inner">
          <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-4 drop-shadow-sm border-b border-purple-500/30 pb-2">
            Psychoanalytic Synthesis
          </h4>
          
          {/* This injects the ACTUAL detailed report from your Python backend! */}
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
            Log a New Dream Entry
          </button>
        </div>
      </div>
    </div>
  );
}