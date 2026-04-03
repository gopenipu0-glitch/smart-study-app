import React, { useState } from 'react';
import { summarizeText } from '../lib/gemini';
import ReactMarkdown from 'react-markdown';
import { FileText, Loader2, Copy, Check, RefreshCw, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

export default function NoteSummarizer() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    if (!text.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const result = await summarizeText(text);
      setSummary(result || "I'm sorry, I couldn't summarize that.");
    } catch (error) {
      setSummary("Error: " + (error instanceof Error ? error.message : "Failed to summarize."));
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-bg-card dark:bg-bg-card rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-border-main dark:border-border-main p-8 transition-all">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-primary dark:text-primary-light" />
          </div>
          <div>
            <h2 className="text-xl font-black text-text-main dark:text-text-main">Note Summarizer</h2>
            <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">AI Assistance</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5 bg-warning/10 dark:bg-warning/20 rounded-full border border-warning/20 dark:border-warning/30 shadow-sm">
          <Sparkles className="w-3 h-3 text-warning dark:text-warning" />
          <span className="text-[10px] font-black text-warning dark:text-warning uppercase tracking-widest">AI Powered</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between px-2">
            <label className="text-[10px] font-black text-text-muted dark:text-text-muted uppercase tracking-widest">Input Notes</label>
            <span className="text-[10px] font-bold text-text-muted/50 dark:text-text-muted/50 uppercase tracking-widest">{text.length} characters</span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your long study notes or textbook text here..."
            className="flex-1 p-6 bg-bg-main dark:bg-bg-main border border-border-main dark:border-border-main rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm resize-none text-text-main dark:text-text-main font-medium leading-relaxed shadow-inner placeholder:text-text-muted"
          />
          <button
            onClick={handleSummarize}
            disabled={isLoading || !text.trim()}
            className="w-full py-5 bg-primary text-white rounded-[1.5rem] font-black hover:bg-primary-light transition-all shadow-2xl shadow-primary/20 dark:shadow-none disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Summarizing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Summarize Now
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center px-2">
            <label className="text-[10px] font-black text-text-muted dark:text-text-muted uppercase tracking-widest">AI Summary</label>
            {summary && (
              <div className="flex items-center gap-2">
                <button
                  onClick={copyToClipboard}
                  className="p-2.5 bg-bg-main dark:bg-bg-main border border-border-main dark:border-border-main rounded-xl text-text-muted hover:text-primary transition-all shadow-sm"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {
                    setSummary('');
                    setText('');
                  }}
                  className="p-2.5 bg-bg-main dark:bg-bg-main border border-border-main dark:border-border-main rounded-xl text-text-muted hover:text-danger transition-all shadow-sm"
                  title="Clear all"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          <div className="flex-1 p-8 bg-primary/5 dark:bg-primary/5 border border-primary/10 dark:border-primary/10 rounded-[2rem] overflow-y-auto text-sm text-text-main dark:text-text-main prose prose-sm dark:prose-invert max-w-none shadow-inner custom-scrollbar">
            {summary ? (
              <ReactMarkdown>{summary}</ReactMarkdown>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-text-muted dark:text-text-muted italic text-center">
                <div className="w-20 h-20 bg-bg-main dark:bg-bg-main rounded-full flex items-center justify-center mb-6">
                  <FileText className="w-10 h-10 text-text-muted opacity-20" />
                </div>
                <p className="font-medium">Your AI-generated summary will appear here.</p>
                <p className="text-[10px] uppercase tracking-widest mt-2 not-italic font-black opacity-50">Ready to process your notes</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
