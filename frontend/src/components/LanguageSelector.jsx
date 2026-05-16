import React from 'react';
import { motion } from 'framer-motion';
import { Code, Layout, Cpu, Zap, Flame, Play, Star } from 'lucide-react';
import { languages } from '../data/curriculum';

const LanguageSelector = ({ onSelect, profile }) => {
  const iconMap = {
    Cpu: <Cpu size={32} />,
    Code: <Code size={32} />,
    Layout: <Layout size={32} />
  };

  return (
    <div className="academy-landing">
      <div className="landing-bg-glow"></div>
      
      <header className="academy-header">
        <div className="academy-logo">
          <div className="logo-icon"><Zap fill="currentColor" /></div>
          <span>CODESPAWN <strong>ACADEMY</strong></span>
        </div>
        <div className="academy-hud">
          <div className="hud-stat"><Flame size={16} /> {profile.streak}</div>
          <div className="hud-stat"><Star size={16} /> {profile.xp} XP</div>
          <div className="hud-user">
            <span>{profile.name}</span>
            <div className="hud-avatar">{profile.name[0]}</div>
          </div>
        </div>
      </header>

      <main className="academy-hero">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <h1>Master Game Engineering</h1>
          <p>From the first variable to professional Unity architectures. Choose your path.</p>
        </motion.div>

        <div className="discipline-grid">
          {languages.map((lang, i) => (
            <motion.div 
              key={lang.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="discipline-card"
              onClick={() => onSelect(lang.id)}
            >
              <div className="card-accent" style={{ background: lang.color }}></div>
              <div className="card-icon" style={{ color: lang.color }}>{iconMap[lang.icon]}</div>
              <h3>{lang.name}</h3>
              <p>{lang.description}</p>
              <div className="card-cta">
                <span>Start Training</span>
                <Play size={14} fill="currentColor" />
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="academy-footer">
        <div className="footer-stat"><strong>20+</strong> Core Lessons</div>
        <div className="footer-stat"><strong>3</strong> Career Paths</div>
        <div className="footer-stat"><strong>Live</strong> Unity Simulation</div>
      </footer>
    </div>
  );
};

export default LanguageSelector;
