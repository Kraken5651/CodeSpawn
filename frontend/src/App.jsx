import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import LanguageSelector from './components/LanguageSelector';
import Dashboard from './components/Dashboard';
import LearningArea from './components/LearningArea';
import ErrorBoundary from './components/ErrorBoundary';
import ProblemsPage from './pages/ProblemsPage';
import ProblemDetailPage from './pages/ProblemDetailPage';
import { useProfileStore } from './stores/profileStore';
import { curriculum } from './data/curriculum';
import './styles/ProblemDetail.css';

const DashboardRoute = () => {
  const navigate = useNavigate();
  const { profile, resetLanguage, updateProfile } = useProfileStore();

  return (
    <Dashboard
      profile={profile}
      onSelectLesson={(lesson) => navigate(`/workspace/${lesson.id}`)}
      onBackToHome={resetLanguage}
      updateProfile={updateProfile}
    />
  );
};

const WorkspaceRoute = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const { profile, updateProfile } = useProfileStore();
  const lesson = curriculum.find((item) => item.id === lessonId);
  const lessonPrefixByPath = {
    'csharp-core': 'csc',
    'js-core': 'jsc',
    'js-game': 'jsg',
    'python-core': 'pyc',
  };
  const activePrefix = lessonPrefixByPath[profile.selectedLanguage] || lessonId?.split('-')[0] || 'csc';
  const activeLessons = curriculum.filter((item) => item.id.startsWith(`${activePrefix}-`));
  const lessonIndex = activeLessons.findIndex((item) => item.id === lessonId);
  const nextLesson = lessonIndex >= 0 ? activeLessons[lessonIndex + 1] : null;

  const handleComplete = (completedLesson) => {
    const completed = new Set(profile.completed || []);
    const wasAlreadyComplete = completed.has(completedLesson.id);
    completed.add(completedLesson.id);

    updateProfile({
      completed: Array.from(completed),
      xp: wasAlreadyComplete ? profile.xp : profile.xp + completedLesson.xp,
      level: Math.max(1, Math.floor((wasAlreadyComplete ? profile.xp : profile.xp + completedLesson.xp) / 500) + 1),
    });
  };

  return (
    <LearningArea
      lesson={lesson}
      lessons={activeLessons.length ? activeLessons : curriculum}
      onBack={() => navigate('/dashboard')}
      onHome={() => navigate('/')}
      onProfile={() => navigate('/dashboard?tab=settings')}
      onSelectLesson={(next) => navigate(`/workspace/${next.id}`)}
      onComplete={handleComplete}
      onNext={() => nextLesson ? navigate(`/workspace/${nextLesson.id}`) : navigate('/dashboard')}
    />
  );
};

function App() {
  const { profile, selectLanguage } = useProfileStore();

  return (
    <ErrorBoundary>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={
              profile.selectedLanguage ? <Navigate to="/dashboard" /> : <LanguageSelector onSelect={selectLanguage} profile={profile} />
            } />
            
            <Route path="/dashboard" element={<DashboardRoute />} />

            <Route path="/problems" element={<ProblemsPage />} />
            
            <Route path="/problem/:problemId" element={<ProblemDetailPage />} />

            <Route path="/workspace/:lessonId" element={<WorkspaceRoute />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
