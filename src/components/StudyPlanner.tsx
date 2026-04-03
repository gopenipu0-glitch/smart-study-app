import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Circle, ListTodo } from 'lucide-react';
import { StudyTask } from '../types';
import { cn } from '../lib/utils';

export default function StudyPlanner() {
  const [tasks, setTasks] = useState<StudyTask[]>(() => {
    const saved = localStorage.getItem('study_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    localStorage.setItem('study_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.trim()) return;
    const task: StudyTask = {
      id: Date.now().toString(),
      text: newTask,
      completed: false,
    };
    setTasks([...tasks, task]);
    setNewTask('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="flex flex-col h-full bg-bg-card dark:bg-bg-card rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-border-main dark:border-border-main p-8 transition-all">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <ListTodo className="w-6 h-6 text-primary dark:text-primary-light" />
        </div>
        <div>
          <h2 className="text-xl font-black text-text-main dark:text-text-main">Study Planner</h2>
          <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Goals & Tasks</p>
        </div>
      </div>

      <div className="flex gap-3 mb-8">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          placeholder="Add a new study goal..."
          className="flex-1 px-6 py-4 bg-bg-main dark:bg-bg-main border border-border-main dark:border-border-main rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm text-text-main dark:text-text-main font-medium placeholder:text-text-muted"
        />
        <button
          onClick={addTask}
          className="p-4 bg-primary text-white rounded-2xl hover:bg-primary-light transition-all shadow-xl shadow-primary/20 dark:shadow-none flex items-center justify-center"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {tasks.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-bg-main dark:bg-bg-main rounded-full flex items-center justify-center mx-auto mb-6">
              <ListTodo className="w-10 h-10 text-text-muted opacity-20" />
            </div>
            <h3 className="text-lg font-black text-text-main dark:text-text-main mb-2">No goals set yet</h3>
            <p className="text-text-muted dark:text-text-muted text-sm italic">What do you want to achieve today?</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                "flex items-center gap-4 p-5 rounded-2xl border transition-all group",
                task.completed 
                  ? "bg-bg-main dark:bg-bg-main/50 border-border-main dark:border-border-main opacity-60" 
                  : "bg-bg-card dark:bg-bg-card border-border-main dark:border-border-main shadow-sm hover:shadow-md hover:border-primary/30"
              )}
            >
              <button onClick={() => toggleTask(task.id)} className="shrink-0 transition-transform active:scale-90">
                {task.completed ? (
                  <CheckCircle className="w-6 h-6 text-success" />
                ) : (
                  <Circle className="w-6 h-6 text-text-muted/30 dark:text-text-muted/30 group-hover:text-primary" />
                )}
              </button>
              <span className={cn(
                "flex-1 text-sm font-medium transition-all",
                task.completed ? "line-through text-text-muted dark:text-text-muted" : "text-text-main dark:text-text-main"
              )}>
                {task.text}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="p-2 text-text-muted/30 dark:text-text-muted/30 hover:text-danger hover:bg-danger/10 dark:hover:bg-danger/20 rounded-xl transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-border-main dark:border-border-main flex justify-between items-center">
        <div className="flex items-center gap-2 px-4 py-2 bg-bg-main dark:bg-bg-main rounded-full">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-text-muted dark:text-text-muted uppercase tracking-widest">
            {tasks.filter(t => t.completed).length} / {tasks.length} Completed
          </span>
        </div>
        {tasks.length > 0 && (
          <button 
            onClick={() => setTasks(tasks.filter(t => !t.completed))}
            className="text-[10px] font-black text-primary dark:text-primary-light hover:text-primary-light uppercase tracking-widest transition-colors"
          >
            Clear Completed
          </button>
        )}
      </div>
    </div>
  );
}
