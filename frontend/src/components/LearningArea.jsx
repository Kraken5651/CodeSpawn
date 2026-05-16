import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { ChevronLeft, Send, RotateCcw, Lightbulb, Loader2, Maximize2, Terminal, Book, FileText, Home, User, ListChecks } from 'lucide-react';
import GamePreview from './GamePreview';
import { csharpDocs } from '../data/csharpDocs';

const makeLog = (msg, type = 'system') => ({
  msg,
  type,
  time: new Date().toLocaleTimeString(),
});

const normalizeCode = (value) => value.replace(/\s+/g, '').toLowerCase();

const hasBalancedPairs = (value, open, close) => {
  let depth = 0;
  for (const char of value) {
    if (char === open) depth += 1;
    if (char === close) depth -= 1;
    if (depth < 0) return false;
  }
  return depth === 0;
};

const validateLessonCode = (lesson, code) => {
  const trimmed = code.trim();
  const starter = lesson.starterCode?.trim() || '';

  if (!trimmed) {
    return { passed: false, message: 'The editor is empty.' };
  }

  if (trimmed === starter) {
    return { passed: false, message: 'Change the starter code before running it.' };
  }

  if (!hasBalancedPairs(code, '{', '}') || !hasBalancedPairs(code, '(', ')')) {
    return { passed: false, message: 'Unbalanced braces or parentheses.' };
  }

  const codeWithoutComments = code.replace(/\/\/.*$/gm, '');
  const missingHint = lesson.solutionHints.find((hint) => {
    const source = hint.trim() === '//' ? code : codeWithoutComments;
    return !normalizeCode(source).includes(normalizeCode(hint));
  });

  if (missingHint) {
    return { passed: false, message: `Missing required concept: ${missingHint}` };
  }

  if (lesson.language === 'csharp') {
    const hasExecutableStatement = /;|=>|\breturn\b|\bclass\b|\binterface\b|\benum\b/.test(codeWithoutComments);

    if (!hasExecutableStatement) {
      return { passed: false, message: 'No executable C# statement or declaration found.' };
    }
  }

  return { passed: true, message: 'Required concepts found.' };
};

const LearningArea = ({ lesson, lessons = [], onBack, onHome, onProfile, onSelectLesson, onComplete, onNext }) => {
  const [code, setCode] = useState(lesson?.starterCode || '');
  const [showHint, setShowHint] = useState(0); // 0: None, 1: Logic, 2: Code
  const [submission, setSubmission] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logs, setLogs] = useState([makeLog('> Choose a lesson to initialize the workspace.')]);
  const [activeSideTab, setActiveSideTab] = useState('task'); // 'task' or 'docs'
  const editorRef = useRef(null);

  useEffect(() => {
    if (!lesson) return;

    setCode(lesson.starterCode);
    setSubmission(null);
    setShowHint(0);
    setIsSubmitting(false);
    setActiveSideTab('task');
    setLogs([makeLog(`> Environment: ${lesson.language.toUpperCase()} initialized.`)]);
  }, [lesson]);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const addLog = (msg, type = 'system') => {
    setLogs(prev => [...prev, makeLog(msg, type)]);
  };

  if (!lesson) {
    return (
      <div className="workspace-empty">
        <div className="workspace-empty-card">
          <Book size={42} />
          <h1>Lesson not found</h1>
          <p>This module could not be loaded. Return to the academy and choose a visible lesson.</p>
          <button onClick={onBack} className="submit-btn-elite">
            <ChevronLeft size={16} /> Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleRun = () => {
    const validation = validateLessonCode(lesson, code);

    addLog("Checking code against lesson requirements...", "meta");
    setTimeout(() => {
      if (validation.passed) {
        addLog(`Run passed: ${validation.message}`, "success");
      } else {
        addLog(`Run failed: ${validation.message}`, "error");
      }
    }, 400);
  };

  const handleSubmit = async () => {
    if (isSubmitting || submission?.passed) return;

    setIsSubmitting(true);
    addLog("Analyzing logic...", "meta");

    await new Promise(resolve => setTimeout(resolve, 1200));

    const validation = validateLessonCode(lesson, code);
    const passed = validation.passed;

    if (passed) {
      setSubmission({ passed: true, message: "Logic Verified." });
      addLog("Execution Successful: Condition Met.", "success");
      onComplete?.(lesson);
    } else {
      setSubmission({ passed: false, message: validation.message });
      addLog(`Execution Failed: ${validation.message}`, "error");
      setIsSubmitting(false);
    }
  };

  // Find documentation for the current phase and topic
  const phaseMatch = lesson.stageId?.match(/p(\d+)/);
  const phaseNum = phaseMatch ? phaseMatch[1] : null;
  const topicIdMatch = lesson.id?.match(/t(\d+)/);
  const topicId = topicIdMatch ? parseInt(topicIdMatch[1]) : null;

  const currentPhaseDocs = csharpDocs.find(d => d.phase.includes(phaseNum));
  const currentTopicDoc = currentPhaseDocs?.topics?.find(t => t.id === topicId);

  return (
    <div className="workspace-elite">
      <nav className="workspace-header">
        <div className="header-left">
          <button onClick={onBack} className="back-btn-elite">
            <ChevronLeft size={16} /> Exit
          </button>
          <button onClick={onHome} className="back-btn-elite">
            <Home size={16} /> Home
          </button>
          <div className="divider"></div>
          <Book size={16} className="muted" />
          <span className="crumb">{lesson.category}</span>
          <span className="crumb-sep">/</span>
          <span className="crumb-active">{lesson.title}</span>
        </div>
        <div className="header-right">
          <label className="module-jump">
            <ListChecks size={14} />
            <select
              value={lesson.id}
              onChange={(event) => {
                const selected = lessons.find((item) => item.id === event.target.value);
                if (selected) onSelectLesson?.(selected);
              }}
            >
              {lessons.map((item) => (
                <option key={item.id} value={item.id}>{item.title}</option>
              ))}
            </select>
          </label>
          <button className="run-btn" onClick={onProfile}>
            <User size={14} /> Profile
          </button>
          <div className="xp-badge">+{lesson.xp} XP</div>
          <button className="run-btn" onClick={handleRun}>Run Code</button>
          
          {submission?.passed ? (
            <button className="submit-btn-elite next-btn" onClick={onNext}>
              Next Lesson <ChevronLeft size={16} style={{transform: 'rotate(180deg)'}} />
            </button>
          ) : (
            <button 
              className={`submit-btn-elite ${isSubmitting ? 'loading' : ''}`}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              Submit
            </button>
          )}
        </div>
      </nav>

      <div className="workspace-body">
        <aside className="module-rail panel">
          <div className="panel-tabs">
            <div className="tab active"><ListChecks size={12} /> Modules</div>
          </div>
          <div className="module-list scrollbar">
            {lessons.map((item, index) => (
              <button
                key={item.id}
                className={`module-link ${item.id === lesson.id ? 'active' : ''}`}
                onClick={() => onSelectLesson?.(item)}
              >
                <span>{index + 1}</span>
                <strong>{item.title}</strong>
                <small>{item.subtitle}</small>
              </button>
            ))}
          </div>
        </aside>

        {/* Panel 1: Doc / Task */}
        <div className="panel doc-panel-elite">
          <div className="panel-tabs">
            <div 
              className={`tab ${activeSideTab === 'task' ? 'active' : ''}`}
              onClick={() => setActiveSideTab('task')}
            >
              <Book size={14} /> Task Description
            </div>
            <div 
              className={`tab ${activeSideTab === 'docs' ? 'active' : ''}`}
              onClick={() => setActiveSideTab('docs')}
            >
              <FileText size={14} /> Documentation
            </div>
          </div>
          <div className="panel-inner scrollbar">
            {activeSideTab === 'task' ? (
              <>
                <h1>{lesson.subtitle}</h1>
                <div className="difficulty-row">
                  <span className={`diff-pill ${lesson.difficulty.toLowerCase()}`}>{lesson.difficulty}</span>
                </div>
                
                <div className="content-md">
                  {lesson.instruction.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>

                <div className="hint-stack">
                  <button className={`hint-btn-elite ${showHint >= 1 ? 'active' : ''}`} onClick={() => setShowHint(1)}>
                    <Lightbulb size={14} /> Logic Hint
                  </button>
                  {showHint >= 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hint-box-elite">
                      <p>{lesson.indirectHint}</p>
                      <button className="sub-hint" onClick={() => setShowHint(2)}>Need the code?</button>
                    </motion.div>
                  )}
                  {showHint >= 2 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hint-box-elite code">
                      <code>{lesson.quest}</code>
                    </motion.div>
                  )}
                </div>
              </>
            ) : (
              <div className="docs-content">
                {currentTopicDoc ? (
                  <>
                    <p className="docs-phase">{currentPhaseDocs.phase} - TOPIC {currentTopicDoc.id}</p>
                    <h1>{currentTopicDoc.title}</h1>
                    <div className="doc-section">
                      <div className="doc-desc">
                        {currentTopicDoc.content.split('\n').map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="empty-state">
                    <FileText size={48} className="muted" />
                    <h3>No Documentation</h3>
                    <p>Documentation for this specific topic is coming soon.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Panel 2: Editor */}
        <div className="panel editor-panel-elite">
          <div className="panel-tabs">
            <div className="tab active">solution.cs</div>
            <button className="reset-btn-elite" onClick={() => setCode(lesson.starterCode)}><RotateCcw size={12} /></button>
          </div>
          <div className="editor-frame-elite">
            <Editor
              height="100%"
              defaultLanguage={lesson.language === 'csharp' ? 'csharp' : 'python'}
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val)}
              onMount={handleEditorDidMount}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                padding: { top: 20 },
                automaticLayout: true,
                fontFamily: "'Fira Code', monospace",
              }}
            />
          </div>
        </div>

        {/* Panel 3: Preview */}
        <div className="panel preview-panel-elite">
          <div className="panel-tabs">
            <div className="tab active"><Maximize2 size={12} /> Unity Simulator</div>
          </div>
          <div className="preview-wrap">
            <GamePreview scene={lesson.scene} lastSubmission={submission} />
            
            <div className="console-elite">
              <div className="console-header-elite"><Terminal size={12} /> System Console</div>
              <div className="console-body-elite scrollbar">
                {logs.map((log, i) => (
                  <div key={i} className={`log-entry ${log.type || ''}`}>
                    <span className="log-time">[{log.time}]</span>
                    <span className="log-msg">{log.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningArea;
