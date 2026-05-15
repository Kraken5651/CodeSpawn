import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, CheckCircle, ChevronRight, Trophy, Code, Zap, Loader2 } from 'lucide-react';
import api from '../services/api';

const ProblemsPage = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const response = await api.get('/problems');
        if (response.data.success) {
          setProblems(response.data.data.problems);
        }
      } catch (error) {
        console.error('Error fetching problems:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const filteredProblems = (problems || []).filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || p.difficulty?.name === filter.toUpperCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="problems-page">
      <header className="page-header">
        <div className="container">
          <div className="header-content">
            <h1 className="text-3xl font-bold">Coding Challenges</h1>
            <p className="text-gray-400 mt-2">Level up your skills by solving real-world problems.</p>
          </div>
          <div className="stats-cards mt-8 flex gap-6">
            <div className="stat-card">
              <Trophy className="text-yellow-500" />
              <div className="stat-info">
                <span className="stat-value">1,240</span>
                <span className="stat-label">Your Rank</span>
              </div>
            </div>
            <div className="stat-card">
              <Code className="text-blue-500" />
              <div className="stat-info">
                <span className="stat-value">42</span>
                <span className="stat-label">Solved</span>
              </div>
            </div>
            <div className="stat-card">
              <Zap className="text-purple-500" />
              <div className="stat-info">
                <span className="stat-value">12</span>
                <span className="stat-label">Day Streak</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-12">
        <div className="filters-bar flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="search-wrapper relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search problems..." 
              className="w-full bg-gray-900 border border-gray-800 rounded-lg py-2 pl-10 pr-4 focus:border-blue-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {['All', 'Easy', 'Medium', 'Hard'].map(f => (
              <button 
                key={f}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  filter === f ? 'bg-blue-600 text-white' : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                }`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="problems-grid grid gap-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 size={48} className="animate-spin text-blue-500" />
              <p className="text-gray-400">Fetching challenges from database...</p>
            </div>
          ) : filteredProblems.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No problems found matching your criteria.
            </div>
          ) : (
            filteredProblems.map((problem, i) => (
              <motion.div 
                key={problem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/problem/${problem.id}`} className="problem-card-item">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="status-indicator">
                      <div className="w-2 h-2 rounded-full bg-gray-700"></div>
                    </div>
                    <div className="info">
                      <h3 className="text-lg font-semibold text-white">{problem.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-xs font-bold uppercase tracking-wider ${
                          problem.difficulty?.name === 'EASY' ? 'text-green-500' : 
                          problem.difficulty?.name === 'MEDIUM' ? 'text-yellow-500' : 'text-red-500'
                        }`}>
                          {problem.difficulty?.name}
                        </span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">{problem.language?.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="xp-badge-list">
                    <span className="text-blue-500 font-mono">+{problem.xp_reward || problem.difficulty?.xp_reward} XP</span>
                    <ChevronRight size={18} className="text-gray-600" />
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>

      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .problems-page { min-height: 100vh; background: #050505; color: white; }
        .page-header { background: linear-gradient(to bottom, #111, #050505); padding: 4rem 0 2rem; border-bottom: 1px solid #111; }
        .container { max-width: 1100px; margin: 0 auto; padding: 0 1.5rem; }
        .stat-card { background: #111; border: 1px solid #222; padding: 1.25rem 2rem; border-radius: 1rem; display: flex; align-items: center; gap: 1rem; }
        .stat-value { display: block; font-size: 1.5rem; font-weight: 800; }
        .stat-label { font-size: 0.75rem; color: #666; text-transform: uppercase; font-weight: 600; letter-spacing: 1px; }
        .problem-card-item { background: #0a0a0a; border: 1px solid #111; padding: 1.25rem 1.5rem; border-radius: 1rem; display: flex; align-items: center; justify-content: space-between; transition: all 0.2s; }
        .problem-card-item:hover { background: #111; border-color: #333; transform: translateX(8px); }
        .xp-badge-list { display: flex; align-items: center; gap: 1.5rem; }
      `}} />
    </div>
  );
};

export default ProblemsPage;
