import { useEffect, useMemo, useState } from 'react';

const lessons = [
  {
    id: 'cs-001',
    zone: 'Spawn Grounds',
    title: 'What C# Is',
    tier: 'Fundamentals',
    difficulty: 'Beginner',
    xp: 80,
    enemy: 'Syntax Slime',
    prompt: 'Write a C# line that prints your hero name.',
    starter: 'Console.WriteLine("Hero");',
    answerHints: ['Console.WriteLine', '"'],
    learn:
      'C# is a strongly typed language used heavily in Unity. Your first spell is printing text so you can see what the program is doing.',
    docs: ['Microsoft C# guide', 'Unity scripting overview']
  },
  {
    id: 'cs-002',
    zone: 'Variable Fields',
    title: 'Variables and Types',
    tier: 'Fundamentals',
    difficulty: 'Beginner',
    xp: 90,
    enemy: 'Integer Imp',
    prompt: 'Create an int named health with the value 100.',
    starter: 'int health = 100;',
    answerHints: ['int', 'health', '100'],
    learn:
      'Variables store information. In C#, every variable has a type: int for whole numbers, float for decimals, string for text, and bool for true/false.'
  },
  {
    id: 'cs-003',
    zone: 'Decision Caves',
    title: 'If Statements',
    tier: 'Fundamentals',
    difficulty: 'Beginner',
    xp: 110,
    enemy: 'Branch Bat',
    prompt: 'Write an if statement that checks if health is greater than 0.',
    starter: 'if (health > 0)\n{\n    Console.WriteLine("Alive");\n}',
    answerHints: ['if', 'health', '> 0'],
    learn:
      'Games constantly ask questions: is the player alive, did a hit land, is the door unlocked? if statements control those branches.'
  },
  {
    id: 'cs-004',
    zone: 'Loop Ruins',
    title: 'Loops',
    tier: 'Fundamentals',
    difficulty: 'Beginner',
    xp: 120,
    enemy: 'For-Loop Wisp',
    prompt: 'Write a for loop that runs 3 times.',
    starter: 'for (int i = 0; i < 3; i++)\n{\n    Console.WriteLine(i);\n}',
    answerHints: ['for', 'int i', 'i < 3', 'i++'],
    learn:
      'Loops repeat actions. In Unity they help with spawning enemies, checking inventory slots, and applying effects over collections.'
  },
  {
    id: 'cs-005',
    zone: 'Method Forge',
    title: 'Methods',
    tier: 'Core C#',
    difficulty: 'Novice',
    xp: 150,
    enemy: 'Function Golem',
    prompt: 'Create a void method named Attack.',
    starter: 'void Attack()\n{\n    Console.WriteLine("Slash");\n}',
    answerHints: ['void', 'Attack', '()'],
    learn:
      'Methods group behavior into reusable actions. In games, Jump, Attack, TakeDamage, and Heal are usually methods.'
  },
  {
    id: 'cs-006',
    zone: 'Object Keep',
    title: 'Classes and Objects',
    tier: 'Core C#',
    difficulty: 'Novice',
    xp: 170,
    enemy: 'Class Knight',
    prompt: 'Create a class named Player with an int health field.',
    starter: 'class Player\n{\n    public int health = 100;\n}',
    answerHints: ['class', 'Player', 'int health'],
    learn:
      'Classes are blueprints. Objects are live instances made from those blueprints. Unity components are classes attached to GameObjects.'
  },
  {
    id: 'cs-007',
    zone: 'Collection Grove',
    title: 'Arrays and Lists',
    tier: 'Core C#',
    difficulty: 'Intermediate',
    xp: 190,
    enemy: 'Array Hydra',
    prompt: 'Create a List<string> named inventory.',
    starter: 'List<string> inventory = new List<string>();',
    answerHints: ['List<string>', 'inventory', 'new List<string>'],
    learn:
      'Collections hold many values. Inventories, enemy waves, dialogue lines, and unlocked abilities all use collections.'
  },
  {
    id: 'cs-008',
    zone: 'Unity Gate',
    title: 'MonoBehaviour Basics',
    tier: 'Unity C#',
    difficulty: 'Intermediate',
    xp: 220,
    enemy: 'Component Sentinel',
    prompt: 'Create a Unity class that inherits from MonoBehaviour.',
    starter: 'public class PlayerController : MonoBehaviour\n{\n}',
    answerHints: ['class', ': MonoBehaviour'],
    learn:
      'MonoBehaviour is the base class for most Unity scripts. It lets your C# code live on GameObjects and receive Unity events.'
  },
  {
    id: 'cs-009',
    zone: 'Frame Forest',
    title: 'Start and Update',
    tier: 'Unity C#',
    difficulty: 'Intermediate',
    xp: 240,
    enemy: 'Frame Phantom',
    prompt: 'Write an Update method for code that runs every frame.',
    starter: 'void Update()\n{\n    transform.Rotate(0, 90 * Time.deltaTime, 0);\n}',
    answerHints: ['void Update', 'Time.deltaTime'],
    learn:
      'Start runs when a component begins. Update runs every frame. Time.deltaTime keeps movement smooth across different frame rates.'
  },
  {
    id: 'cs-010',
    zone: 'Input Citadel',
    title: 'Player Movement',
    tier: 'Unity C#',
    difficulty: 'Advanced',
    xp: 280,
    enemy: 'Input Warlock',
    prompt: 'Read horizontal input and move a transform.',
    starter:
      'float x = Input.GetAxis("Horizontal");\ntransform.Translate(Vector3.right * x * speed * Time.deltaTime);',
    answerHints: ['Input.GetAxis', 'transform.Translate', 'Time.deltaTime'],
    learn:
      'Movement combines input, vectors, speed, and frame-rate independent timing. This is one of the first real Unity gameplay loops.'
  },
  {
    id: 'cs-011',
    zone: 'Physics Depths',
    title: 'Collisions and Triggers',
    tier: 'Unity C#',
    difficulty: 'Advanced',
    xp: 320,
    enemy: 'Collider Beast',
    prompt: 'Write an OnTriggerEnter method with a Collider parameter.',
    starter: 'void OnTriggerEnter(Collider other)\n{\n    Debug.Log(other.name);\n}',
    answerHints: ['OnTriggerEnter', 'Collider other'],
    learn:
      'Triggers and collisions let Unity tell your scripts when objects touch. Coins, hazards, bullets, doors, and checkpoints all use this.'
  },
  {
    id: 'cs-012',
    zone: 'Boss Arena',
    title: 'Build a Mini Game Loop',
    tier: 'Unity C#',
    difficulty: 'Boss',
    xp: 500,
    enemy: 'Null Reference Dragon',
    prompt: 'Write a TakeDamage method that reduces health and calls Die when health reaches 0.',
    starter:
      'void TakeDamage(int amount)\n{\n    health -= amount;\n    if (health <= 0)\n    {\n        Die();\n    }\n}',
    answerHints: ['TakeDamage', 'health -=', 'if', '<= 0', 'Die()'],
    learn:
      'The boss combines methods, variables, conditionals, and game logic. This pattern appears in almost every combat or survival game.'
  }
];

const quizzes = [
  {
    question: 'Which C# type stores whole numbers?',
    options: ['int', 'string', 'bool'],
    answer: 'int'
  },
  {
    question: 'Which Unity method runs once per frame?',
    options: ['Update', 'AwakeOnly', 'Repeat'],
    answer: 'Update'
  },
  {
    question: 'What does Time.deltaTime help with?',
    options: ['Frame-rate independent movement', 'Saving files', 'Changing scenes'],
    answer: 'Frame-rate independent movement'
  },
  {
    question: 'What is a class?',
    options: ['A blueprint for objects', 'Only a number', 'A Unity scene file'],
    answer: 'A blueprint for objects'
  }
];

const docs = [
  {
    title: 'C# Fundamentals',
    text: 'Types, variables, methods, classes, collections, exceptions, and async basics.',
    link: 'https://learn.microsoft.com/dotnet/csharp/'
  },
  {
    title: 'Unity Scripting',
    text: 'MonoBehaviour, lifecycle methods, GameObjects, components, physics, input, and scenes.',
    link: 'https://docs.unity3d.com/Manual/ScriptingSection.html'
  },
  {
    title: 'Unity API',
    text: 'Reference for Transform, Rigidbody, Collider, Time, Input, Debug, and engine classes.',
    link: 'https://docs.unity3d.com/ScriptReference/'
  }
];

const initialProfile = {
  xp: 0,
  level: 1,
  streak: 1,
  wins: 0,
  bossWins: 0,
  completed: [],
  quizWins: 0,
  themeCode: ':root {\n  --accent: #57e39f;\n  --accent-2: #7aa2ff;\n}'
};

function loadProfile() {
  const saved = localStorage.getItem('codespawn-profile');
  return saved ? { ...initialProfile, ...JSON.parse(saved) } : initialProfile;
}

function getLevel(xp) {
  return Math.floor(xp / 300) + 1;
}

function App() {
  const [profile, setProfile] = useState(loadProfile);
  const [activeLessonId, setActiveLessonId] = useState(lessons[0].id);
  const [code, setCode] = useState(lessons[0].starter);
  const [battleLog, setBattleLog] = useState('Choose a lesson, write the spell, then defeat the enemy.');
  const [quizIndex, setQuizIndex] = useState(0);
  const [mode, setMode] = useState('dark');
  const [activePanel, setActivePanel] = useState('arena');
  const [themeCode, setThemeCode] = useState(profile.themeCode);

  const completedSet = useMemo(() => new Set(profile.completed), [profile.completed]);
  const activeLesson = lessons.find((lesson) => lesson.id === activeLessonId) || lessons[0];
  const unlockedCount = Math.min(completedSet.size + 1, lessons.length);
  const progressPercent = Math.round((completedSet.size / lessons.length) * 100);

  useEffect(() => {
    localStorage.setItem('codespawn-profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  useEffect(() => {
    const style = document.getElementById('codespawn-theme-code') || document.createElement('style');
    style.id = 'codespawn-theme-code';
    style.textContent = themeCode;
    document.head.appendChild(style);
  }, [themeCode]);

  const selectLesson = (lesson) => {
    const lessonIndex = lessons.findIndex((item) => item.id === lesson.id);
    if (lessonIndex > unlockedCount - 1) {
      setBattleLog('This zone is locked. Clear the previous enemy to unlock it.');
      return;
    }

    setActiveLessonId(lesson.id);
    setCode(lesson.starter);
    setActivePanel('arena');
    setBattleLog(`${lesson.enemy} is waiting. Read the lesson, then cast your C# spell.`);
  };

  const submitCode = () => {
    const normalized = code.toLowerCase();
    const passed = activeLesson.answerHints.every((hint) => normalized.includes(hint.toLowerCase()));

    if (!passed) {
      setBattleLog('The enemy resisted. Add the required C# pieces and try again.');
      return;
    }

    const alreadyDone = completedSet.has(activeLesson.id);
    const xpGain = alreadyDone ? 20 : activeLesson.xp;
    const nextCompleted = alreadyDone ? profile.completed : [...profile.completed, activeLesson.id];

    setProfile((current) => ({
      ...current,
      xp: current.xp + xpGain,
      level: getLevel(current.xp + xpGain),
      wins: current.wins + 1,
      bossWins: activeLesson.difficulty === 'Boss' && !alreadyDone ? current.bossWins + 1 : current.bossWins,
      completed: nextCompleted
    }));

    setBattleLog(
      alreadyDone
        ? `Training victory. ${activeLesson.enemy} dropped ${xpGain} XP.`
        : `${activeLesson.enemy} defeated. You earned ${xpGain} XP and unlocked the next topic.`
    );
  };

  const answerQuiz = (answer) => {
    const quiz = quizzes[quizIndex];
    if (answer === quiz.answer) {
      setProfile((current) => ({
        ...current,
        xp: current.xp + 60,
        level: getLevel(current.xp + 60),
        quizWins: current.quizWins + 1
      }));
      setBattleLog('Quiz crystal cleared. +60 XP.');
    } else {
      setBattleLog(`Memory check missed. Correct answer: ${quiz.answer}.`);
    }
    setQuizIndex((quizIndex + 1) % quizzes.length);
  };

  const saveThemeCode = () => {
    setProfile((current) => ({ ...current, themeCode }));
    setBattleLog('Theme code applied. Your UI spell is active.');
  };

  const resetProgress = () => {
    setProfile(initialProfile);
    setThemeCode(initialProfile.themeCode);
    setActiveLessonId(lessons[0].id);
    setCode(lessons[0].starter);
    setBattleLog('Progress reset. Fresh spawn, clean slate.');
  };

  return (
    <main className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">CS</span>
          <div>
            <h1>CodeSpawn</h1>
            <p>C# to Unity RPG Academy</p>
          </div>
        </div>

        <nav className="nav">
          {['arena', 'map', 'quiz', 'docs', 'profile', 'customize'].map((panel) => (
            <button
              className={activePanel === panel ? 'active' : ''}
              key={panel}
              onClick={() => setActivePanel(panel)}
              type="button"
            >
              {panel}
            </button>
          ))}
        </nav>

        <section className="profile-card">
          <div className="avatar">D</div>
          <div>
            <strong>Dev Spawn</strong>
            <span>Level {profile.level} C# Apprentice</span>
          </div>
          <div className="xp-bar">
            <span style={{ width: `${profile.xp % 300 / 3}%` }} />
          </div>
          <small>{profile.xp % 300}/300 XP to next level</small>
        </section>

        <button className="ghost-button" onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')} type="button">
          {mode === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Zero to advanced path</p>
            <h2>Learn C# by fighting through a Unity RPG world</h2>
          </div>
          <div className="stat-strip">
            <span>{profile.xp} XP</span>
            <span>{profile.streak} day streak</span>
            <span>{progressPercent}% path</span>
          </div>
        </header>

        {activePanel === 'arena' && (
          <section className="arena-grid">
            <article className="lesson-card">
              <div className="lesson-header">
                <div>
                  <p className="eyebrow">{activeLesson.zone}</p>
                  <h3>{activeLesson.title}</h3>
                </div>
                <span className={`badge ${activeLesson.difficulty.toLowerCase()}`}>{activeLesson.difficulty}</span>
              </div>
              <p>{activeLesson.learn}</p>
              <div className="prompt-box">
                <strong>Quest</strong>
                <span>{activeLesson.prompt}</span>
              </div>
              <div className="doc-tags">
                {(activeLesson.docs || ['C# guide', 'Unity manual']).map((doc) => (
                  <span key={doc}>{doc}</span>
                ))}
              </div>
            </article>

            <article className="battle-card">
              <div className="enemy">
                <div className="enemy-core">{activeLesson.difficulty === 'Boss' ? 'BOSS' : 'ENEMY'}</div>
                <div>
                  <p className="eyebrow">Encounter</p>
                  <h3>{activeLesson.enemy}</h3>
                  <span>{activeLesson.xp} XP reward</span>
                </div>
              </div>
              <textarea value={code} onChange={(event) => setCode(event.target.value)} spellCheck="false" />
              <div className="battle-actions">
                <button className="primary-button" onClick={submitCode} type="button">
                  Cast Code
                </button>
                <button className="ghost-button" onClick={() => setCode(activeLesson.starter)} type="button">
                  Reset spell
                </button>
              </div>
              <p className="battle-log">{battleLog}</p>
            </article>
          </section>
        )}

        {activePanel === 'map' && (
          <section className="map-grid">
            {lessons.map((lesson, index) => {
              const locked = index > unlockedCount - 1;
              return (
                <button
                  className={`map-node ${completedSet.has(lesson.id) ? 'done' : ''} ${locked ? 'locked' : ''}`}
                  key={lesson.id}
                  onClick={() => selectLesson(lesson)}
                  type="button"
                >
                  <span>{index + 1}</span>
                  <strong>{lesson.title}</strong>
                  <small>{lesson.zone}</small>
                </button>
              );
            })}
          </section>
        )}

        {activePanel === 'quiz' && (
          <section className="panel-card">
            <p className="eyebrow">Memory Trial</p>
            <h3>{quizzes[quizIndex].question}</h3>
            <div className="quiz-options">
              {quizzes[quizIndex].options.map((option) => (
                <button key={option} onClick={() => answerQuiz(option)} type="button">
                  {option}
                </button>
              ))}
            </div>
          </section>
        )}

        {activePanel === 'docs' && (
          <section className="docs-grid">
            {docs.map((doc) => (
              <a className="doc-card" href={doc.link} key={doc.title} rel="noreferrer" target="_blank">
                <p className="eyebrow">Documentation</p>
                <h3>{doc.title}</h3>
                <span>{doc.text}</span>
              </a>
            ))}
          </section>
        )}

        {activePanel === 'profile' && (
          <section className="profile-grid">
            {[
              ['Level', profile.level],
              ['XP', profile.xp],
              ['Enemies defeated', profile.wins],
              ['Boss victories', profile.bossWins],
              ['Quiz wins', profile.quizWins],
              ['Daily streak', `${profile.streak} day`]
            ].map(([label, value]) => (
              <article className="metric-card" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </article>
            ))}
            <article className="leaderboard">
              <h3>Leaderboard</h3>
              {[
                ['You', profile.xp],
                ['Astra', 2380],
                ['MonoMage', 1980],
                ['VectorKnight', 1540]
              ]
                .sort((a, b) => b[1] - a[1])
                .map(([name, xp], index) => (
                  <div key={name}>
                    <span>#{index + 1} {name}</span>
                    <strong>{xp} XP</strong>
                  </div>
                ))}
            </article>
            <button className="danger-button" onClick={resetProgress} type="button">
              Reset Progress
            </button>
          </section>
        )}

        {activePanel === 'customize' && (
          <section className="customizer">
            <article>
              <p className="eyebrow">Code-customizable UI</p>
              <h3>Change the academy colors with CSS</h3>
              <p>
                Edit CSS variables below. Try changing <code>--accent</code>, <code>--accent-2</code>, or
                <code> --radius</code>.
              </p>
              <textarea value={themeCode} onChange={(event) => setThemeCode(event.target.value)} spellCheck="false" />
              <button className="primary-button" onClick={saveThemeCode} type="button">
                Apply Theme Code
              </button>
            </article>
            <article className="preview-card">
              <span className="badge">Preview</span>
              <h3>Customized combat card</h3>
              <p>Your future users can unlock skins, editor themes, HUD styles, and profile frames by learning.</p>
            </article>
          </section>
        )}
      </section>
    </main>
  );
}

export default App;
