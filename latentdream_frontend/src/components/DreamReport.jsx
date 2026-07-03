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
 * * Technical Design Considerations:
 * - Implements a stateless functional component pattern, relying entirely on stable immutable props 
 * passed down from the root layout core.
 * - Utilizes Tailwind CSS grid structures to create highly scannable visual reporting panels 
 * matching usability metric NFR-003.
 */
export default function DreamReport({ manifestContent, chatTranscript, onReset }) {
  
  // Mock analysis data structure matching the theoretical output fields of the backend pipeline
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
    <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden space-y-6">
      
      {/* Report Header Block */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-950 p-6 text-white text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-purple-300 bg-purple-900 bg-opacity-40 px-3 py-1 rounded-full border border-purple-700">
          Final Psychoanalytic Dossier
        </span>
        <h2 className="text-2xl font-bold mt-2 tracking-tight">Latent Content Interpretation</h2>
        <p className="text-xs text-slate-300 mt-1">Generated via Historical Freudian Metrics</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Panel 1: Original Raw Manifest Text Capture comparison */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Recorded Manifest Narrative (Literal Story)
          </h4>
          <p className="text-sm text-gray-700 italic leading-relaxed">
            "{manifestContent}"
          </p>
        </div>

        {/* Panel 2: Core Analytical Summary Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-purple-100 bg-purple-50 bg-opacity-30">
            <h4 className="text-xs font-bold text-purple-800 uppercase tracking-wider mb-2">
              Clinical Summary Overview
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {mockAnalysisReport.summary}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50 bg-opacity-30">
            <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-2">
              Uncovered Latent Thoughts (Hidden Meaning)
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {mockAnalysisReport.latentMeaning}
            </p>
          </div>
        </div>

        {/* Panel 3: Technical Identification of Dream-Work Mechanisms */}
        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Detected Dream-Work Mechanisms
          </h4>
          <div className="space-y-3">
            {mockAnalysisReport.mechanismsIdentified.map((mech, index) => (
              <div key={index} className="flex items-start p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="bg-purple-100 text-purple-700 font-bold text-xs rounded p-1 px-2 mr-3 mt-0.5">
                  {mech.name}
                </div>
                <div>
                  <p className="text-xs text-gray-600 leading-relaxed">{mech.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 4: Concluding Psychoanalytic Advice */}
        <div className="border-t border-gray-100 pt-4">
          <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
            Psychoanalytic Recommendation
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {mockAnalysisReport.recommendation}
          </p>
        </div>

        {/* Control Button Actions to close loop sequence */}
        <div className="pt-2">
          <button
            onClick={onReset}
            className="w-full py-3 bg-gray-900 hover:bg-black text-white font-medium rounded-xl text-sm transition-colors duration-150 shadow-sm"
          >
            Log a New Manifest Dream Entry
          </button>
        </div>
      </div>
    </div>
  );
}