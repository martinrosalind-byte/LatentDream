import React, { useState, useEffect, useRef } from 'react';

/**
 * @file DreamChat.jsx
 * @description Dynamic chat interface handling the Freudian free-association dialogue.
 * 
 * Psychoanalytic Alignment:
 * In accordance with classical Freudian psychoanalytic theory, this module completely 
 * bypasses unscientific, rigid dream dictionaries. Instead, it guides the user through 
 * "Free Association" to uncover personal memories, day-residues, and dominant emotions 
 * attached to the manifest content.
 * 
 * Technical Design & Requirements Integration:
 * - Enforces a strict conversational boundary of exactly three follow-up prompts to 
 *   satisfy requirement FR-005.
 * - Monitors the dialogue state using a bounded counter; upon reaching the threshold, 
 *   it triggers the generation of the final interpretation report, satisfying FR-006.
 * - Utilises React `useRef` to prevent duplicate initialization during StrictMode mounting.
 * - Implements translucent glassmorphism UI utilities (Tailwind CSS) to support the 
 *   calming, non-distracting visual environment mandated by NFR-003.
 */
export default function DreamChat({ manifestContent, onChatComplete }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const [inputReply, setInputReply] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const effectInitialized = useRef(false);

  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  /**
   * Transmits the current conversational transcript to the AI backend to fetch 
   * the next Freudian free-association question.
   * 
   * @param {Array} currentHistory - The chronological array of user and AI messages.
   */
  const queryNextQuestion = async (currentHistory) => {
    setIsAiTyping(true);
    try {
      const response = await fetch(`${backendUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dream_text: manifestContent,
          transcript: currentHistory.map(msg => ({
            sender: msg.sender,
            text: msg.text
          }))
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'in_progress') {
        setMessages(prev => [
          ...prev,
          ...data.question ? [{ sender: 'ai', text: data.question, timestamp: new Date() }] : []
        ]);
      } else if (data.status === 'complete') {
        onChatComplete(currentHistory);
      }
    } catch (error) {
      console.error("Dialogue sync error:", error);
      setMessages(prev => [
        ...prev,
        { 
          sender: 'ai', 
          text: "An error occurred fetching the next question. Please verify your backend API.", 
          timestamp: new Date() 
        }
      ]);
    } finally {
      setIsAiTyping(false);
    }
  };

  /**
   * Initializes the chat interface with a simple, accessible greeting that explains 
   * the free-association process without using dense psychological jargon.
   */
  useEffect(() => {
    if (effectInitialized.current) return;
    effectInitialized.current = true;

    const baselineHistory = [
      { 
        sender: 'ai', 
        text: `I have your dream details. Let's look beyond the surface to find its personal meaning. I will ask you three simple questions about your feelings and memories to help uncover what this dream means for you.`, 
        timestamp: new Date() 
      }
    ];
    setMessages(baselineHistory);
    queryNextQuestion(baselineHistory);
  }, []);

  /**
   * Processes the user's free-association input, updates the transcript matrix, 
   * and evaluates whether the three-question boundary has been reached.
   */
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputReply.trim() || isAiTyping) return;

    const userMessage = { sender: 'user', text: inputReply, timestamp: new Date() };
    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setInputReply('');

    const nextIndex = questionIndex + 1;
    setQuestionIndex(nextIndex);

    // FR-006 Verification: Elevates the complete dialogue to the parent component 
    // to generate the final Freudian interpretation report once 3 questions are answered.
    if (nextIndex >= 3) {
      setIsAiTyping(true);
      setTimeout(() => {
        onChatComplete(updatedHistory); 
      }, 1000);
    } else {
      queryNextQuestion(updatedHistory);
    }
  };

  return (
    <div className="w-full max-w-2xl dream-card overflow-hidden flex flex-col h-[580px] shadow-2xl relative">
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-center">
        <p className="text-xs text-amber-300 font-medium tracking-wide">
          ✨ For reflection and self-exploration only &middot; Not clinical advice or mental health treatment
        </p>
      </div>

      <div className="bg-purple-950/40 backdrop-blur-md border-b border-white/10 p-4 text-white flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-base tracking-tight drop-shadow-md">Dream Reflection &amp; Association</h3>
          <p className="text-xs text-purple-300/70">Concept: Classical Freudian Free Association (1899)</p>
        </div>
        <div className="text-xs bg-purple-500/20 border border-purple-400/30 px-3 py-1 rounded-full font-mono shadow-inner">
          Progress: Question {Math.min(questionIndex + 1, 3)} of 3
        </div>
      </div>

      <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-black/10 backdrop-blur-sm">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
              msg.sender === 'user' 
                ? 'bg-purple-600/80 text-white rounded-br-none border border-purple-400/30 shadow-md' 
                : 'bg-white/5 text-purple-100 border border-white/10 rounded-bl-none shadow-sm'
            }`}>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}

        {isAiTyping && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-sm flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="p-3 bg-black/30 border-t border-white/10 flex space-x-2">
        {/* 
          * UI Refraction Update (NFR-003): 
          * Swapped opaque dark-fill (bg-black/40) for translucent frosted glass utilities 
          * (bg-white/5, backdrop-blur-md) to align the interactive chat input with the 
          * overarching application aesthetic.
          */}
        <input
          type="text"
          value={inputReply}
          onChange={(e) => setInputReply(e.target.value)}
          disabled={isAiTyping}
          placeholder={isAiTyping ? "AI is processing your reflections..." : "Type your honest thoughts and memories here..."}
          className="flex-grow px-4 py-3 border border-white/10 bg-white/5 backdrop-blur-md text-white placeholder-purple-300/30 rounded-xl focus:outline-none focus:border-white/30 disabled:bg-white/5 disabled:text-purple-300/40 text-sm transition-all duration-300"
        />
        <button
          type="submit"
          disabled={isAiTyping || !inputReply.trim()}
          className="bg-purple-600/80 border border-purple-400/40 text-white font-medium text-sm px-6 py-2 rounded-xl hover:bg-purple-500 transition-all duration-300 cursor-pointer disabled:bg-white/5"
        >
          Send
        </button>
      </form>
    </div>
  );
}