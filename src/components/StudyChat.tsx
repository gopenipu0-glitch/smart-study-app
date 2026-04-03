import React, { useState, useRef, useEffect } from 'react';
import { askAI, generateSpeech } from '../lib/gemini';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User, Loader2, Volume2, Copy, Trash2, Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function StudyChat() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('study_chat_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('study_chat_history', JSON.stringify(messages));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askAI(input, "You are a smart study assistant named SmartStudy AI. You were created by Ayon Gope. If anyone asks who created you or who made you, you must proudly say that you were created by Ayon Gope. Help the user understand concepts, solve problems, or organize their study schedule. Be encouraging and clear. Use Google Search for accurate information.");
      setMessages(prev => [...prev, { role: 'assistant', content: response || "I'm sorry, I couldn't process that." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Error: " + (error instanceof Error ? error.message : "Failed to connect to AI.") }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = async (text: string, index: number) => {
    if (isSpeaking !== null) return;
    setIsSpeaking(index);
    try {
      const base64Audio = await generateSpeech(text.substring(0, 500)); // Limit to 500 chars for TTS
      if (base64Audio) {
        const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
        audio.onended = () => setIsSpeaking(null);
        audio.play();
      } else {
        setIsSpeaking(null);
      }
    } catch (error) {
      console.error("TTS Error:", error);
      setIsSpeaking(null);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear the chat history?")) {
      setMessages([]);
      localStorage.removeItem('study_chat_history');
    }
  };

  return (
    <div className="flex flex-col h-full bg-bg-card dark:bg-bg-card rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-border-main dark:border-border-main overflow-hidden transition-all">
      <div className="p-6 border-b border-border-main dark:border-border-main bg-bg-main/50 dark:bg-bg-main/50 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-primary dark:text-primary-light" />
          </div>
          <div>
            <h2 className="font-black text-text-main dark:text-text-main">AI Tutor</h2>
            <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">SmartStudy Assistant</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button 
            onClick={clearChat}
            className="p-2.5 text-text-muted hover:text-danger hover:bg-danger/10 dark:hover:bg-danger/20 rounded-xl transition-all"
            title="Clear Chat"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        {messages.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bot className="w-10 h-10 text-primary opacity-40" />
            </div>
            <h3 className="text-xl font-black text-text-main dark:text-text-main mb-2">Hello! I'm your AI Tutor</h3>
            <p className="text-text-muted dark:text-text-muted max-w-xs mx-auto text-sm leading-relaxed">
              Ask me anything about your studies. I can search the web for real-time information!
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex gap-4", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
            <div className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border transition-all",
              msg.role === 'user' 
                ? "bg-primary border-primary text-white" 
                : "bg-bg-main dark:bg-bg-main text-text-main dark:text-text-main border-border-main dark:border-border-main"
            )}>
              {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>
            <div className={cn("flex flex-col gap-2 max-w-[80%]", msg.role === 'user' ? "items-end" : "items-start")}>
              <div className={cn(
                "p-5 rounded-[2rem] text-sm shadow-sm leading-relaxed",
                msg.role === 'user' 
                  ? "bg-primary text-white rounded-tr-none" 
                  : "bg-bg-main dark:bg-bg-main text-text-main dark:text-text-main rounded-tl-none border border-border-main dark:border-border-main"
              )}>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-2 px-2">
                  <button 
                    onClick={() => handleSpeak(msg.content, i)}
                    className={cn(
                      "p-2 rounded-xl transition-all",
                      isSpeaking === i ? "text-primary bg-primary/10 dark:bg-primary/20" : "text-text-muted hover:text-primary hover:bg-bg-main dark:hover:bg-bg-main"
                    )}
                    title="Listen"
                  >
                    <Volume2 className={cn("w-4 h-4", isSpeaking === i && "animate-pulse")} />
                  </button>
                  <button 
                    onClick={() => handleCopy(msg.content, i)}
                    className="p-2 rounded-xl text-text-muted hover:text-primary hover:bg-bg-main dark:hover:bg-bg-main transition-all"
                    title="Copy"
                  >
                    {copiedIndex === i ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-2xl bg-bg-main dark:bg-bg-main flex items-center justify-center shrink-0 border border-border-main dark:border-border-main shadow-sm">
              <Bot className="w-5 h-5 text-primary dark:text-primary-light" />
            </div>
            <div className="bg-bg-main dark:bg-bg-main p-5 rounded-[2rem] rounded-tl-none border border-border-main dark:border-border-main shadow-sm">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-border-main dark:border-border-main bg-bg-card dark:bg-bg-card">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your question..."
            className="flex-1 px-6 py-4 bg-bg-main dark:bg-bg-main border border-border-main dark:border-border-main rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm text-text-main dark:text-text-main font-medium placeholder:text-text-muted"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-4 bg-primary text-white rounded-2xl hover:bg-primary-light disabled:opacity-50 transition-all shadow-xl shadow-primary/20 dark:shadow-none flex items-center justify-center"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
