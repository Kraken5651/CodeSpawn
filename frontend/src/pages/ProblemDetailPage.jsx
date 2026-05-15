import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Send, 
  RotateCcw, 
  Play, 
  Terminal, 
  Info, 
  CheckCircle, 
  XCircle, 
  History, 
  MessageSquare, 
  Settings,
  Maximize2,
  Minimize2,
  Command,
  Layout,
  Code,
  Loader2
} from 'lucide-react';
import { problems as mockProblems } from '../data/problems';
import api from '../services/api';

const ProblemDetailPage = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/problems/${problemId}`);
        if (response.data.success) {
          const p = response.data.data.problem;
          setProblem(p);
          // Set initial code from boilerplate
          setCode(p.boilerplate_code || '');
        }
      } catch (error) {
        console.error('Error fetching problem:', error);
        // Fallback to mock for testing if needed
        const foundProblem = mockProblems.find(p => p.id === problemId);
        if (foundProblem) {
          setProblem(foundProblem);
          setCode(foundProblem.starterCode[language] || '');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);


  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const runCode = () => {
    setIsRunning(true);
    setConsoleLogs(prev => [...prev, { type: 'info', msg: 'Compiling and running code...' }]);
    
    // Simulate execution
    setTimeout(() => {
      setConsoleLogs(prev => [...prev, { type: 'success', msg: 'Execution finished successfully.' }]);
      setConsoleLogs(prev => [...prev, { type: 'output', msg: 'Output: [0, 1]' }]);
      setIsRunning(false);
    }, 1500);
  };

  const submitCode = () => {
    setIsSubmitting(true);
    setConsoleLogs(prev => [...prev, { type: 'info', msg: 'Submitting code...' }]);
    
    // Simulate submission
    setTimeout(() => {
      setTestResult({
        passed: true,
        runtime: '68ms',
        memory: '42.5MB',
        testCases: [
          { status: 'Passed', input: '[2,7,11,15], 9', expected: '[0,1]', actual: '[0,1]' },
          { status: 'Passed', input: '[3,2,4], 6', expected: '[1,2]', actual: '[1,2]' },
        ]
      });
      setIsSubmitting(false);
    }, 2000);
  };

  if (loading) return (
    <div className="loading-screen flex flex-col items-center justify-center h-screen bg-black gap-4">
      <Loader2 size={64} className="animate-spin text-blue-500" />
      <p className="text-gray-400 font-mono">RETRIEVING DATA FROM DATABASE...</p>
    </div>
  );

  if (!problem) return <div className="loading-screen">Problem not found.</div>;

  return (
    <div className={`problem-detail-container ${isFullScreen ? 'fullscreen' : ''}`}>
      {/* Header */}
      <header className="problem-header">
        <div className="header-left">
          <button onClick={() => navigate('/problems')} className="icon-btn">
            <ChevronLeft size={20} />
          </button>
          <div className="problem-title-area">
            <span className="problem-id">PROBLEM ID: {problem.id.substring(0, 8).toUpperCase()}</span>
            <h1 className="problem-title">{problem.title}</h1>
          </div>
        </div>
        
        <div className="header-center">
          <div className="action-buttons">
            <button 
              className={`run-btn ${isRunning ? 'loading' : ''}`} 
              onClick={runCode}
              disabled={isRunning || isSubmitting}
            >
              <Play size={16} fill="currentColor" /> Run
            </button>
            <button 
              className={`submit-btn ${isSubmitting ? 'loading' : ''}`} 
              onClick={submitCode}
              disabled={isRunning || isSubmitting}
            >
              <Send size={16} /> Submit
            </button>
          </div>
        </div>

        <div className="header-right">
          <button className="icon-btn"><Settings size={18} /></button>
          <button className="icon-btn" onClick={() => setIsFullScreen(!isFullScreen)}>
            {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          <div className="user-profile-mini">
            <div className="avatar">K</div>
          </div>
        </div>
      </header>

      <main className="problem-workspace">
        {/* Left Panel: Description */}
        <section className="problem-description-panel panel">
          <div className="panel-tabs">
            <button 
              className={`tab ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              <Info size={14} /> Description
            </button>
            <button 
              className={`tab ${activeTab === 'solutions' ? 'active' : ''}`}
              onClick={() => setActiveTab('solutions')}
            >
              <Code size={14} /> Solutions
            </button>
            <button 
              className={`tab ${activeTab === 'submissions' ? 'active' : ''}`}
              onClick={() => setActiveTab('submissions')}
            >
              <History size={14} /> Submissions
            </button>
          </div>

          <div className="panel-content scrollable">
            {activeTab === 'description' && (
              <div className="description-view">
                <div className="problem-meta">
                  <span className={`difficulty-pill ${problem.difficulty?.name.toLowerCase()}`}>
                    {problem.difficulty?.name}
                  </span>
                  <span className="category-pill">{problem.category?.name || 'Algorithm'}</span>
                  <span className="xp-gain">+{problem.xp_reward || problem.difficulty?.xp_reward} XP</span>
                </div>

                <div className="description-text">
                  <p>{problem.description}</p>
                </div>

                <div className="examples-section">
                  {problem.test_cases?.slice(0, 2).map((example, i) => (
                    <div key={i} className="example-card">
                      <h4>Example {i + 1}:</h4>
                      <div className="example-box">
                        <p><strong>Input:</strong> {example.input}</p>
                        <p><strong>Output:</strong> {example.expected_output}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="constraints-section">
                  <h4>Constraints:</h4>
                  <ul>
                    <li>Time Limit: <code>{problem.time_limit_seconds || 5}s</code></li>
                    <li>Memory Limit: <code>{problem.memory_limit_mb || 256}MB</code></li>
                  </ul>
                </div>
              </div>
            )}
            {activeTab === 'submissions' && (
              <div className="submissions-view">
                <div className="empty-submissions">
                  <History size={48} className="muted-icon" />
                  <p>No submissions yet.</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Right Panel: Editor & Console */}
        <section className="editor-console-panel">
          <div className="editor-panel panel">
            <div className="panel-tabs">
              <div className="language-selector-wrapper">
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className="lang-select"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="csharp">C#</option>
                </select>
              </div>
              <button className="icon-btn reset-btn" title="Reset Code">
                <RotateCcw size={14} />
              </button>
            </div>
            
            <div className="editor-container">
              <Editor
                height="100%"
                language={language}
                theme="vs-dark"
                value={code}
                onChange={(val) => setCode(val)}
                onMount={handleEditorDidMount}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  readOnly: false,
                  automaticLayout: true,
                  padding: { top: 16, bottom: 16 }
                }}
              />
            </div>
          </div>

          <div className="console-panel panel">
            <div className="panel-tabs">
              <button className="tab active">
                <Terminal size={14} /> Console
              </button>
              {testResult && (
                <button className="tab success">
                  <CheckCircle size={14} /> Results
                </button>
              )}
            </div>
            <div className="console-content scrollable">
              {testResult ? (
                <div className="test-results-view">
                  <div className="result-header">
                    <h3 className={testResult.passed ? 'text-success' : 'text-danger'}>
                      {testResult.passed ? 'Accepted' : 'Wrong Answer'}
                    </h3>
                    <div className="result-stats">
                      <span>Runtime: <strong>{testResult.runtime}</strong></span>
                      <span>Memory: <strong>{testResult.memory}</strong></span>
                    </div>
                  </div>
                  <div className="test-cases-list">
                    {testResult.testCases.map((tc, i) => (
                      <div key={i} className="test-case-card">
                        <div className="tc-header">
                          <CheckCircle size={14} className="text-success" />
                          <span>Case {i + 1}</span>
                        </div>
                        <div className="tc-details">
                          <div className="detail-row">
                            <span>Input:</span>
                            <code>{tc.input}</code>
                          </div>
                          <div className="detail-row">
                            <span>Output:</span>
                            <code>{tc.actual}</code>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="logs-list">
                  {consoleLogs.length === 0 ? (
                    <span className="muted">Run code to see results...</span>
                  ) : (
                    consoleLogs.map((log, i) => (
                      <div key={i} className={`log-entry ${log.type}`}>
                        <span className="log-msg">{log.msg}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProblemDetailPage;
