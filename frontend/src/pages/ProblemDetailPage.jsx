import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
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
  Settings,
  Maximize2,
  Minimize2,
  Home,
  Code,
  Loader2
} from 'lucide-react';
import api from '../services/api';
import { problems as localProblems } from '../data/problems';
import { runLocalProblemJudge } from '../services/localProblemJudge';

const normalizeLocalProblem = (problem) => ({
  ...problem,
  id: problem.id,
  slug: problem.id,
  difficulty: { name: problem.difficulty.toUpperCase(), xp_reward: problem.xp },
  language: { id: 'local-javascript', name: 'JavaScript', slug: 'javascript' },
  category: { name: problem.category },
  xp_reward: problem.xp,
  boilerplate_code: problem.starterCode.javascript,
  test_cases: problem.examples.map((example, index) => ({
    id: `${problem.id}-sample-${index + 1}`,
    input: example.input,
    expected_output: example.output,
    explanation: example.explanation,
  })),
  constraints: problem.constraints,
  isLocal: true,
});

const starterBySlug = {
  'two-sum': {
    javascript: "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction twoSum(nums, target) {\n    \n}",
    python: "class Solution:\n    def twoSum(self, nums, target):\n        pass",
    csharp: "public class Solution {\n    public int[] TwoSum(int[] nums, int target) {\n        \n    }\n}"
  },
  'valid-parentheses': {
    javascript: "/**\n * @param {string} s\n * @return {boolean}\n */\nfunction isValid(s) {\n    \n}",
    python: "class Solution:\n    def isValid(self, s):\n        pass",
    csharp: "public class Solution {\n    public bool IsValid(string s) {\n        \n    }\n}"
  }
};

const getStarterCode = (problem, language) => (
  problem?.starterCode?.[language] ||
  starterBySlug[problem?.slug || problem?.id]?.[language] ||
  problem?.boilerplate_code ||
  ''
);

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
  const [submissions, setSubmissions] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [source, setSource] = useState('api');
  const editorRef = useRef(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/problems/${problemId}`);
        if (response.data.success) {
          const p = response.data.data.problem;
          setProblem(p);
          setCode(p.boilerplate_code || '');
          setLanguage(p.language?.slug || 'javascript');
        }
      } catch (error) {
        const fallback = localProblems.find((item) => item.id === problemId);
        if (fallback) {
          const p = normalizeLocalProblem(fallback);
          setProblem(p);
          setCode(p.boilerplate_code || '');
          setLanguage('javascript');
          setSource('local');
          setConsoleLogs([{ type: 'info', msg: 'Backend unavailable. Loaded built-in practice problem.' }]);
        } else {
          setConsoleLogs([{ type: 'error', msg: error.message || 'Failed to load problem.' }]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (source === 'local') return;

      try {
        const response = await api.get(`/submissions/problem/${problemId}`);
        if (response.data.success) {
          setSubmissions(response.data.data.submissions);
        }
      } catch (error) {
        if (error.status !== 401) {
          setConsoleLogs(prev => [...prev, { type: 'error', msg: error.message }]);
        }
      }
    };

    fetchSubmissions();
  }, [problemId, source]);


  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const formatSubmissionResult = (submission) => {
    const cases = submission.execution_details?.cases || [];

    return {
      passed: submission.is_accepted,
      status: submission.status,
      runtime: submission.execution_time_ms ? `${submission.execution_time_ms}ms` : 'n/a',
      memory: submission.memory_used_mb ? `${submission.memory_used_mb}MB` : 'n/a',
      error: submission.error_message,
      testCases: cases.map((testCase) => ({
        status: testCase.status,
        input: testCase.input,
        expected: testCase.expected,
        actual: Array.isArray(testCase.actual) ? JSON.stringify(testCase.actual) : String(testCase.actual ?? ''),
        error: testCase.error,
      })),
    };
  };

  const submitCode = async ({ mode = 'submit' } = {}) => {
    if (source === 'local' || problem?.isLocal) {
      const setBusy = mode === 'run' ? setIsRunning : setIsSubmitting;
      setBusy(true);
      setTestResult(null);
      setConsoleLogs(prev => [...prev, { type: 'info', msg: mode === 'run' ? 'Running sample tests locally...' : 'Judging locally...' }]);

      setTimeout(() => {
        const result = runLocalProblemJudge({ problem, code });
        setTestResult(result);
        setConsoleLogs(prev => [
          ...prev,
          { type: result.passed ? 'success' : 'error', msg: `${result.status}: ${result.error || 'All sample tests passed.'}` },
        ]);
        setBusy(false);
      }, 250);
      return;
    }

    if (!problem?.language?.id) {
      setConsoleLogs(prev => [...prev, { type: 'error', msg: 'This problem is missing a language configuration.' }]);
      return;
    }

    const setBusy = mode === 'run' ? setIsRunning : setIsSubmitting;
    setBusy(true);
    setTestResult(null);
    setConsoleLogs(prev => [...prev, { type: 'info', msg: mode === 'run' ? 'Running against sample tests...' : 'Submitting code to judge...' }]);

    try {
      const response = await api.post('/submissions', {
        problem_id: problem.id,
        language_slug: language,
        code,
      });

      const submission = response.data.data.submission;
      setSubmissions(prev => [submission, ...prev]);
      setTestResult(formatSubmissionResult(submission));
      setConsoleLogs(prev => [
        ...prev,
        {
          type: submission.is_accepted ? 'success' : 'error',
          msg: submission.is_accepted
            ? `Accepted: ${submission.passed_tests}/${submission.total_tests} tests passed.`
            : `${submission.status}: ${submission.error_message || `${submission.passed_tests}/${submission.total_tests} tests passed.`}`,
        },
      ]);
    } catch (error) {
      setConsoleLogs(prev => [...prev, { type: 'error', msg: error.message }]);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return (
    <div className="loading-screen flex flex-col items-center justify-center h-screen bg-black gap-4">
      <Loader2 size={64} className="animate-spin text-blue-500" />
      <p className="text-gray-400 font-mono">RETRIEVING DATA FROM DATABASE...</p>
    </div>
  );

  if (!problem) return <div className="loading-screen">Problem not found.</div>;

  const handleResetCode = () => {
    setCode(getStarterCode(problem, language));
    setTestResult(null);
    setConsoleLogs(prev => [...prev, { type: 'info', msg: 'Editor reset to starter code.' }]);
  };

  const handleLanguageChange = (nextLanguage) => {
    setLanguage(nextLanguage);
    setCode(getStarterCode(problem, nextLanguage));
    setTestResult(null);
    setConsoleLogs(prev => [...prev, { type: 'info', msg: `Switched editor to ${nextLanguage}.` }]);
  };

  return (
    <div className={`problem-detail-container ${isFullScreen ? 'fullscreen' : ''}`}>
      {/* Header */}
      <header className="problem-header">
        <div className="header-left">
          <button onClick={() => navigate('/problems')} className="icon-btn">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => navigate('/dashboard')} className="icon-btn" title="Dashboard">
            <Home size={18} />
          </button>
          <div className="problem-title-area">
            <span className="problem-id">{source === 'local' ? 'PRACTICE MODE' : `PROBLEM ID: ${problem.id.substring(0, 8).toUpperCase()}`}</span>
            <h1 className="problem-title">{problem.title}</h1>
          </div>
        </div>
        
        <div className="header-center">
          <div className="action-buttons">
            <button 
              className={`run-btn ${isRunning ? 'loading' : ''}`} 
              onClick={() => submitCode({ mode: 'run' })}
              disabled={isRunning || isSubmitting}
            >
              <Play size={16} fill="currentColor" /> Run
            </button>
            <button 
              className={`submit-btn ${isSubmitting ? 'loading' : ''}`} 
              onClick={() => submitCode()}
              disabled={isRunning || isSubmitting}
            >
              <Send size={16} /> Submit
            </button>
          </div>
        </div>

        <div className="header-right">
          <button className="icon-btn" onClick={() => setActiveTab('submissions')}><Settings size={18} /></button>
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
                    {problem.constraints?.map((constraint) => (
                      <li key={constraint}>{constraint}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {activeTab === 'submissions' && (
              <div className="submissions-view">
                <div className="empty-submissions">
                  <History size={48} className="muted-icon" />
                  {submissions.length === 0 && <p>No submissions yet.</p>}
                  {submissions.map((submission) => (
                    <div key={submission.id} className="submission-row">
                      <span className={submission.is_accepted ? 'text-success' : 'text-danger'}>
                        {submission.is_accepted ? 'Accepted' : submission.status}
                      </span>
                      <span>{submission.passed_tests}/{submission.total_tests || 0} tests</span>
                    </div>
                  ))}
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
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="lang-select"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="csharp">C#</option>
                </select>
              </div>
              <button className="icon-btn reset-btn" title="Reset Code" onClick={handleResetCode}>
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
                      {testResult.passed ? 'Accepted' : testResult.status}
                    </h3>
                    <div className="result-stats">
                      <span>Runtime: <strong>{testResult.runtime}</strong></span>
                      <span>Memory: <strong>{testResult.memory}</strong></span>
                    </div>
                  </div>
                  {testResult.error && <p className="result-error">{testResult.error}</p>}
                  <div className="test-cases-list">
                    {testResult.testCases.map((tc, i) => (
                      <div key={i} className="test-case-card">
                        <div className="tc-header">
                          {tc.status === 'Passed'
                            ? <CheckCircle size={14} className="text-success" />
                            : <XCircle size={14} className="text-danger" />}
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
                          {tc.error && (
                            <div className="detail-row">
                              <span>Error:</span>
                              <code>{tc.error}</code>
                            </div>
                          )}
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
