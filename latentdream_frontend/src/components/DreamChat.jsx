import React, { useState, useEffect, useRef } from 'react';

/**
 * @file DreamChat.jsx
 * @description Dynamic chat interface handling free-association questions.
 * Enforces a strict boundary of exactly three follow-up prompts (FR-005)[cite: 3].
 * 
 * Psychoanalytic Alignment:
 * Traditional psychoanalysis avoids universal dream symbol definitions (Freud, 1899). 
 * Instead, this module uses "Free Association" to collect the dreamer's personal memories, 
 * day-residues, and emotions. By exploring associations dynamically, it bypasses rigid 
 * dictionary lookups to reveal personalized latent meanings.
 * 
 * Technical Design:
 * - Employs a linear message array to manage the conversational dashboard layout.
 * - Tracks turns with a bounded counter (0 to 3) to enforce session constraints.
 * - Uses a React `useRef` guard to block double-triggers during React 19 StrictMode mounting.
 */
export default function DreamChat({ manifestContent, onChatComplete }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const [inputReply, setInputReply] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const effectInitialized = useRef(false);

  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
        { sender: 'ai', text: "An error occurred fetching the next question. Please verify your backend API.", timestamp: new Date() }
      ]);
    } finally {
      setIsAiTyping(false);
    }
  };

  useEffect(() => {
    if (effectInitialized.current) return;
    effectInitialized.current = true;

    const baselineHistory = [
      { 
        sender: 'ai', 
        text: `I have received your dream details. Let us look beyond the surface imagery to find its deeper, personal meanings. I will ask you exactly three reflective questions to explore your personal associations.`, 
        timestamp: new Date() 
      }
    ];
    setMessages(baselineHistory);
    queryNextQuestion(baselineHistory);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputReply.trim() || isAiTyping) return;

    const userMessage = { sender: 'user', text: inputReply, timestamp: new Date() };
    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setInputReply('');

    const nextIndex = questionIndex + 1;
    setQuestionIndex(nextIndex);

    if (nextIndex >= 3) {
      setIsAiTyping(true);
      setTimeout(() => {
        onChatComplete(updatedHistory); // Elevates the complete dialogue to generate the final report (FR-006)
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
        <input
          type="text"
          value={inputReply}
          onChange={(e) => setInputReply(e.target.value)}
          disabled={isAiTyping}
          placeholder={isAiTyping ? "AI is processing your reflections..." : "Type your honest thoughts and memories here..."}
          className="flex-grow px-4 py-3 border border-white/10 bg-black/40 text-white placeholder-purple-300/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:bg-white/5 disabled:text-purple-300/40 text-sm transition-all duration-300"
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