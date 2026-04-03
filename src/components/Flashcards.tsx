import React, { useState } from 'react';
import { Plus, Trash2, ChevronLeft, ChevronRight, Rotate3d } from 'lucide-react';
import { Flashcard } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function Flashcards() {
  const [cards, setCards] = useState<Flashcard[]>([
    { id: '1', front: 'What is photosynthesis?', back: 'The process by which plants use sunlight, water, and carbon dioxide to create oxygen and energy in the form of sugar.' },
    { id: '2', front: 'Newton\'s First Law', back: 'An object at rest remains at rest, and an object in motion remains in motion at constant speed and in a straight line unless acted on by an unbalanced force.' }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const addCard = () => {
    if (!newFront.trim() || !newBack.trim()) return;
    const newCard: Flashcard = {
      id: Date.now().toString(),
      front: newFront,
      back: newBack
    };
    setCards([...cards, newCard]);
    setNewFront('');
    setNewBack('');
    setIsAdding(false);
  };

  const deleteCard = (id: string) => {
    const updated = cards.filter(c => c.id !== id);
    setCards(updated);
    if (currentIndex >= updated.length) {
      setCurrentIndex(Math.max(0, updated.length - 1));
    }
  };

  const nextCard = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <div className="flex flex-col h-full bg-bg-card dark:bg-bg-card rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-border-main dark:border-border-main p-8 transition-all">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Rotate3d className="w-6 h-6 text-primary dark:text-primary-light" />
          </div>
          <div>
            <h2 className="text-xl font-black text-text-main dark:text-text-main">Flashcards</h2>
            <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Active Recall</p>
          </div>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-2xl text-sm font-black hover:bg-primary-light transition-all shadow-xl shadow-primary/20 dark:shadow-none uppercase tracking-widest"
        >
          <Plus className="w-4 h-4" />
          Add Card
        </button>
      </div>

      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 bg-bg-main dark:bg-bg-main rounded-[2rem] space-y-4 border border-border-main dark:border-border-main shadow-inner"
        >
          <input
            placeholder="Front (Question)"
            value={newFront}
            onChange={(e) => setNewFront(e.target.value)}
            className="w-full px-5 py-3 bg-bg-card dark:bg-bg-card border border-border-main dark:border-border-main rounded-xl text-sm text-text-main dark:text-text-main focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium placeholder:text-text-muted"
          />
          <textarea
            placeholder="Back (Answer)"
            value={newBack}
            onChange={(e) => setNewBack(e.target.value)}
            className="w-full px-5 py-3 bg-bg-card dark:bg-bg-card border border-border-main dark:border-border-main rounded-xl text-sm h-24 text-text-main dark:text-text-main focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium placeholder:text-text-muted"
          />
          <div className="flex gap-3">
            <button onClick={addCard} className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-black hover:bg-primary-light transition-all shadow-lg shadow-primary/20 dark:shadow-none uppercase tracking-widest">Save Card</button>
            <button onClick={() => setIsAdding(false)} className="flex-1 py-3 bg-bg-card dark:bg-bg-card text-text-muted dark:text-text-muted rounded-xl text-sm font-black hover:bg-bg-main dark:hover:bg-bg-main transition-all border border-border-main dark:border-border-main uppercase tracking-widest">Cancel</button>
          </div>
        </motion.div>
      )}

      {cards.length > 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div
            className="relative w-full max-w-md aspect-[3/2] cursor-pointer perspective-1000 group"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <motion.div
              className="w-full h-full relative transition-all duration-500 preserve-3d"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              {/* Front */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-bg-card dark:from-primary/20 dark:to-bg-card border-2 border-primary/20 dark:border-primary/30 rounded-[2.5rem] p-10 flex items-center justify-center text-center backface-hidden shadow-2xl shadow-primary/10 dark:shadow-none">
                <p className="text-2xl font-black text-text-main dark:text-text-main leading-tight">{cards[currentIndex].front}</p>
                <div className="absolute bottom-6 right-6 p-3 bg-bg-card dark:bg-bg-card rounded-2xl shadow-sm text-primary dark:text-primary-light border border-border-main dark:border-border-main">
                  <Rotate3d className="w-6 h-6" />
                </div>
              </div>
              {/* Back */}
              <div className="absolute inset-0 bg-bg-card dark:bg-bg-card border-2 border-border-main dark:border-border-main rounded-[2.5rem] p-10 flex items-center justify-center text-center backface-hidden rotate-y-180 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                <p className="text-lg font-medium text-text-main dark:text-text-main leading-relaxed">{cards[currentIndex].back}</p>
              </div>
            </motion.div>
          </div>

          <div className="flex items-center gap-8 mt-12">
            <button onClick={prevCard} className="p-4 bg-bg-main dark:bg-bg-main rounded-2xl hover:bg-bg-card dark:hover:bg-bg-card transition-all shadow-sm border border-border-main dark:border-border-main group">
              <ChevronLeft className="w-8 h-8 text-text-muted dark:text-text-muted group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="px-6 py-2 bg-bg-main dark:bg-bg-main rounded-full border border-border-main dark:border-border-main">
              <span className="text-sm font-black text-text-muted dark:text-text-muted tabular-nums tracking-widest">
                {currentIndex + 1} / {cards.length}
              </span>
            </div>
            <button onClick={nextCard} className="p-4 bg-bg-main dark:bg-bg-main rounded-2xl hover:bg-bg-card dark:hover:bg-bg-card transition-all shadow-sm border border-border-main dark:border-border-main group">
              <ChevronRight className="w-8 h-8 text-text-muted dark:text-text-muted group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <button
            onClick={() => deleteCard(cards[currentIndex].id)}
            className="mt-10 text-text-muted/50 dark:text-text-muted/50 hover:text-danger transition-all p-3 rounded-2xl hover:bg-danger/10 dark:hover:bg-danger/20 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest"
          >
            <Trash2 className="w-5 h-5" />
            Delete Card
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-bg-main dark:bg-bg-main rounded-full flex items-center justify-center mb-6">
            <Rotate3d className="w-12 h-12 text-text-muted opacity-40" />
          </div>
          <h3 className="text-xl font-black text-text-main dark:text-text-main mb-2">No flashcards yet</h3>
          <p className="text-text-muted dark:text-text-muted text-sm italic">Add some to start your active recall session!</p>
        </div>
      )}
    </div>
  );
}
