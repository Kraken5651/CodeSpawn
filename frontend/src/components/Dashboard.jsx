import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, BarChart2, BookOpen, Code, Flame, Play, Save, Settings, Star, Trophy, User } from 'lucide-react';
import { curriculum, paths, languages } from '../data/curriculum';

const Dashboard = ({ profile, onSelectLesson, onBackToHome, updateProfile }) => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'learn');
  const [activeStageId, setActiveStageId] = useState('all');
  const [tempName, setTempName] = useState(profile.name);

  const completedSet = useMemo(() => new Set(profile.completed || []), [profile.completed]);
  const activePathId = profile.selectedLanguage || 'csharp-core';
  const path = paths[activePathId];
  const langInfo = languages.find((language) => language.id === activePathId) || languages[0];
  const allStageIds = new Set(path?.stages.flatMap((stage) => stage.lessons) || []);
  const pathLessons = curriculum.filter((lesson) => allStageIds.has(lesson.id));
  const completedCount = pathLessons.filter((lesson) => completedSet.has(lesson.id)).length;
  const progressPercent = pathLessons.length ? Math.round((completedCount / pathLessons.length) * 100) : 0;

  const visibleStages = path?.stages.filter((stage) => activeStageId === 'all' || stage.id === activeStageId) || [];

  const handleSaveSettings = () => {
    updateProfile?.({ name: tempName.trim() || 'Developer' });
  };

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab === 'settings' ? 'profile' : tab);
    }
  }, [searchParams]);

  return (
    <div className="academy-shell">
      <header className="academy-topbar">
        <button className="topbar-back" onClick={onBackToHome}>
          <ArrowLeft size={18} /> Courses
        </button>

        <div className="topbar-brand">
          <span className="brand-dot" style={{ background: langInfo.color }} />
          <div>
            <strong>{langInfo.name}</strong>
            <small>{completedCount}/{pathLessons.length} modules complete</small>
          </div>
        </div>

        <nav className="topbar-nav">
          <button className={activeTab === 'learn' ? 'active' : ''} onClick={() => setActiveTab('learn')}>
            <BookOpen size={16} /> Learn
          </button>
          <Link to="/problems">
            <Code size={16} /> Challenges
          </Link>
          <button className={activeTab === 'progress' ? 'active' : ''} onClick={() => setActiveTab('progress')}>
            <BarChart2 size={16} /> Progress
          </button>
          <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
            <Settings size={16} /> Profile
          </button>
        </nav>
      </header>

      <main className="academy-main">
        <section className="academy-overview">
          <div className="overview-title">
            <span className="lang-pill" style={{ background: langInfo.color }}>{langInfo.name}</span>
            <h1>{activeTab === 'learn' ? 'Choose a module and start coding' : activeTab === 'profile' ? 'Profile settings' : 'Your progress'}</h1>
          </div>

          <div className="overview-stats">
            <div className="overview-stat"><Star size={16} /> <strong>{profile.xp}</strong><span>XP</span></div>
            <div className="overview-stat"><Flame size={16} /> <strong>{profile.streak}</strong><span>Streak</span></div>
            <div className="overview-stat"><Trophy size={16} /> <strong>{progressPercent}%</strong><span>Complete</span></div>
          </div>
        </section>

        {activeTab === 'learn' && (
          <>
            <section className="stage-filter">
              <button className={activeStageId === 'all' ? 'active' : ''} onClick={() => setActiveStageId('all')}>All phases</button>
              {path?.stages.map((stage, index) => (
                <button
                  key={stage.id}
                  className={activeStageId === stage.id ? 'active' : ''}
                  onClick={() => setActiveStageId(stage.id)}
                >
                  Phase {index + 1}
                </button>
              ))}
            </section>

            <section className="module-browser">
              {visibleStages.map((stage, stageIndex) => (
                <article key={stage.id} className="phase-section">
                  <header className="phase-header">
                    <span>{stageIndex + 1}</span>
                    <h2>{stage.title}</h2>
                  </header>

                  <div className="module-table">
                    {stage.lessons.map((lessonId) => {
                      const lesson = curriculum.find((item) => item.id === lessonId);
                      if (!lesson) return null;

                      const isDone = completedSet.has(lesson.id);

                      return (
                        <button key={lesson.id} className="module-row" onClick={() => onSelectLesson(lesson)}>
                          <div className={`module-status ${isDone ? 'done' : ''}`}>{isDone ? 'Done' : 'Start'}</div>
                          <div className="module-copy">
                            <strong>{lesson.title}</strong>
                            <span>{lesson.subtitle}</span>
                          </div>
                          <div className={`module-difficulty ${lesson.difficulty.toLowerCase()}`}>{lesson.difficulty}</div>
                          <div className="module-xp">+{lesson.xp} XP</div>
                          <Play size={18} />
                        </button>
                      );
                    })}
                  </div>
                </article>
              ))}
            </section>
          </>
        )}

        {activeTab === 'profile' && (
          <section className="profile-page-panel">
            <div className="profile-card-large">
              <div className="avatar-large">{(profile.name || 'D')[0]}</div>
              <div>
                <h2>{profile.name}</h2>
                <p>Level {profile.level} developer</p>
              </div>
            </div>

            <div className="setting-group">
              <label>Developer Handle</label>
              <div className="input-row">
                <User size={20} className="muted" />
                <input
                  type="text"
                  value={tempName}
                  onChange={(event) => setTempName(event.target.value)}
                  className="academy-input"
                />
                <button className="save-btn" onClick={handleSaveSettings}>
                  <Save size={16} /> Save
                </button>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'progress' && (
          <section className="progress-panel">
            <div className="progress-ring">{progressPercent}%</div>
            <div>
              <h2>{completedCount} modules complete</h2>
              <p>Keep moving through the roadmap. Completed lessons stay marked so you can resume without digging.</p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
