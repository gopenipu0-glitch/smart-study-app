export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  topic: string;
  questions: QuizQuestion[];
}

export type StudyMode = 'chat' | 'timer' | 'flashcards' | 'quiz' | 'planner' | 'summarizer' | 'stats' | 'exam' | 'profile';

export interface StudyTask {
  id: string;
  text: string;
  completed: boolean;
}
