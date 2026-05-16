import React from 'react';
import { Home, RotateCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <main className="app-crash">
        <section className="app-crash-card">
          <h1>Something broke on this screen.</h1>
          <p>{this.state.error.message || 'The app hit an unexpected UI error.'}</p>
          <div className="crash-actions">
            <button onClick={() => this.setState({ error: null })}>
              <RotateCcw size={16} /> Try again
            </button>
            <a href="/">
              <Home size={16} /> Home
            </a>
          </div>
        </section>
      </main>
    );
  }
}

export default ErrorBoundary;
