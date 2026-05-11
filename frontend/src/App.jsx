import React, { useState, useEffect } from 'react';
import LanguageSelector from './components/LanguageSelector';
import Dashboard from './components/Dashboard';
import LearningArea from './components/LearningArea';
import { curriculum, languages } from './data/curriculum';

const INITIAL_PROFILE = {
  name: 'Developer',
  xp: 0,
  level: 1,
  streak: 1,
  completed: [],
  selectedLanguage: null,
};

function App() {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('codespawn-final-profile');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Clean up old stale language keys
      if (parsed.selectedLanguage && !languages.find(l => l.id === parsed.selectedLanguage)) {
        parsed.selectedLanguage = null;
      }
      return parsed;
    }
    return INITIAL_PROFILE;
  });

  const [activeLesson, setActiveLesson] = useState(null);
  const [view, setView] = useState(profile.selectedLanguage ? 'dashboard' : 'landing');


  useEffect(() => {
    localStorage.setItem('codespawn-final-profile', JSON.stringify(profile));
  }, [profile]);

  const calculateLevel = (xp) => Math.floor(xp / 1000) + 1;

  const handleLanguageSelect = (langId) => {
    setProfile(prev => ({ ...prev, selectedLanguage: langId }));
    setView('dashboard');
  };

  const handleSelectLesson = (lesson) => {
    setActiveLesson(lesson);
    setView('workspace');
  };

  const handleBackToDashboard = () => {
    setActiveLesson(null);
    setView('dashboard');
  };

  const handleBackToHome = () => {
    setProfile(prev => ({ ...prev, selectedLanguage: null }));
    setView('landing');
  };

  const handleLessonComplete = (lesson) => {
    const alreadyDone = profile.completed.includes(lesson.id);
    
    if (!alreadyDone) {
      setProfile(prev => {
        const newXp = prev.xp + lesson.xp;
        return {
          ...prev,
          xp: newXp,
          level: calculateLevel(newXp),
          completed: [...prev.completed, lesson.id],
        };
      });
    }

    // Auto-progress to dashboard or next lesson can be added here
  };

  const handleUpdateProfile = (updates) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const handleNextLesson = () => {
    if (!activeLesson) return;
    const { language: pathId, stageId, id: lessonId } = activeLesson;
    const path = require('./data/curriculum').paths[pathId];
    if (!path) return handleBackToDashboard();

    let nextLessonId = null;
    let foundCurrent = false;

    for (const stage of path.stages) {
      for (const lid of stage.lessons) {
        if (foundCurrent) {
          nextLessonId = lid;
          break;
        }
        if (lid === lessonId) {
          foundCurrent = true;
        }
      }
      if (nextLessonId) break;
    }

    if (nextLessonId) {
      const nextLesson = curriculum.find(l => l.id === nextLessonId);
      if (nextLesson) {
        setActiveLesson(nextLesson);
        return;
      }
    }
    
    // If no next lesson, go back to dashboard
    handleBackToDashboard();
  };

  return (
    <div className="app-container">
      {view === 'landing' && (
        <LanguageSelector onSelect={handleLanguageSelect} profile={profile} />
      )}
      {view === 'dashboard' && (
        <Dashboard 
          profile={profile} 
          onSelectLesson={handleSelectLesson}
          onBackToHome={handleBackToHome}
          updateProfile={handleUpdateProfile}
        />
      )}
      {view === 'workspace' && (
        <LearningArea 
          lesson={activeLesson} 
          onBack={handleBackToDashboard}
          onComplete={handleLessonComplete}
          onNext={handleNextLesson}
        />
      )}
    </div>
  );
}

export default App;
