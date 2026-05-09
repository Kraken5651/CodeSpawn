import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { userService } from '../services/api';

export default function HomePage() {
  const user = useAuthStore((state) => state.user);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      if (user.id === 'demo-user') {
        setProfile({
          total_xp: 1250,
          level: 13,
          problems_solved: 24,
          current_streak_count: 7
        });
        setLoading(false);
        return;
      }

      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const response = await userService.getUserProfile(user.id);
      setProfile(response.data.data.user);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home-page">
      <header className="header">
        <div className="container">
          <h1>CodeSpawn</h1>
          <nav>
            <Link to="/problems">Problems</Link>
            <Link to="/leaderboard">Leaderboard</Link>
            <Link to="/profile">Profile</Link>
          </nav>
        </div>
      </header>

      <main className="container">
        <section className="welcome">
          <h2>Welcome back, {user?.username}! 🦑</h2>
          <p>Ready to level up your coding skills?</p>
        </section>

        {profile && (
          <section className="stats-grid">
            <div className="stat-card">
              <h3>Total XP</h3>
              <p className="stat-value">{profile.total_xp || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Level</h3>
              <p className="stat-value">{profile.level || 1}</p>
            </div>
            <div className="stat-card">
              <h3>Problems Solved</h3>
              <p className="stat-value">{profile.problems_solved || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Current Streak</h3>
              <p className="stat-value">{profile.current_streak_count || 0} days</p>
            </div>
          </section>
        )}

        <section className="call-to-action">
          <Link to="/problems" className="btn-primary-large">
            Start Solving Problems
          </Link>
        </section>
      </main>
    </div>
  );
}

