import React, { useState, useEffect } from 'react';
import { BarChart3, Clock, Trophy, Target, TrendingUp } from 'lucide-react';
import { cn } from '../lib/utils';

export default function StudyStats() {
  const [stats, setStats] = useState({
    totalMinutes: 0,
    quizzesTaken: 0,
    averageScore: 0,
    tasksCompleted: 0,
  });

  useEffect(() => {
    const studyTime = localStorage.getItem('study_time_total') || '0';
    const quizHistory = JSON.parse(localStorage.getItem('quiz_history') || '[]');
    const tasks = JSON.parse(localStorage.getItem('study_tasks') || '[]');
    
    const totalMinutes = Math.floor(parseInt(studyTime) / 60);
    const quizzesTaken = quizHistory.length;
    const totalScore = quizHistory.reduce((acc: number, curr: any) => acc + curr.score, 0);
    const averageScore = quizzesTaken > 0 ? Math.round((totalScore / (quizzesTaken * 5)) * 100) : 0;
    const tasksCompleted = tasks.filter((t: any) => t.completed).length;

    setStats({
      totalMinutes,
      quizzesTaken,
      averageScore,
      tasksCompleted,
    });
  }, []);

  const cards = [
    { label: 'Study Time', value: `${stats.totalMinutes}m`, icon: Clock, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Quizzes', value: stats.quizzesTaken, icon: Trophy, color: 'text-warning', bg: 'bg-warning/10' },
    { label: 'Avg. Score', value: `${stats.averageScore}%`, icon: Target, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Tasks Done', value: stats.tasksCompleted, icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
  ];

  return (
    <div className="flex flex-col h-full bg-bg-card dark:bg-bg-card rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-border-main dark:border-border-main p-8 transition-all">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-primary dark:text-primary-light" />
        </div>
        <div>
          <h2 className="text-xl font-black text-text-main dark:text-text-main">Study Analytics</h2>
          <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Performance Tracking</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map((card, i) => (
          <div key={i} className="p-6 rounded-[2rem] border border-border-main dark:border-border-main bg-bg-main dark:bg-bg-main shadow-sm flex flex-col items-center text-center transition-all hover:shadow-md hover:scale-[1.02] group">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-inner transition-transform group-hover:scale-110",
              card.bg,
              card.color
            )}>
              <card.icon className="w-6 h-6" />
            </div>
            <span className="text-3xl font-black text-text-main dark:text-text-main tabular-nums tracking-tighter">{card.value}</span>
            <span className="text-[10px] font-black text-text-muted dark:text-text-muted uppercase tracking-widest mt-2">{card.label}</span>
          </div>
        ))}
      </div>

      <div className="flex-1 bg-primary/5 dark:bg-primary/5 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center border border-primary/10 dark:border-primary/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/10 transition-colors" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl group-hover:bg-primary/10 transition-colors" />
        
        <div className="w-20 h-20 bg-bg-card dark:bg-bg-card rounded-full flex items-center justify-center shadow-xl mb-6 border border-border-main dark:border-border-main relative z-10">
          <TrendingUp className="w-10 h-10 text-primary dark:text-primary-light" />
        </div>
        <h3 className="text-2xl font-black text-text-main dark:text-text-main mb-3 relative z-10">Keep it up!</h3>
        <p className="text-sm text-text-muted dark:text-text-muted max-w-xs font-medium leading-relaxed relative z-10">
          Consistency is key to mastering new subjects. Track your progress daily to see how far you've come.
        </p>
        <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-bg-card dark:bg-bg-card rounded-full shadow-sm border border-border-main dark:border-border-main relative z-10">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-text-muted dark:text-text-muted uppercase tracking-widest">Active Streak: 5 Days</span>
        </div>
      </div>
    </div>
  );
}
