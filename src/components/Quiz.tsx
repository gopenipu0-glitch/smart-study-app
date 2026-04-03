import React, { useState } from 'react';
import { generateQuiz } from '../lib/gemini';
import { QuizQuestion } from '../types';
import { Brain, Loader2, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function Quiz() {
  const [topic, setTopic] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const startQuiz = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    try {
      const data = await generateQuiz(topic, questionCount);
      setQuestions(data.questions || []);
      setCurrentStep(0);
      setScore(0);
      setShowResults(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const questionOptions = [5, 10, 15, 25, 30];

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    if (index === questions[currentStep].correctAnswer) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setShowResults(true);
        // Save to history
        const history = JSON.parse(localStorage.getItem('quiz_history') || '[]');
        history.push({ topic, score: score + (selectedAnswer === questions[currentStep].correctAnswer ? 1 : 0), date: new Date().toISOString() });
        localStorage.setItem('quiz_history', JSON.stringify(history));
      }
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-bg-card dark:bg-bg-card rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-border-main dark:border-border-main p-12">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
          <Loader2 className="w-16 h-16 animate-spin text-primary dark:text-primary-light relative z-10" />
        </div>
        <p className="text-text-main dark:text-text-main font-black mt-8 uppercase tracking-widest text-sm">Generating your quiz...</p>
        <p className="text-text-muted dark:text-text-muted text-xs mt-2 font-bold uppercase tracking-tighter">AI is crafting questions for you</p>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-bg-card dark:bg-bg-card rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-border-main dark:border-border-main p-12 text-center">
        <div className="w-24 h-24 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-8 relative">
          <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full animate-pulse" />
          <Brain className="w-12 h-12 text-primary dark:text-primary-light relative z-10" />
        </div>
        <h2 className="text-3xl font-black text-text-main dark:text-text-main mb-2">Quiz Complete!</h2>
        <div className="px-6 py-2 bg-bg-main dark:bg-bg-main rounded-full mb-8 border border-border-main dark:border-border-main">
          <p className="text-text-main dark:text-text-main font-black uppercase tracking-widest text-sm">You scored {score} out of {questions.length}</p>
        </div>
        <button
          onClick={() => {
            setQuestions([]);
            setTopic('');
            setShowResults(false);
          }}
          className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-black hover:bg-primary-light transition-all shadow-2xl shadow-primary/20 dark:shadow-none uppercase tracking-widest text-sm"
        >
          <RefreshCw className="w-5 h-5" />
          Try Another Topic
        </button>
      </div>
    );
  }

  if (questions.length > 0) {
    const current = questions[currentStep];
    return (
      <div className="flex flex-col h-full bg-bg-card dark:bg-bg-card rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-border-main dark:border-border-main p-8">
        <div className="flex justify-between items-center mb-10">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-primary dark:text-primary-light uppercase tracking-widest">Question {currentStep + 1} of {questions.length}</span>
            <h2 className="text-xl font-black text-text-main dark:text-text-main">Knowledge Check</h2>
          </div>
          <div className="h-3 w-40 bg-bg-main dark:bg-bg-main rounded-full overflow-hidden border border-border-main dark:border-border-main">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              className="h-full bg-primary transition-all duration-500"
            />
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-2xl font-black text-text-main dark:text-text-main mb-10 leading-tight">{current.question}</h3>

          <div className="grid gap-4">
            {current.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={selectedAnswer !== null}
                className={cn(
                  "w-full p-6 rounded-3xl border-2 text-left transition-all flex items-center justify-between group",
                  selectedAnswer === null ? "border-border-main dark:border-border-main hover:border-primary/50 dark:hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/5" :
                  i === current.correctAnswer ? "border-success bg-success/10 dark:bg-success/20 text-success" :
                  selectedAnswer === i ? "border-danger bg-danger/10 dark:bg-danger/20 text-danger" : "border-border-main dark:border-border-main opacity-50"
                )}
              >
                <span className="font-bold text-lg">{option}</span>
                <div className="shrink-0 ml-4">
                  {selectedAnswer !== null && i === current.correctAnswer && <CheckCircle2 className="w-6 h-6 text-success" />}
                  {selectedAnswer === i && i !== current.correctAnswer && <XCircle className="w-6 h-6 text-danger" />}
                  {selectedAnswer === null && <div className="w-6 h-6 rounded-full border-2 border-border-main dark:border-border-main group-hover:border-primary transition-colors" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-bg-card dark:bg-bg-card rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-border-main dark:border-border-main p-12 text-center">
      <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-8 relative">
        <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full" />
        <Brain className="w-10 h-10 text-primary dark:text-primary-light relative z-10" />
      </div>
      <h2 className="text-3xl font-black text-text-main dark:text-text-main mb-3">AI Quiz Generator</h2>
      <p className="text-text-muted dark:text-text-muted text-sm mb-10 max-w-xs font-medium">Enter a topic and our AI will create a personalized quiz for you to test your knowledge.</p>

      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-text-muted uppercase tracking-widest block text-left ml-2">Number of Questions</label>
          <div className="flex flex-wrap justify-center gap-2">
            {questionOptions.map((count) => (
              <button
                key={count}
                onClick={() => setQuestionCount(count)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-black transition-all border-2",
                  questionCount === count 
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                    : "bg-bg-main dark:bg-bg-main text-text-muted border-border-main dark:border-border-main hover:border-primary/50"
                )}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Quantum Physics, World History..."
          className="w-full px-6 py-4 bg-bg-main dark:bg-bg-main border border-border-main dark:border-border-main rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-text-main dark:text-text-main placeholder:text-text-muted"
        />
        <button
          onClick={startQuiz}
          className="w-full py-4 bg-primary text-white rounded-2xl font-black hover:bg-primary-light transition-all shadow-2xl shadow-primary/20 dark:shadow-none uppercase tracking-widest text-sm"
        >
          Generate Quiz
        </button>
      </div>
    </div>
  );
}
