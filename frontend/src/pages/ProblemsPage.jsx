import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { problemService } from '../services/api';

export default function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    difficulty: '',
    language: '',
    search: ''
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadProblems();
  }, [filters, page]);

  const loadProblems = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await problemService.getAllProblems({
        ...filters,
        page,
        limit: 20
      });

      setProblems(response.data.data.problems);
      setTotalPages(response.data.data.pagination.pages);
    } catch (err) {
      setError('Failed to load problems');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      EASY: '#10b981',
      MEDIUM: '#f59e0b',
      HARD: '#ef4444',
      EXPERT: '#8b5cf6'
    };
    return colors[difficulty] || '#gray';
  };

  return (
    <div className="problems-page">
      <header className="header">
        <div className="container">
          <h1>Problems</h1>
        </div>
      </header>

      <main className="container">
        <section className="filters">
          <input
            type="text"
            placeholder="Search problems..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="search-input"
          />

          <select
            value={filters.difficulty}
            onChange={(e) => handleFilterChange('difficulty', e.target.value)}
            className="filter-select"
          >
            <option value="">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
            <option value="EXPERT">Expert</option>
          </select>

          <select
            value={filters.language}
            onChange={(e) => handleFilterChange('language', e.target.value)}
            className="filter-select"
          >
            <option value="">All Languages</option>
            <option value="csharp">C#</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="cpp">C++</option>
          </select>
        </section>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading problems...</div>
        ) : problems.length === 0 ? (
          <div className="empty-state">
            <p>No problems found. Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            <section className="problems-list">
              {problems.map((problem) => (
                <Link
                  key={problem.id}
                  to={`/problems/${problem.id}`}
                  className="problem-card"
                >
                  <div className="problem-title">{problem.title}</div>
                  <div className="problem-meta">
                    <span
                      className="difficulty-badge"
                      style={{
                        backgroundColor: getDifficultyColor(problem.difficulty?.name)
                      }}
                    >
                      {problem.difficulty?.name}
                    </span>
                    <span className="language-badge">{problem.language?.name}</span>
                    <span className="xp-badge">
                      +{problem.difficulty?.xp_reward} XP
                    </span>
                  </div>
                  <div className="problem-stats">
                    <span>{problem.total_attempts} attempts</span>
                    <span>{problem.acceptance_rate}% solved</span>
                  </div>
                </Link>
              ))}
            </section>

            <section className="pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="btn-secondary"
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="btn-secondary"
              >
                Next
              </button>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
