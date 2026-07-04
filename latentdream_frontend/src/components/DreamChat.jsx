import React, { useState, useEffect, useRef } from 'react';

/**
 * @file DreamChat.jsx
 * @description Interactive chat interface component executing the iterative user interrogation loop.
 * This component satisfies Functional Requirement FR-005 by restricting the conversational loop to 
 * exactly three targeted, AI-generated prompts before advancing the data state.
 * 
 * Theoretical Context:
 * In line with Sigmund Freud’s "The Interpretation of Dreams" (1899), dream elements are highly personalized 
 * products of wish-fulfillment and psychic censorship. Rather than utilizing static dictionaries, 
 * this module leverages an active "Free Association" paradigm, querying the user's conscious waking life, 
 * recent day-residues, and dominant emotional baselines to unpack latent meanings.
 * 
 * Technical Design Considerations:
 * - Employs a local state linear array to manage chat message components dynamically.
 * - Tracks iterative state progression through a bounded index counter (0 to 3) to enforce conversational limits.
 * - Integrates loading states to accommodate performance expectations outlined in NFR-001.
 * - Uses an initialization reference flag to completely eliminate duplicate message side-effects during React StrictMode double-mount loops.
 */
export default function DreamChat({ manifestContent, onChatComplete }) {
  // Bounded index counter tracking the total number of processed follow-up answers
  const [questionIndex, setQuestionIndex] = useState(0);
  
  // Local state array capturing individual message payloads for the visual dashboard feed
  const [messages, setMessages] = useState([]);
  
  // Controlled input value binding for the current user reply text area
  const [inputReply, setInputReply] = useState('');
  
  // Boolean flag indicating system async operations to mimic backend API latency thresholds
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Reference cell tracking lifecycle execution status to neutralize StrictMode double-triggers
  const effectInitialized = useRef(false);

  // Simulated bank of strict Freudian contextual questions focused on underlying mechanisms
  const mockFreudianQuestions = [
    "Reflecting on the dominant imagery in your dream, what specific memory from your childhood or early life does this environment bring to mind?",
    "Consider the strongest emotion you felt during this dream sequence. Where in your recent waking life have you experienced a similar emotional conflict or repression?",
    "If the main event or obstacle in your dream was actually a disguised wish or hidden desire, what unfulfilled craving might your mind be trying to safely satisfy?"
  ];

  /**
   * @function triggerAiQuestion
   * @description Appends a simulated AI question frame to the message collection wrapper.
   * Maintains architectural parity with LangChain runtime behaviors.
   */
  const triggerAiQuestion = (index) => {
    setIsAiTyping(true);
    
    // Simulates processing latency budget constraints (NFR-001 target: < 3.5 seconds)
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: mockFreudianQuestions[index], timestamp: new Date() }
      ]);
      setIsAiTyping(false);
    }, 1200);
  };

  // Lifecycle hook initiating the first question sequence automatically upon mount state
  useEffect(() => {
    // Structural Guard: Abort execution if the mounting routine has already run
    if (effectInitialized.current) return;
    effectInitialized.current = true;

    // Prime the message feed with an analytical confirmation note and the first clinical question
    setMessages([
      { 
        sender: 'ai', 
        text: `I have received your manifest dream content. Let us look beyond the surface imagery to find the latent thoughts. I will ask you exactly three contextual questions to explore your associations.`, 
        timestamp: new Date() 
      }
    ]);
    triggerAiQuestion(0);
  }, []);

  /**
   * @function handleSendMessage
   * @description Processes user replies, updates local state stores, increments the loop bounds,
   * and intercepts termination thresholds to hand control back to the root application context.
   */
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputReply.trim() || isAiTyping) return;

    // Capture user response data frame
    const userMessage = { sender: 'user', text: inputReply, timestamp: new Date() };
    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setInputReply('');

    const nextIndex = questionIndex + 1;
    setQuestionIndex(nextIndex);

    // Bounded condition check: If user has answered exactly 3 questions, close the session loop
    if (nextIndex >= 3) {
      setIsAiTyping(true);
      setTimeout(() => {
        // Lift the complete conversational transcript back to App.jsx to fire FR-006 (Interpretation Report)
        onChatComplete(updatedHistory);
      }, 1500);
    } else {
      // Loop execution continue state
      triggerAiQuestion(nextIndex);
    }
  };

  return (
    /* 1. COMPONENT PORTAL WRAPPER:
       Replaced the flat white layout with your custom .dream-card frosted glass definition.
    */
    <div className="w-full max-w-2xl dream-card overflow-hidden flex flex-col h-[550px] shadow-2xl">
      
      {/* Interactive Session Info Header */}
      <div className="bg-purple-950/40 backdrop-blur-md border-b border-white/10 p-4 text-white flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-lg tracking-tight drop-shadow-md">Psychoanalytic Exploration</h3>
          <p className="text-xs text-purple-300/70">Methodology: Classical Freudian (1899)</p>
        </div>
        <div className="text-xs bg-purple-500/20 border border-purple-400/30 px-3 py-1 rounded-full font-mono shadow-inner">
          Progress: Q-{Math.min(questionIndex + 1, 3)} / 3
        </div>
      </div>

      {/* Scrollable Transcript Dashboard Pane */}
      <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-black/10 backdrop-blur-sm">
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {/* 2. DYNAMIC TEXT BUBBLES:
               - User Bubbles (Right): Sleek purple surface with a soft glowing back-shadow ambient effect.
               - AI Bubbles (Left): Soft grey frosted glass plates with clear white text boundaries.
            */}
            <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
              msg.sender === 'user' 
                ? 'bg-purple-600/80 text-white rounded-br-none border border-purple-400/30 shadow-[0_0_12px_rgba(168,85,247,0.2)]' 
                : 'bg-white/5 text-purple-100 border border-white/10 rounded-bl-none shadow-sm'
            }`}>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}

        {/* Dynamic Typing Handshake Asset */}
        {isAiTyping && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-none p-4 shadow-sm flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Input Message Form Controller Component */}
      <div className="p-3 bg-black/30 border-t border-white/10 flex space-x-2">
        {/* 3. TRANSULCENT CHAT INPUT:
           Transforms the chat bar into a dark glass capsule with purple ambient targeting outlines.
        */}
        <input
          type="text"
          value={inputReply}
          onChange={(e) => setInputReply(e.target.value)}
          disabled={isAiTyping}
          placeholder={isAiTyping ? "AI is processing concepts..." : "Type your honest thoughts here..."}
          className="flex-grow px-4 py-3 border border-white/10 bg-black/40 text-white placeholder-purple-300/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 disabled:bg-white/5 disabled:text-purple-300/40 text-sm transition-all duration-300"
        />
        <button
          type="submit"
          onClick={handleSendMessage}
          disabled={isAiTyping || !inputReply.trim()}
          className="bg-purple-600/80 border border-purple-400/40 text-white font-medium text-sm px-6 py-2 rounded-xl hover:bg-purple-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all duration-300 disabled:bg-white/5 disabled:text-purple-300/20 disabled:border-white/5 shadow-md"
        >
          Send
        </button>
      </div>
    </div>
  );
}