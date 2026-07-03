import React, { useState, useEffect, useRef } from 'react';

/**
 * @file DreamChat.jsx
 * @description Interactive chat interface component executing the iterative user interrogation loop.
 * This component satisfies Functional Requirement FR-005 by restricting the conversational loop to 
 * exactly three targeted, AI-generated prompts before advancing the data state.
 * * Theoretical Context:
 * In line with Sigmund Freud’s "The Interpretation of Dreams" (1899), dream elements are highly personalized 
 * products of wish-fulfillment and psychic censorship. Rather than utilizing static dictionaries, 
 * this module leverages an active "Free Association" paradigm, querying the user's conscious waking life, 
 * recent day-residues, and dominant emotional baselines to unpack latent meanings.
 * * Technical Design Considerations:
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
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col h-[550px]">
      {/* Interactive Session Info Header */}
      <div className="bg-gradient-to-r from-purple-800 to-indigo-900 p-4 text-white flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-lg tracking-tight">Psychoanalytic Exploration</h3>
          <p className="text-xs text-purple-200">Methodology: Classical Freudian (1899)</p>
        </div>
        <div className="text-xs bg-purple-700 bg-opacity-50 border border-purple-400 px-3 py-1 rounded-full font-mono">
          Progress: Q-{Math.min(questionIndex + 1, 3)} / 3
        </div>
      </div>

      {/* Scrollable Transcript Dashboard Pane */}
      <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50">
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
              msg.sender === 'user' 
                ? 'bg-purple-600 text-white rounded-br-none' 
                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
            }`}>
              <p className="leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}

        {/* Dynamic Typing Handshake Asset */}
        {isAiTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none p-3 shadow-sm flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Input Message Form Controller Component */}
      <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200 flex space-x-2">
        <input
          type="text"
          value={inputReply}
          onChange={(e) => setInputReply(e.target.value)}
          disabled={isAiTyping}
          placeholder={isAiTyping ? "AI is processing concepts..." : "Type your honest thoughts here..."}
          className="flex-grow px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 text-sm"
        />
        <button
          type="submit"
          disabled={isAiTyping || !inputReply.trim()}
          className="bg-purple-700 text-white font-medium text-sm px-5 py-2 rounded-xl hover:bg-purple-800 transition-colors duration-150 disabled:bg-gray-300 shadow-sm"
        >
          Send
        </button>
      </form>
    </div>
  );
}