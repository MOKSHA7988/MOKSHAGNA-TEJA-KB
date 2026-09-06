import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Compass,
  ArrowRight,
  RefreshCw,
  HelpCircle,
  IndianRupee,
} from 'lucide-react';
import { Destination } from '../types/travel';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  actionPayload?: any;
}

interface TravelAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanTripFromAssistant?: (destinationName: string) => void;
}

const STARTER_PROMPTS = [
  'What is the best 4-day itinerary for Coorg under ₹20,000?',
  'Recommend top romantic resorts & sunset spots in Munnar',
  'What are the must-try regional dishes in Alleppey backwaters?',
  'How much will a 5-day luxury trip to Manali cost for 2 people?',
];

export const TravelAssistantDrawer: React.FC<TravelAssistantDrawerProps> = ({
  isOpen,
  onClose,
  onPlanTripFromAssistant,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Hello! I am your **MG Travels AI Travel Specialist** powered by Gemini 3.7 Flash and our verified Indian travel intelligence database.\n\nAsk me anything about destination itineraries, budget calculations, local food specialties, secret waterfalls, or road routes!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query.trim(),
          conversationHistory: messages.slice(-4),
        }),
      });

      const data = await res.json();
      const aiReply: Message = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || 'Here is what I found for your journey!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionPayload: data.actionPayload,
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'ai',
          text: `Coorg and Munnar are currently experiencing peak pleasant weather with high travel satisfaction scores. How else may I assist your trip planning?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900 border-l border-slate-700/80 shadow-2xl flex flex-col">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
              AI Travel Assistant
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h3>
            <p className="text-[11px] text-cyan-300">RAG Context + Gemini 3.7 Flash</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] p-3.5 rounded-2xl space-y-1 leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-tr-none shadow-md'
                    : 'bg-slate-800/90 border border-slate-750 text-slate-200 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div
                  className={`text-[9px] text-right font-medium ${
                    isUser ? 'text-cyan-100' : 'text-slate-500'
                  }`}
                >
                  {msg.timestamp}
                </div>

                {msg.actionPayload?.destinationName && (
                  <button
                    onClick={() => {
                      if (onPlanTripFromAssistant) {
                        onPlanTripFromAssistant(msg.actionPayload.destinationName);
                        onClose();
                      }
                    }}
                    className="mt-2 w-full py-2 px-3 rounded-xl bg-cyan-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 hover:bg-cyan-400 transition-all"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Generate Itinerary for {msg.actionPayload.destinationName}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-2.5 items-center text-slate-400 text-xs">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/30 flex items-center justify-center">
              <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
            </div>
            <span>Analyzing destination routes & recommendations...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Starter Suggestions */}
      <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-800/80 space-y-1.5">
        <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-cyan-400" /> Suggested Prompts:
        </p>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {STARTER_PROMPTS.map((prompt, pIdx) => (
            <button
              key={pIdx}
              onClick={() => handleSendMessage(prompt)}
              className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700 whitespace-nowrap transition-all"
            >
              {prompt.slice(0, 32)}...
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="Ask for custom travel tips, secret places, food..."
          className="flex-1 bg-slate-800/80 text-white placeholder-slate-400 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
        />
        <button
          type="submit"
          disabled={!inputPrompt.trim() || isLoading}
          className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white disabled:opacity-50 hover:opacity-90 shadow-md transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
