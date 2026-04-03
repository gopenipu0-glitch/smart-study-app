import React, { useState } from 'react';
import { generateExam } from '../lib/gemini';
import { QuizQuestion } from '../types';
import { GraduationCap, Loader2, CheckCircle2, XCircle, RefreshCw, BookOpen } from 'lucide-react';
import { cn } from '../lib/utils';

const CLASSES = ['6', '7', '8', '9', '10', 'SSC'];
const SECTIONS = ['Science', 'Commerce', 'Arts'];

const SUBJECT_MAP: Record<string, string[]> = {
  'Junior': ['Bangla', 'English', 'Mathematics', 'Science', 'BGS', 'ICT', 'Religion'],
  'Science': ['Bangla', 'English', 'Mathematics', 'ICT', 'Physics', 'Chemistry', 'Biology', 'Higher Mathematics', 'Religion'],
  'Commerce': ['Bangla', 'English', 'Mathematics', 'ICT', 'Accounting', 'Business Ent.', 'Finance & Banking', 'Science', 'Religion'],
  'Arts': ['Bangla', 'English', 'Mathematics', 'ICT', 'History', 'Geography', 'Civics', 'Economics', 'Science', 'Religion']
};

export default function ExamMode() {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [questionCount, setQuestionCount] = useState(30);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [incorrectQuestions, setIncorrectQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isRetaking, setIsRetaking] = useState(false);

  const isHighSchool = ['9', '10', 'SSC'].includes(selectedClass);

  const getAvailableSubjects = () => {
    if (!selectedClass) return [];
    if (isHighSchool) {
      return selectedSection ? SUBJECT_MAP[selectedSection] : [];
    }
    return SUBJECT_MAP['Junior'];
  };

  const startExam = async () => {
    if (!selectedClass || !selectedSubject) return;
    setIsLoading(true);
    try {
      const data = await generateExam(selectedClass, selectedSubject, questionCount);
      setQuestions(data.questions || []);
      setIncorrectQuestions([]);
      setCurrentStep(0);
      setScore(0);
      setShowResults(false);
      setIsRetaking(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const startRetake = () => {
    setQuestions(incorrectQuestions);
    setIncorrectQuestions([]);
    setCurrentStep(0);
    setScore(0);
    setShowResults(false);
    setIsRetaking(true);
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    const isCorrect = index === questions[currentStep].correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    } else {
      setIncorrectQuestions(prev => [...prev, questions[currentStep]]);
    }

    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setShowResults(true);
        // Save to history only if it's the full exam (not a retake)
        if (!isRetaking) {
          const history = JSON.parse(localStorage.getItem('quiz_history') || '[]');
          const finalScore = score + (isCorrect ? 1 : 0);
          history.push({ 
            topic: isHighSchool ? `Class ${selectedClass} (${selectedSection}) - ${selectedSubject}` : `Class ${selectedClass} - ${selectedSubject}`, 
            score: finalScore, 
            date: new Date().toISOString() 
          });
          localStorage.setItem('quiz_history', JSON.stringify(history));
        }
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
        <p className="text-text-main dark:text-text-main font-black mt-8 uppercase tracking-widest text-sm">Preparing your {questionCount}-question exam paper...</p>
        <p className="text-text-muted dark:text-text-muted text-xs mt-2 font-bold uppercase tracking-tighter">AI is crafting a standard exam for you</p>
      </div>
    );
  }

  if (showResults) {
    const incorrectCount = questions.length - score;
    return (
      <div className="flex flex-col items-center justify-center h-full bg-bg-card dark:bg-bg-card rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-border-main dark:border-border-main p-12 text-center">
        <div className="w-24 h-24 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-8 relative">
          <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full animate-pulse" />
          <GraduationCap className="w-12 h-12 text-primary dark:text-primary-light relative z-10" />
        </div>
        <h2 className="text-3xl font-black text-text-main dark:text-text-main mb-2">Exam Result</h2>
        <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-8">
          <div className="p-4 bg-success/10 dark:bg-success/20 rounded-2xl border border-success/20">
            <p className="text-[10px] font-black text-success uppercase tracking-widest">Correct</p>
            <p className="text-2xl font-black text-success">{score}</p>
          </div>
          <div className="p-4 bg-danger/10 dark:bg-danger/20 rounded-2xl border border-danger/20">
            <p className="text-[10px] font-black text-danger uppercase tracking-widest">Incorrect</p>
            <p className="text-2xl font-black text-danger">{incorrectCount}</p>
          </div>
        </div>
        <div className="px-6 py-2 bg-bg-main dark:bg-bg-main rounded-full mb-8 border border-border-main dark:border-border-main">
          <p className="text-text-main dark:text-text-main font-black uppercase tracking-widest text-sm">Final Score: {score} / {questions.length}</p>
        </div>
        
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {incorrectQuestions.length > 0 && (
            <button
              onClick={startRetake}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-warning text-white rounded-2xl font-black hover:opacity-90 transition-all shadow-xl shadow-warning/20 dark:shadow-none uppercase tracking-widest text-sm"
            >
              <RefreshCw className="w-5 h-5" />
              Re-take Incorrect ({incorrectQuestions.length})
            </button>
          )}
          <button
            onClick={() => {
              setQuestions([]);
              setSelectedClass('');
              setSelectedSubject('');
              setShowResults(false);
              setIsRetaking(false);
            }}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-black hover:bg-primary-light transition-all shadow-xl shadow-primary/20 dark:shadow-none uppercase tracking-widest text-sm"
          >
            <RefreshCw className="w-5 h-5" />
            New Full Exam
          </button>
        </div>
      </div>
    );
  }

  if (questions.length > 0) {
    const current = questions[currentStep];
    return (
      <div className="flex flex-col h-full bg-bg-card dark:bg-bg-card rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-border-main dark:border-border-main p-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <span className="text-[10px] font-black text-primary dark:text-primary-light uppercase tracking-widest block">Question {currentStep + 1} / {questions.length}</span>
            <span className="text-xs text-text-muted dark:text-text-muted font-bold uppercase tracking-tighter">Class {selectedClass} | {selectedSubject}</span>
          </div>
          <div className="h-3 w-40 bg-bg-main dark:bg-bg-main rounded-full overflow-hidden border border-border-main dark:border-border-main">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
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
        <BookOpen className="w-10 h-10 text-primary dark:text-primary-light relative z-10" />
      </div>
      <h2 className="text-3xl font-black text-text-main dark:text-text-main mb-3">Class 6 - SSC Exam Mode</h2>
      <p className="text-text-muted dark:text-text-muted text-sm mb-10 max-w-xs font-medium">Select your class and subject to generate a standard MCQ exam paper.</p>

      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-text-muted uppercase tracking-widest block text-left ml-2">Number of Questions</label>
          <div className="flex flex-wrap justify-center gap-2">
            {[5, 10, 15, 25, 30].map((count) => (
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

        <div className="space-y-3">
          <label className="text-[10px] font-black text-text-muted uppercase tracking-widest block text-left ml-2">Select Class</label>
          <div className="grid grid-cols-3 gap-2">
            {CLASSES.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setSelectedClass(c);
                  setSelectedSection('');
                  setSelectedSubject('');
                }}
                className={cn(
                  "py-3 rounded-xl border-2 text-xs font-black transition-all uppercase tracking-widest",
                  selectedClass === c 
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                    : "bg-bg-main dark:bg-bg-main text-text-muted border-border-main dark:border-border-main hover:border-primary/50"
                )}
              >
                {c === 'SSC' ? 'SSC' : `Class ${c}`}
              </button>
            ))}
          </div>
        </div>

        {isHighSchool && (
          <div className="space-y-3">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest block text-left ml-2">Select Section</label>
            <div className="grid grid-cols-3 gap-2">
              {SECTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSelectedSection(s);
                    setSelectedSubject('');
                  }}
                  className={cn(
                    "py-3 rounded-xl border-2 text-xs font-black transition-all uppercase tracking-widest",
                    selectedSection === s 
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                      : "bg-bg-main dark:bg-bg-main text-text-muted border-border-main dark:border-border-main hover:border-primary/50"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <label className="text-[10px] font-black text-text-muted uppercase tracking-widest block text-left ml-2">Select Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={isHighSchool && !selectedSection}
            className="w-full px-6 py-4 bg-bg-main dark:bg-bg-main border border-border-main dark:border-border-main rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-text-main dark:text-text-main placeholder:text-text-muted disabled:opacity-50"
          >
            <option value="">{isHighSchool && !selectedSection ? 'Select section first' : 'Choose a subject...'}</option>
            {getAvailableSubjects().map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <button
          onClick={startExam}
          disabled={!selectedClass || !selectedSubject || (isHighSchool && !selectedSection)}
          className="w-full py-4 bg-primary text-white rounded-2xl font-black hover:bg-primary-light transition-all shadow-2xl shadow-primary/20 dark:shadow-none uppercase tracking-widest text-sm disabled:opacity-50"
        >
          Start Exam
        </button>
      </div>
    </div>
  );
}
