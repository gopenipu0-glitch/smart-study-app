import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Target, 
  Settings, 
  Bell, 
  BookOpen, 
  Clock, 
  Award, 
  Save,
  CheckCircle2,
  Moon,
  Sun,
  Zap
} from 'lucide-react';

interface UserProfileProps {
  onUpdate?: (data: any) => void;
}

export function UserProfile({ onUpdate }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Alex Johnson',
    email: 'alex.j@example.com',
    studyGoal: 'Master Advanced Mathematics',
    dailyTarget: 4, // hours
    preferredMode: 'Focus', // Focus, Collaborative, Relaxed
    notifications: {
      email: true,
      push: true,
      studyReminders: true
    },
    stats: {
      totalHours: 128,
      cardsMastered: 450,
      quizzesPassed: 32,
      streak: 12
    }
  });

  const handleSave = () => {
    setIsEditing(false);
    if (onUpdate) onUpdate(profile);
  };

  const studyModes = [
    { id: 'Focus', icon: Zap, color: 'text-primary' },
    { id: 'Collaborative', icon: User, color: 'text-secondary' },
    { id: 'Relaxed', icon: Sun, color: 'text-accent' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-bg-card dark:bg-bg-card rounded-3xl p-8 border border-border-main dark:border-border-main shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 dark:bg-primary/20 blur-3xl -mr-32 -mt-32 rounded-full" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary p-1">
              <div className="w-full h-full rounded-full bg-bg-card dark:bg-bg-card flex items-center justify-center overflow-hidden">
                <User className="w-16 h-16 text-primary" />
              </div>
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform">
              <Settings className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
              {isEditing ? (
                <input 
                  type="text" 
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="text-3xl font-black bg-bg-main dark:bg-bg-main border border-border-main dark:border-border-main rounded-xl px-4 py-1 outline-none focus:ring-2 ring-primary/50"
                />
              ) : (
                <h1 className="text-4xl font-black text-text-main dark:text-text-main tracking-tight">
                  {profile.name}
                </h1>
              )}
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-black uppercase tracking-widest rounded-full self-center">
                Pro Member
              </span>
            </div>
            <p className="text-text-muted dark:text-text-muted mb-4">{profile.email}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-bg-main dark:bg-bg-main rounded-2xl border border-border-main dark:border-border-main">
                <Award className="w-4 h-4 text-accent" />
                <span className="text-sm font-bold text-text-main dark:text-text-main">Level 24 Scholar</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-bg-main dark:bg-bg-main rounded-2xl border border-border-main dark:border-border-main">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold text-text-main dark:text-text-main">{profile.stats.streak} Day Streak</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-2xl font-black flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
          >
            {isEditing ? <Save className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Progress & Stats */}
        <div className="lg:col-span-1 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-bg-card dark:bg-bg-card rounded-3xl p-6 border border-border-main dark:border-border-main shadow-lg"
          >
            <h3 className="text-lg font-black text-text-main dark:text-text-main mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Overall Progress
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-text-muted dark:text-text-muted">Course Completion</span>
                  <span className="text-primary">78%</span>
                </div>
                <div className="h-3 bg-bg-main dark:bg-bg-main rounded-full overflow-hidden p-0.5 border border-border-main dark:border-border-main">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '78%' }}
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-bg-main dark:bg-bg-main rounded-2xl border border-border-main dark:border-border-main text-center">
                  <BookOpen className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-xl font-black text-text-main dark:text-text-main">{profile.stats.cardsMastered}</div>
                  <div className="text-[10px] font-black uppercase text-text-muted tracking-widest">Cards</div>
                </div>
                <div className="p-4 bg-bg-main dark:bg-bg-main rounded-2xl border border-border-main dark:border-border-main text-center">
                  <Clock className="w-6 h-6 text-secondary mx-auto mb-2" />
                  <div className="text-xl font-black text-text-main dark:text-text-main">{profile.stats.totalHours}h</div>
                  <div className="text-[10px] font-black uppercase text-text-muted tracking-widest">Hours</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-bg-card dark:bg-bg-card rounded-3xl p-6 border border-border-main dark:border-border-main shadow-lg"
          >
            <h3 className="text-lg font-black text-text-main dark:text-text-main mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5 text-secondary" />
              Notifications
            </h3>
            <div className="space-y-4">
              {Object.entries(profile.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm font-bold text-text-main dark:text-text-main capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <button 
                    disabled={!isEditing}
                    onClick={() => setProfile({
                      ...profile, 
                      notifications: { ...profile.notifications, [key]: !value }
                    })}
                    className={`w-12 h-6 rounded-full transition-all relative ${value ? 'bg-primary' : 'bg-bg-main dark:bg-bg-main border border-border-main dark:border-border-main'} ${!isEditing && 'opacity-50 cursor-not-allowed'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${value ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Goals & Preferences */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-bg-card dark:bg-bg-card rounded-3xl p-8 border border-border-main dark:border-border-main shadow-lg"
          >
            <h3 className="text-xl font-black text-text-main dark:text-text-main mb-8 flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              Study Goals & Preferences
            </h3>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-text-muted tracking-widest">Main Study Goal</label>
                {isEditing ? (
                  <textarea 
                    value={profile.studyGoal}
                    onChange={(e) => setProfile({...profile, studyGoal: e.target.value})}
                    className="w-full p-4 bg-bg-main dark:bg-bg-main border border-border-main dark:border-border-main rounded-2xl outline-none focus:ring-2 ring-primary/50 text-text-main font-bold resize-none h-24"
                  />
                ) : (
                  <div className="p-4 bg-bg-main dark:bg-bg-main rounded-2xl border border-border-main dark:border-border-main">
                    <p className="text-text-main dark:text-text-main font-bold italic">"{profile.studyGoal}"</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-text-muted tracking-widest">Preferred Study Mode</label>
                  <div className="grid grid-cols-1 gap-3">
                    {studyModes.map((mode) => (
                      <button
                        key={mode.id}
                        disabled={!isEditing}
                        onClick={() => setProfile({...profile, preferredMode: mode.id})}
                        className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                          profile.preferredMode === mode.id 
                            ? 'bg-primary/10 border-primary shadow-sm' 
                            : 'bg-bg-main dark:bg-bg-main border-border-main dark:border-border-main hover:border-primary/50'
                        } ${!isEditing && 'cursor-default'}`}
                      >
                        <div className={`p-2 rounded-xl bg-white dark:bg-bg-card shadow-sm ${mode.color}`}>
                          <mode.icon className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-text-main dark:text-text-main">{mode.id}</span>
                        {profile.preferredMode === mode.id && <CheckCircle2 className="w-5 h-5 text-primary ml-auto" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-text-muted tracking-widest">Daily Study Target</label>
                  <div className="p-8 bg-bg-main dark:bg-bg-main rounded-3xl border border-border-main dark:border-border-main text-center space-y-4">
                    <div className="text-5xl font-black text-primary">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-4">
                          <button 
                            onClick={() => setProfile({...profile, dailyTarget: Math.max(1, profile.dailyTarget - 1)})}
                            className="w-10 h-10 rounded-full bg-white dark:bg-bg-card border border-border-main flex items-center justify-center text-2xl"
                          >-</button>
                          <span>{profile.dailyTarget}</span>
                          <button 
                            onClick={() => setProfile({...profile, dailyTarget: Math.min(12, profile.dailyTarget + 1)})}
                            className="w-10 h-10 rounded-full bg-white dark:bg-bg-card border border-border-main flex items-center justify-center text-2xl"
                          >+</button>
                        </div>
                      ) : (
                        <span>{profile.dailyTarget}</span>
                      )}
                    </div>
                    <div className="text-sm font-bold text-text-muted dark:text-text-muted">Hours per day</div>
                    <p className="text-xs text-text-muted opacity-60 italic">
                      Consistency is key! You've hit this target 8 days in a row.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
