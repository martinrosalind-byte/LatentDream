import React from 'react';

/**
 * @file DreamReport.jsx
 * @description Presentational dashboard component rendering the final psychoanalytic evaluation.
 * This component satisfies Functional Requirement FR-006 (Freudian Interpretation Report) by organizing
 * processed data payloads into structured diagnostic panels.
 * * Theoretical Context:
 * According to Sigmund Freud's structural model of the psyche (1899), the "dream-work" uses mechanisms 
 * like condensation (combining multiple ideas into one image) and displacement (shifting emotional priority) 
 * to disguise forbidden unconscious wishes. This report layout explicitly categorizes elements into 
 * Manifest Imagery, Unconscious Desires, and Ego Defenses to map out those hidden conflicts.
 * * Technical & UI Design Considerations:
 * - Implements a stateless functional component pattern, relying entirely on stable immutable props.
 * - Glassmorphic UI (NFR-003): Utilizes translucent Tailwind CSS grid structures to create highly scannable 
 * visual reporting panels that maintain visual immersion over the global celestial background.
 */
export default function DreamReport({ manifestContent, chatTranscript, liveReport, onReset }) {
  
  // Mock analysis data structure matching the theoretical output fields of the backend pipeline
  // Note: Once the LangChain pipeline is finalized, these fields can be mapped directly from the 'liveReport' prop.
  const mockAnalysisReport = {
    summary: "The dream indicates a classic conflict between an unfulfilled infantile wish and the waking ego's defense mechanisms. The surface narrative acts as a compromise-formation to shield the dreamer from waking anxiety.",
    latentMeaning: "The act of searching represents a repressed desire for autonomy or a resolution to a childhood emotional dependency. The environment represents a state of psychological vulnerability where hidden feelings are guarded.",
    mechanismsIdentified: [
      { name: "Displacement", description: "Emotional anxiety regarding an authority figure or personal conflict is shifted onto a harmless mundane object." },
      { name: "Condensation", description: "Multiple distinct real-world stresses and childhood memories are merged into a single composite dream setting." }
    ],
    recommendation: "Pay close attention to moments of resistance or hesitation experienced during the free-association chat phase. These boundaries mark where your conscious ego is working hardest to repress latent thoughts."
  };

  return (
    /* 1. REPORT MAIN CONTAINER: 
       Applies the .dream-card frosted glass base and a subtle zero-gravity float 
       to match the overarching application aesthetic.
    */
    <div className="w-full max-w-3xl dream-card ethereal-float overflow-hidden space-y-6 shadow-2xl">
      
      {/* Report Header Block */}
      <div className="bg-black/30 backdrop-blur-md border-b border-white/10 p-6 text-white text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-purple-200 bg-purple-900/40 px-4 py-1.5 rounded-full border border-purple-500/30 shadow-inner">
          Final Psychoanalytic Dossier
        </span>
        <h2 className="text-3xl font-bold mt-4 tracking-tight drop-shadow-md">Latent Content Interpretation</h2>
        <p className="text-xs text-purple-300/60 mt-2">Generated via Historical Freudian Metrics</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Panel 1: Original Raw Manifest Text Capture comparison */}
        <div className="bg-white/5 p-5 rounded-xl border border-white/10 shadow-inner">
          <h4 className="text-xs font-bold text-purple-300/70 uppercase tracking-wider mb-2 drop-shadow-sm">
            Recorded Manifest Narrative (Literal Story)
          </h4>
          <p className="text-sm text-white italic leading-relaxed">
            "{manifestContent}"
          </p>
        </div>

        {/* Panel 2: Core Analytical Summary Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl border border-purple-400/20 bg-purple-900/20 backdrop-blur-sm transition-all hover:bg-purple-900/30">
            <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-3 drop-shadow-sm">
              Clinical Summary Overview
            </h4>
            <p className="text-sm text-purple-50 leading-relaxed">
              {mockAnalysisReport.summary}
            </p>
          </div>

          <div className="p-5 rounded-xl border border-indigo-400/20 bg-indigo-900/20 backdrop-blur-sm transition-all hover:bg-indigo-900/30">
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-3 drop-shadow-sm">
              Uncovered Latent Thoughts (Hidden Meaning)
            </h4>
            <p className="text-sm text-indigo-50 leading-relaxed">
              {mockAnalysisReport.latentMeaning}
            </p>
          </div>
        </div>

        {/* Panel 3: Technical Identification of Dream-Work Mechanisms */}
        <div>
          <h4 className="text-xs font-bold text-purple-300/70 uppercase tracking-wider mb-3 drop-shadow-sm">
            Detected Dream-Work Mechanisms
          </h4>
          <div className="space-y-3">
            {mockAnalysisReport.mechanismsIdentified.map((mech, index) => (
              /* MECHANISM BADGES: Replaced solid white rows with translucent data slots */
              <div key={index} className="flex items-start p-4 bg-black/20 border border-white/10 rounded-xl shadow-sm hover:bg-black/30 transition-colors">
                <div className="bg-purple-500/20 border border-purple-400/30 text-purple-200 font-bold text-xs rounded p-1.5 px-3 mr-4 mt-0.5 shadow-inner">
                  {mech.name}
                </div>
                <div>
                  <p className="text-sm text-gray-200 leading-relaxed">{mech.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 4: Concluding Psychoanalytic Advice */}
        <div className="border-t border-white/10 pt-5">
          <h4 className="text-xs font-bold text-purple-300/70 uppercase tracking-wider mb-2 drop-shadow-sm">
            Psychoanalytic Recommendation
          </h4>
          <p className="text-sm text-purple-100/90 leading-relaxed">
            {mockAnalysisReport.recommendation}
          </p>
        </div>

        {/* Control Button Actions to close loop sequence */}
        <div className="pt-4">
          {/* LUMINOUS ACTION BUTTON: Matches the aesthetic of the Input phase submit button */}
          <button
            onClick={onReset}
            className="w-full py-4 bg-purple-600/80 hover:bg-purple-500 text-white font-medium rounded-xl text-sm transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] border border-purple-400/50"
          >
            Log a New Manifest Dream Entry
          </button>
        </div>
      </div>
    </div>
  );
}