import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, BookOpen, Timer } from 'lucide-react';
import { cn } from '../lib/utils';

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(() => {
    return parseInt(localStorage.getItem('study_time_total') || '0');
  });

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        setTotalSeconds(prev => {
          const next = prev + 1;
          localStorage.setItem('study_time_total', next.toString());
          return next;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setIsBreak(!isBreak);
      setTimeLeft(isBreak ? 25 * 60 : 5 * 60);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = timeLeft / (isBreak ? 5 * 60 : 25 * 60);

  return (
    <div className="flex flex-col h-full bg-bg-card dark:bg-bg-card rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-border-main dark:border-border-main p-8 transition-all">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <Timer className="w-6 h-6 text-primary dark:text-primary-light" />
        </div>
        <div>
          <h2 className="text-xl font-black text-text-main dark:text-text-main">Focus Timer</h2>
          <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Deep Work Session</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative w-72 h-72 mb-10 group">
          <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-colors duration-700" />
          <svg className="w-full h-full transform -rotate-90 relative z-10">
            <circle
              cx="144"
              cy="144"
              r="130"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-bg-main dark:text-bg-main"
            />
            <circle
              cx="144"
              cy="144"
              r="130"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 130}
              strokeDashoffset={2 * Math.PI * 130 * (1 - progress)}
              strokeLinecap="round"
              className={cn(
                "transition-all duration-1000",
                isBreak ? "text-success" : "text-primary dark:text-primary-light"
              )}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <span className="text-6xl font-black text-text-main dark:text-text-main tabular-nums tracking-tighter">{formatTime(timeLeft)}</span>
            <div className="flex items-center gap-2 mt-3 px-4 py-1.5 bg-bg-main dark:bg-bg-main rounded-full border border-border-main dark:border-border-main shadow-sm">
              {isBreak ? <Coffee className="w-4 h-4 text-success" /> : <BookOpen className="w-4 h-4 text-primary" />}
              <span className="text-[10px] font-black text-text-muted dark:text-text-muted uppercase tracking-widest">
                {isBreak ? 'Break Time' : 'Focus Session'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          <button
            onClick={toggleTimer}
            className={cn(
              "p-6 rounded-[2rem] transition-all shadow-2xl flex items-center justify-center",
              isActive 
                ? "bg-warning hover:bg-warning/80 text-white shadow-warning/20 dark:shadow-none" 
                : "bg-primary hover:bg-primary-light text-white shadow-primary/20 dark:shadow-none"
            )}
          >
            {isActive ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10" />}
          </button>
          <button
            onClick={resetTimer}
            className="p-6 bg-bg-main dark:bg-bg-main text-text-muted dark:text-text-muted rounded-[2rem] hover:bg-bg-card dark:hover:bg-bg-card transition-all shadow-sm border border-border-main dark:border-border-main flex items-center justify-center"
          >
            <RotateCcw className="w-10 h-10" />
          </button>
        </div>

        <div className="mt-12 p-6 bg-primary/10 dark:bg-primary/10 rounded-[2rem] border border-primary/20 dark:border-primary/20 flex items-center gap-4 w-full max-w-xs">
          <div className="w-12 h-12 bg-bg-card dark:bg-bg-card rounded-2xl shadow-sm flex items-center justify-center shrink-0 border border-border-main dark:border-border-main">
            <BookOpen className="w-6 h-6 text-primary dark:text-primary-light" />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-black text-text-muted dark:text-text-muted uppercase tracking-widest">Total Study Time</p>
            <p className="text-xl font-black text-primary dark:text-primary-light tabular-nums">{Math.floor(totalSeconds / 60)}m {totalSeconds % 60}s</p>
          </div>
        </div>
      </div>
    </div>
  );
}
