import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LanguageSelector from './components/LanguageSelector';
import Dashboard from './components/Dashboard';
import LearningArea from './components/LearningArea';
import ProblemsPage from './pages/ProblemsPage';
import ProblemDetailPage from './pages/ProblemDetailPage';
import { curriculum, languages } from './data/curriculum';
import './styles/ProblemDetail.css';

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
      if (parsed.selectedLanguage && !languages.find(l => l.id === parsed.selectedLanguage)) {
        parsed.selectedLanguage = null;
      }
      return parsed;
    }
    return INITIAL_PROFILE;
  });

  useEffect(() => {
    localStorage.setItem('codespawn-final-profile', JSON.stringify(profile));
  }, [profile]);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={
            profile.selectedLanguage ? <Navigate to="/dashboard" /> : <LanguageSelector onSelect={(id) => setProfile(prev => ({...prev, selectedLanguage: id}))} profile={profile} />
          } />
          
          <Route path="/dashboard" element={
            <Dashboard 
              profile={profile} 
              onSelectLesson={(lesson) => window.location.href = `/workspace/${lesson.id}`}
              onBackToHome={() => setProfile(prev => ({ ...prev, selectedLanguage: null }))}
              updateProfile={(updates) => setProfile(prev => ({ ...prev, ...updates }))}
            />
          } />

          <Route path="/problems" element={<ProblemsPage />} />
          
          <Route path="/problem/:problemId" element={<ProblemDetailPage />} />

          <Route path="/workspace/:lessonId" element={
            <LearningArea 
              onBack={() => window.location.href = '/dashboard'}
              // Lesson loading logic would go here
            />
          } />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

