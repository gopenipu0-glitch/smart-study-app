import React, { useState, useEffect } from 'react';
import { MessageSquare, Timer, Library, BrainCircuit, Github, ListTodo, FileText, BarChart3, GraduationCap, Sun, Moon, ChevronRight, CheckCircle, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StudyMode } from './types';
import StudyChat from './components/StudyChat';
import PomodoroTimer from './components/PomodoroTimer';
import Flashcards from './components/Flashcards';
import Quiz from './components/Quiz';
import StudyPlanner from './components/StudyPlanner';
import NoteSummarizer from './components/NoteSummarizer';
import StudyStats from './components/StudyStats';
import ExamMode from './components/ExamMode';
import { UserProfile } from './components/UserProfile';
import Logo from './components/Logo';
import { cn } from './lib/utils';

export default function App() {
  const [mode, setMode] = useState<StudyMode>('chat');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('dark_mode');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('dark_mode', isDarkMode.toString());
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogin = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      setIsLoggedIn(true);
      setIsLoggingIn(false);
    }, 2000);
  };

  const navItems = [
    { id: 'chat', label: 'AI Tutor', icon: MessageSquare, color: 'text-primary', bg: 'bg-primary/10' },
    { id: 'timer', label: 'Focus Timer', icon: Timer, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { id: 'planner', label: 'Study Planner', icon: ListTodo, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { id: 'flashcards', label: 'Flashcards', icon: Library, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { id: 'quiz', label: 'AI Quiz', icon: BrainCircuit, color: 'text-primary-light', bg: 'bg-primary-light/10' },
    { id: 'exam', label: 'Exam Mode', icon: GraduationCap, color: 'text-primary', bg: 'bg-primary/10' },
    { id: 'summarizer', label: 'Summarizer', icon: FileText, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { id: 'stats', label: 'Analytics', icon: BarChart3, color: 'text-fuchsia-500', bg: 'bg-fuchsia-500/10' },
    { id: 'profile', label: 'Profile', icon: User, color: 'text-primary', bg: 'bg-primary/10' },
  ];

  if (!isLoggedIn) {
    return (
      <div className={cn(
        "min-h-screen flex items-center justify-center p-4 transition-colors duration-500",
        isDarkMode ? "bg-bg-main" : "bg-slate-50"
      )}>
        <AnimatePresence mode="wait">
          {isLoggingIn ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="relative w-24 h-24">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Logo size="md" />
                </div>
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold text-text-main dark:text-text-main">Preparing your desk...</h2>
                <p className="text-text-muted dark:text-text-muted text-sm">SmartStudy AI is getting ready</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-8 rounded-[2.5rem] border shadow-2xl transition-colors",
                isDarkMode ? "bg-bg-card border-border-main" : "bg-white border-slate-100"
              )}
            >
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <Logo size="md" className="shadow-xl shadow-primary/20 dark:shadow-none" />
                  <h1 className="text-2xl font-black tracking-tight text-text-main dark:text-text-main">SmartStudy AI</h1>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl font-black leading-tight text-text-main dark:text-white">
                    Master any subject with <span className="text-primary dark:text-primary-light">AI Power.</span>
                  </h2>
                  <p className="text-text-muted dark:text-text-muted text-lg leading-relaxed">
                    Personalized AI tutoring, smart flashcards, and focus tools designed to help you excel in your studies.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleLogin}
                    className="px-8 py-4 bg-primary hover:bg-primary-light text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-primary/20 dark:shadow-none flex items-center justify-center gap-2 group"
                  >
                    Get Started Free
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={cn(
                      "px-8 py-4 rounded-2xl font-bold text-lg border transition-all flex items-center justify-center gap-2",
                      isDarkMode ? "bg-bg-main border-border-main text-text-main" : "bg-white border-slate-200 text-slate-600"
                    )}
                  >
                    {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    {isDarkMode ? "Light Mode" : "Dark Mode"}
                  </button>
                </div>

                <p className="text-xs text-text-muted font-medium uppercase tracking-widest">Created by Ayon Gope</p>
              </div>

              <div className="relative hidden md:block">
                <div className="absolute -inset-10 bg-primary/20 blur-[100px] rounded-full animate-pulse" />
                <div className="absolute -inset-10 bg-primary-light/10 blur-[80px] rounded-full translate-x-20 translate-y-20" />
                
                <div className="relative grid grid-cols-2 gap-6">
                  {navItems.slice(0, 4).map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.8, rotate: i % 2 === 0 ? -5 : 5 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ 
                        delay: i * 0.1,
                        type: "spring",
                        stiffness: 260,
                        damping: 20
                      }}
                      whileHover={{ y: -5, scale: 1.05 }}
                      className={cn(
                        "p-8 rounded-[2.5rem] border shadow-xl flex flex-col items-center gap-4 text-center backdrop-blur-sm transition-all",
                        isDarkMode ? "bg-bg-card/40 border-border-main/50" : "bg-white/60 border-slate-100"
                      )}
                    >
                      <div className={cn("p-4 rounded-2xl shadow-inner", item.bg)}>
                        <item.icon className={cn("w-8 h-8", item.color)} />
                      </div>
                      <div>
                        <span className="block text-sm font-black text-text-main dark:text-text-main">{item.label}</span>
                        <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Feature</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-10 -right-10 p-4 bg-bg-card dark:bg-bg-card rounded-2xl shadow-2xl border border-border-main dark:border-border-main flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-bold text-text-main dark:text-text-main">Goal Achieved!</span>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300 font-sans selection:bg-primary/20 selection:text-primary",
      isDarkMode ? "bg-bg-main text-text-main" : "bg-[#F8FAFC] text-slate-900"
    )}>
      {/* Header */}
      <header className={cn(
        "sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300",
        isDarkMode ? "header-gradient border-border-main" : "bg-white/80 border-slate-200"
      )}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo size="sm" />
            <div>
              <h1 className={cn("font-black text-lg tracking-tight", isDarkMode ? "text-white" : "text-primary")}>SmartStudy AI</h1>
              <p className={cn(
                "text-[10px] uppercase tracking-widest font-bold leading-none",
                isDarkMode ? "text-white/70" : "text-slate-400"
              )}>Created by Ayon Gope</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={cn(
                "p-2 rounded-xl border transition-all",
                isDarkMode ? "bg-white/10 border-white/20 text-amber-400 hover:bg-white/20" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light border-2 border-white shadow-sm" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8 mb-20 md:mb-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <div className={cn(
              "p-6 rounded-[2rem] border shadow-sm transition-colors",
              isDarkMode ? "bg-bg-card border-border-main" : "bg-white border-slate-200"
            )}>
              <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4 px-2">Study Dashboard</h2>
              <div className="space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setMode(item.id as StudyMode)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all group",
                      mode === item.id
                        ? (isDarkMode ? "bg-primary/10 text-primary" : "bg-primary/10 text-primary")
                        : (isDarkMode ? "text-text-muted hover:bg-bg-main" : "text-slate-600 hover:bg-slate-50")
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-xl transition-colors",
                      mode === item.id ? item.bg : "bg-transparent group-hover:bg-slate-100 dark:group-hover:bg-bg-main"
                    )}>
                      <item.icon className={cn("w-5 h-5", mode === item.id ? item.color : "text-text-muted")} />
                    </div>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary to-primary-light p-6 rounded-[2rem] text-white shadow-xl shadow-primary/20 dark:shadow-none relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <h3 className="font-black mb-2 relative z-10">Pro Tip</h3>
              <p className="text-sm text-white/90 leading-relaxed relative z-10">
                Use the Pomodoro timer to maintain high focus levels during long study sessions.
              </p>
            </div>
          </aside>

          {/* Viewport */}
          <section className="lg:col-span-9 min-h-[500px] md:min-h-[600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.02, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="h-full"
              >
                {mode === 'chat' && <StudyChat />}
                {mode === 'timer' && <PomodoroTimer />}
                {mode === 'planner' && <StudyPlanner />}
                {mode === 'flashcards' && <Flashcards />}
                {mode === 'quiz' && <Quiz />}
                {mode === 'exam' && <ExamMode />}
                {mode === 'summarizer' && <NoteSummarizer />}
                {mode === 'stats' && <StudyStats />}
                {mode === 'profile' && <UserProfile />}
              </motion.div>
            </AnimatePresence>
          </section>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className={cn(
        "fixed bottom-0 left-0 right-0 z-50 md:hidden border-t px-2 py-2 flex items-center justify-around backdrop-blur-xl transition-colors",
        isDarkMode ? "bg-bg-main/90 border-border-main" : "bg-white/90 border-slate-200"
      )}>
        {navItems.slice(0, 5).map((item) => (
          <button
            key={item.id}
            onClick={() => setMode(item.id as StudyMode)}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-2xl transition-all",
              mode === item.id ? "text-primary" : "text-text-muted"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-tighter">{item.label.split(' ')[0]}</span>
          </button>
        ))}
        <button
          onClick={() => setMode(mode === 'exam' ? 'chat' : 'exam')}
          className={cn(
            "flex flex-col items-center gap-1 p-2 rounded-2xl transition-all",
            ['exam', 'summarizer', 'stats'].includes(mode) ? "text-primary" : "text-text-muted"
          )}
        >
          <GraduationCap className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Exam</span>
        </button>
        <button
          onClick={() => setMode('profile')}
          className={cn(
            "flex flex-col items-center gap-1 p-2 rounded-2xl transition-all",
            mode === 'profile' ? "text-primary" : "text-text-muted"
          )}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Profile</span>
        </button>
      </nav>

      {/* Footer */}
      <footer className={cn(
        "mt-auto py-8 border-t transition-colors",
        isDarkMode ? "bg-bg-card border-border-main" : "bg-white border-slate-200"
      )}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
            <span className={cn("font-bold", isDarkMode ? "text-text-main" : "text-slate-900")}>SmartStudy AI</span>
          </div>
          <p className="text-sm text-text-muted">
            Created with ❤️ by <span className={cn("font-bold", isDarkMode ? "text-text-main" : "text-slate-900")}>Ayon Gope</span>
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className={cn("transition-colors", isDarkMode ? "text-text-muted hover:text-text-main" : "text-slate-400 hover:text-slate-900")}>
              <Github className="w-5 h-5" />
            </a>
            <span className="text-xs text-text-muted">© 2026 SmartStudy AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
