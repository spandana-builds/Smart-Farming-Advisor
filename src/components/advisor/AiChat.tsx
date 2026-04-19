import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { ChatMessage } from '../../types';
import { sendChatMessage } from '../../lib/api';

interface AiChatProps {
  cropId: string;
  cropName: string;
  temperature: number;
  humidity: number;
  farmingSessionId: string | null;
  messages: ChatMessage[];
  onMessagesChange: (msgs: ChatMessage[]) => void;
}

const quickQuestions = [
  'How often should I water?',
  'What fertilizer should I use?',
  'How do I prevent pests?',
  'What diseases should I watch for?',
  'When is the best time to harvest?',
  'How can I improve soil health?',
];

function formatContent(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export default function AiChat({ cropId, cropName, temperature, humidity, farmingSessionId, messages, onMessagesChange }: AiChatProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(text?: string) {
    const question = (text ?? input).trim();
    if (!question || loading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: question,
      timestamp: new Date(),
    };
    onMessagesChange([...messages, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const answer = await sendChatMessage(
        question,
        cropId,
        temperature,
        humidity,
        farmingSessionId,
        `Crop: ${cropName}, Temp: ${temperature}°C, Humidity: ${humidity}%`
      );
      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: answer,
        timestamp: new Date(),
      };
      onMessagesChange([...messages, userMsg, botMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Sorry, I encountered an issue. Please try again in a moment.',
        timestamp: new Date(),
      };
      onMessagesChange([...messages, userMsg, errorMsg]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[580px] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-[#0f2417] to-[#1a3d26]">
        <div className="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center">
          <Sparkles size={16} className="text-white" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm">AI Farming Advisor</p>
          <p className="text-green-400 text-xs">{cropName} Expert · Always available</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-green-400 text-xs">Online</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-green-500' : 'bg-[#0f2417]'
            }`}>
              {msg.role === 'user'
                ? <User size={13} className="text-white" />
                : <Bot size={13} className="text-white" />
              }
            </div>
            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-green-500 text-white rounded-tr-sm'
                : 'bg-white text-gray-700 border border-gray-100 shadow-sm rounded-tl-sm'
            }`}>
              {msg.role === 'assistant' ? formatContent(msg.content) : msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#0f2417] flex items-center justify-center flex-shrink-0">
              <Bot size={13} className="text-white" />
            </div>
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex items-center gap-1.5">
                <Loader2 size={13} className="text-green-500 animate-spin" />
                <span className="text-xs text-gray-400">Analyzing your farm conditions...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {messages.length <= 1 && (
        <div className="px-4 py-3 border-t border-gray-100 bg-white">
          <p className="text-xs text-gray-400 mb-2">Quick questions:</p>
          <div className="flex flex-wrap gap-1.5">
            {quickQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                disabled={loading}
                className="text-xs bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 px-2.5 py-1 rounded-full transition-colors disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 py-3 border-t border-gray-100 bg-white">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={`Ask about ${cropName} farming...`}
            disabled={loading}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent disabled:opacity-60"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="w-10 h-10 bg-green-500 hover:bg-green-600 disabled:bg-gray-200 text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
