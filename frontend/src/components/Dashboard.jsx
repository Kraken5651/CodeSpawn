import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Star, Trophy, Code, Home, Settings, Terminal, BarChart2, ArrowLeft, Play, Lock, User, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { curriculum, paths, languages } from '../data/curriculum';

const Dashboard = ({ profile, onSelectLesson, onBackToHome, updateProfile }) => {
  const [activeTab, setActiveTab] = useState('roadmap');
  const [tempName, setTempName] = useState(profile.name);

  const completedSet = new Set(profile.completed || []);
  const activePathId = profile.selectedLanguage || 'csharp-core';
  const path = paths[activePathId];
  const langInfo = languages.find(l => l.id === activePathId) || languages[0];

  const handleSaveSettings = () => {
    if (updateProfile) {
      updateProfile({ name: tempName });
    }
  };

  return (
    <div className="academy-dashboard">
      <aside className="academy-sidebar">
        <div className="sidebar-brand" onClick={onBackToHome}>
          <ArrowLeft size={18} />
          <span>Academy Home</span>
        </div>

        <div className="sidebar-section">
          <p className="section-label">TRAINING</p>
          <button className={`nav-item ${activeTab === 'roadmap' ? 'active' : ''}`} onClick={() => setActiveTab('roadmap')}>
            <BarChart2 size={18} /> Roadmap
          </button>
          <button className={`nav-item ${activeTab === 'lab' ? 'active' : ''}`} onClick={() => setActiveTab('lab')}>
            <Terminal size={18} /> Sandbox Lab
          </button>
          <Link to="/problems" className="nav-item">
            <Code size={18} /> Challenges
          </Link>
        </div>

        <div className="sidebar-section">
          <p className="section-label">OPERATIONS</p>
          <button className={`nav-item ${activeTab === 'achievements' ? 'active' : ''}`} onClick={() => setActiveTab('achievements')}>
            <Trophy size={18} /> Achievements
          </button>
          <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <Settings size={18} /> Settings
          </button>
        </div>

        <div className="sidebar-profile">
          <div className="avatar-med">{profile.name[0]}</div>
          <div className="profile-text">
            <p className="p-name">{profile.name}</p>
            <p className="p-lvl">Level {profile.level}</p>
          </div>
        </div>
      </aside>

      <main className="academy-content">
        <header className="content-header">
          <div className="header-title">
            <span className="lang-pill" style={{ background: langInfo.color }}>{langInfo.name}</span>
            <h1>
              {activeTab === 'roadmap' && 'Development Roadmap'}
              {activeTab === 'lab' && 'Freeplay Sandbox'}
              {activeTab === 'achievements' && 'Hall of Fame'}
              {activeTab === 'settings' && 'Account Settings'}
            </h1>
          </div>
          <div className="header-stats">
            <div className="stat-box"><Flame size={14} className="warning" /> {profile.streak}</div>
            <div className="stat-box"><Star size={14} className="accent" /> {profile.xp} XP</div>
          </div>
        </header>

        {activeTab === 'roadmap' && path && (
          <section className="roadmap-flow">
            {path.stages.map((stage, sIdx) => (
              <div key={stage.id} className="roadmap-stage">
                <div className="stage-info">
                  <div className="stage-num">{sIdx + 1}</div>
                  <h2>{stage.title}</h2>
                </div>

                <div className="lesson-reel">
                  {stage.lessons.map((lessonId, lIdx) => {
                    const lesson = curriculum.find(l => l.id === lessonId);
                    if (!lesson) return null;
                    const isDone = completedSet.has(lessonId);
                    
                    let isLocked = false;
                    if (lIdx > 0) {
                      isLocked = !completedSet.has(stage.lessons[lIdx - 1]);
                    } else if (sIdx > 0) {
                      const prevStage = path.stages[sIdx - 1];
                      const lastLessonOfPrevStage = prevStage.lessons[prevStage.lessons.length - 1];
                      isLocked = !completedSet.has(lastLessonOfPrevStage);
                    }

                    return (
                      <motion.div 
                        key={lessonId}
                        whileHover={!isLocked ? { scale: 1.05 } : {}}
                        className={`academy-lesson-card ${isDone ? 'done' : ''} ${isLocked ? 'locked' : ''}`}
                        onClick={() => !isLocked && onSelectLesson(lesson)}
                      >
                        <div className="lesson-top">
                          <span className={`diff ${lesson.difficulty.toLowerCase()}`}>{lesson.difficulty}</span>
                          {isLocked ? <Lock size={14} /> : (isDone ? <Trophy size={14} className="accent" /> : <Play size={14} />)}
                        </div>
                        <h3>{lesson.title}</h3>
                        <p>{lesson.subtitle}</p>
                        <div className="lesson-bottom">
                          <span>{lesson.xp} XP</span>
                          <div className="progress-bar">
                            <div className="progress-fill" style={{ width: isDone ? '100%' : '0%' }}></div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </section>
        )}

        {activeTab === 'settings' && (
          <section className="settings-panel">
            <div className="setting-group">
              <label>Developer Handle</label>
              <div className="input-row">
                <User size={20} className="muted" />
                <input 
                  type="text" 
                  value={tempName} 
                  onChange={(e) => setTempName(e.target.value)}
                  className="academy-input"
                />
                <button className="save-btn" onClick={handleSaveSettings}>
                  <Save size={16} /> Save
                </button>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'achievements' && (
          <section className="achievements-panel">
            <div className="empty-state">
              <Trophy size={48} className="muted" />
              <h3>No achievements yet</h3>
              <p>Complete your first roadmap stage to earn a badge!</p>
            </div>
          </section>
        )}

        {activeTab === 'lab' && (
          <section className="lab-panel">
            <div className="empty-state">
              <Terminal size={48} className="muted" />
              <h3>Sandbox Lab (Coming Soon)</h3>
              <p>Freeform coding environments are currently under construction.</p>
            </div>
          </section>
        )}

      </main>
    </div>
  );
};

export default Dashboard;
