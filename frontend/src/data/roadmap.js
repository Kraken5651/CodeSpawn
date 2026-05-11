// Complete C# Masterclass Roadmap — 40 Topics, 9 Phases
// Each topic has subtopics with difficulty levels (easy/medium/hard)
// This file is the single source of truth for the entire curriculum structure

export const roadmap = [
  {
    phase: 1, emoji: "🟢", title: "Absolute Foundations", color: "#00ffa3",
    description: "Learn these before anything else. No shortcuts.",
    topics: [
      { id: 1, title: "How C# Works", subtopics: [
        { t: "What is a compiled language", d: "easy" },
        { t: "How .NET and the CLR work", d: "easy" },
        { t: "What a namespace is (using System;)", d: "easy" },
        { t: "How a C# program runs (entry point)", d: "easy" },
        { t: "Comments: // single, /* */ multi, /// XML", d: "easy" }
      ]},
      { id: 2, title: "Variables & Data Types", subtopics: [
        { t: "int, float, double, decimal", d: "easy" },
        { t: "string, char", d: "easy" },
        { t: "bool", d: "easy" },
        { t: "byte, short, long", d: "easy" },
        { t: "Declaring vs initializing", d: "easy" },
        { t: "var keyword (type inference)", d: "medium" },
        { t: "Constants: const vs readonly", d: "medium" },
        { t: "Default values", d: "easy" }
      ]},
      { id: 3, title: "Type Conversion & Casting", subtopics: [
        { t: "Implicit conversion (safe, no data loss)", d: "easy" },
        { t: "Explicit casting: (int)myFloat", d: "medium" },
        { t: "Convert.ToInt32(), Convert.ToString()", d: "medium" },
        { t: "int.Parse(), float.Parse()", d: "medium" },
        { t: "int.TryParse() (safe version)", d: "medium" },
        { t: "Boxing and unboxing", d: "hard" }
      ]},
      { id: 4, title: "Operators", subtopics: [
        { t: "Arithmetic: +, -, *, /, %", d: "easy" },
        { t: "Assignment: =, +=, -=, *=, /=", d: "easy" },
        { t: "Increment/decrement: ++, --", d: "easy" },
        { t: "Comparison: ==, !=, >, <, >=, <=", d: "easy" },
        { t: "Logical: &&, ||, !", d: "medium" },
        { t: "Bitwise: &, |, ^, ~, <<, >>", d: "hard" },
        { t: "Ternary: condition ? a : b", d: "medium" },
        { t: "Null-coalescing: ??, ??=", d: "hard" }
      ]},
      { id: 5, title: "String Operations", subtopics: [
        { t: "Concatenation with +", d: "easy" },
        { t: "String interpolation: $\"Hello {name}\"", d: "easy" },
        { t: "string.Format()", d: "medium" },
        { t: "Common methods: .Length, .ToUpper(), .ToLower(), .Trim(), .Contains(), .Replace(), .Split(), .Substring(), .IndexOf()", d: "medium" },
        { t: "Verbatim strings: @\"C:\\path\\file\"", d: "medium" },
        { t: "String comparison", d: "medium" },
        { t: "StringBuilder for performance", d: "hard" }
      ]}
    ]
  },
  {
    phase: 2, emoji: "🟡", title: "Control Flow", color: "#ffd700",
    description: "How a program makes decisions and repeats actions.",
    topics: [
      { id: 6, title: "Conditionals", subtopics: [
        { t: "if / else if / else", d: "easy" },
        { t: "Nested if statements", d: "easy" },
        { t: "switch statement", d: "medium" },
        { t: "switch expressions (C# 8+)", d: "hard" },
        { t: "Pattern matching basics", d: "hard" }
      ]},
      { id: 7, title: "Loops", subtopics: [
        { t: "for loop — anatomy, init/condition/step", d: "easy" },
        { t: "while loop", d: "easy" },
        { t: "do-while loop", d: "medium" },
        { t: "foreach loop", d: "medium" },
        { t: "Nested loops", d: "medium" },
        { t: "break — exit loop", d: "easy" },
        { t: "continue — skip iteration", d: "medium" },
        { t: "goto (exists, but avoid it)", d: "hard" },
        { t: "Infinite loops and how to avoid them", d: "medium" }
      ]}
    ]
  },
  {
    phase: 3, emoji: "🟠", title: "Collections & Data Structures", color: "#ff8c00",
    description: "Storing and working with multiple values.",
    topics: [
      { id: 8, title: "Arrays", subtopics: [
        { t: "Single-dimensional arrays", d: "easy" },
        { t: "Multi-dimensional arrays [,]", d: "medium" },
        { t: "Jagged arrays [][]", d: "hard" },
        { t: "Array initialization", d: "easy" },
        { t: "Array.Length, Array.Sort(), Array.Reverse(), Array.Contains()", d: "medium" },
        { t: "Iterating with for vs foreach", d: "medium" },
        { t: "Arrays in memory (value vs reference)", d: "hard" }
      ]},
      { id: 9, title: "Generic Collections", subtopics: [
        { t: "List<T> — Add, Remove, Contains, Count, Sort, Find", d: "medium" },
        { t: "Dictionary<TKey, TValue> — Add, Remove, ContainsKey, TryGetValue", d: "medium" },
        { t: "Queue<T> — Enqueue, Dequeue, Peek", d: "medium" },
        { t: "Stack<T> — Push, Pop, Peek", d: "medium" },
        { t: "HashSet<T> — unique values only", d: "hard" },
        { t: "LinkedList<T>", d: "hard" },
        { t: "When to use which", d: "hard" }
      ]},
      { id: 10, title: "LINQ", subtopics: [
        { t: "Where() — filter", d: "medium" },
        { t: "Select() — transform", d: "medium" },
        { t: "OrderBy() / OrderByDescending()", d: "medium" },
        { t: "FirstOrDefault(), LastOrDefault()", d: "medium" },
        { t: "Any(), All()", d: "hard" },
        { t: "Count(), Sum(), Min(), Max()", d: "medium" },
        { t: "GroupBy()", d: "hard" },
        { t: "ToList(), ToArray()", d: "easy" },
        { t: "Query syntax vs method syntax", d: "hard" },
        { t: "Deferred execution", d: "hard" }
      ]}
    ]
  },
  {
    phase: 4, emoji: "🔵", title: "Methods & Functions", color: "#4488ff",
    description: "Organising code into reusable blocks.",
    topics: [
      { id: 11, title: "Methods", subtopics: [
        { t: "Defining methods: access modifier, return type, name, parameters", d: "easy" },
        { t: "Calling methods", d: "easy" },
        { t: "void vs typed return", d: "easy" },
        { t: "return keyword", d: "easy" },
        { t: "Method overloading", d: "medium" },
        { t: "Optional/default parameters", d: "medium" },
        { t: "Named arguments", d: "medium" },
        { t: "params keyword (variable number of args)", d: "hard" },
        { t: "Static vs instance methods", d: "medium" },
        { t: "Recursion", d: "hard" },
        { t: "Expression-bodied methods =>", d: "medium" }
      ]},
      { id: 12, title: "Scope & Lifetime", subtopics: [
        { t: "Local scope (method level)", d: "easy" },
        { t: "Class scope (field level)", d: "easy" },
        { t: "Block scope ({})", d: "medium" },
        { t: "Variable shadowing", d: "medium" },
        { t: "Stack vs heap", d: "hard" },
        { t: "ref and out parameters", d: "hard" },
        { t: "in parameter modifier", d: "hard" }
      ]}
    ]
  },
  {
    phase: 5, emoji: "🔵", title: "Object Oriented Programming", color: "#6a5acd",
    description: "The heart of C# and Unity scripting.",
    topics: [
      { id: 13, title: "Classes & Objects", subtopics: [
        { t: "Defining a class", d: "easy" },
        { t: "Fields vs Properties", d: "medium" },
        { t: "Auto-implemented properties: { get; set; }", d: "medium" },
        { t: "Access modifiers: public, private, protected, internal", d: "medium" },
        { t: "Constructors — default, parameterized", d: "medium" },
        { t: "Constructor overloading", d: "hard" },
        { t: "this keyword", d: "medium" },
        { t: "Object initializer syntax", d: "medium" },
        { t: "static classes and members", d: "hard" }
      ]},
      { id: 14, title: "Encapsulation", subtopics: [
        { t: "Why private fields + public properties", d: "medium" },
        { t: "Getters and setters with logic", d: "medium" },
        { t: "Read-only properties", d: "medium" },
        { t: "[SerializeField] — Unity specific, critical", d: "medium" },
        { t: "Backing fields", d: "hard" }
      ]},
      { id: 15, title: "Inheritance", subtopics: [
        { t: "Base class and derived class", d: "medium" },
        { t: ": BaseClass syntax", d: "medium" },
        { t: "base keyword", d: "medium" },
        { t: "Calling base constructor", d: "hard" },
        { t: "protected members", d: "medium" },
        { t: "Method hiding with new", d: "hard" },
        { t: "Sealed classes", d: "hard" },
        { t: "Abstract classes and abstract methods", d: "hard" },
        { t: "When NOT to use inheritance", d: "hard" }
      ]},
      { id: 16, title: "Polymorphism", subtopics: [
        { t: "virtual methods", d: "medium" },
        { t: "override keyword", d: "medium" },
        { t: "Runtime polymorphism", d: "hard" },
        { t: "is keyword type checking", d: "medium" },
        { t: "as keyword safe casting", d: "hard" }
      ]},
      { id: 17, title: "Interfaces", subtopics: [
        { t: "Defining an interface", d: "medium" },
        { t: "Implementing multiple interfaces", d: "hard" },
        { t: "Interface vs abstract class", d: "hard" },
        { t: "Common built-in: IComparable, IEnumerable, IDisposable", d: "hard" },
        { t: "Default interface methods (C# 8+)", d: "hard" }
      ]},
      { id: 18, title: "Structs & Enums", subtopics: [
        { t: "struct — value type, stack allocated", d: "medium" },
        { t: "When to use struct vs class", d: "hard" },
        { t: "enum — named integer constants", d: "easy" },
        { t: "Enum flags: [Flags]", d: "hard" },
        { t: "Casting enum to int and back", d: "medium" },
        { t: "Enums in switch statements", d: "medium" }
      ]}
    ]
  },
  {
    phase: 6, emoji: "🟣", title: "Advanced C# Features", color: "#9b59b6",
    description: "This is where most tutorials stop. This is where you get good.",
    topics: [
      { id: 19, title: "Exception Handling", subtopics: [
        { t: "try / catch / finally", d: "medium" },
        { t: "Catching specific exceptions", d: "medium" },
        { t: "throw and throw ex (re-throw)", d: "hard" },
        { t: "Custom exceptions", d: "hard" },
        { t: "when clause in catch", d: "hard" }
      ]},
      { id: 20, title: "Delegates & Events", subtopics: [
        { t: "What a delegate is (function pointer)", d: "medium" },
        { t: "Action<> and Func<> built-in delegates", d: "hard" },
        { t: "event keyword", d: "hard" },
        { t: "Publisher/subscriber pattern", d: "hard" },
        { t: "Lambda expressions: x => x * 2", d: "medium" },
        { t: "Closures and captured variables", d: "hard" }
      ]},
      { id: 21, title: "Generics", subtopics: [
        { t: "Generic methods: void Do<T>(T item)", d: "hard" },
        { t: "Generic classes: class Box<T>", d: "hard" },
        { t: "Generic constraints: where T : class", d: "hard" },
        { t: "Why generics exist (type safety, no boxing)", d: "hard" }
      ]},
      { id: 22, title: "Iterators & Enumerables", subtopics: [
        { t: "IEnumerable<T> and IEnumerator<T>", d: "hard" },
        { t: "yield return", d: "hard" },
        { t: "yield break", d: "hard" },
        { t: "How foreach works under the hood", d: "hard" }
      ]},
      { id: 23, title: "Async / Await", subtopics: [
        { t: "async keyword", d: "hard" },
        { t: "await keyword", d: "hard" },
        { t: "Task and Task<T>", d: "hard" },
        { t: "async void (and why it is dangerous)", d: "hard" },
        { t: "Unity: async vs Coroutines", d: "hard" }
      ]},
      { id: 24, title: "Nullable Types", subtopics: [
        { t: "int?, string?", d: "medium" },
        { t: "?. null-conditional operator", d: "medium" },
        { t: "?? null-coalescing", d: "medium" },
        { t: "! null-forgiving operator", d: "hard" }
      ]},
      { id: 25, title: "Pattern Matching", subtopics: [
        { t: "is type patterns", d: "hard" },
        { t: "switch expression patterns", d: "hard" },
        { t: "Property patterns: { HP: > 0 }", d: "hard" }
      ]},
      { id: 26, title: "Records & Tuples", subtopics: [
        { t: "record types (C# 9+)", d: "hard" },
        { t: "Tuples: (int x, int y)", d: "medium" },
        { t: "Named tuples and deconstruction", d: "hard" }
      ]}
    ]
  },
  {
    phase: 7, emoji: "⚫", title: "Memory, Performance & Systems", color: "#555",
    description: "Critical for game development performance.",
    topics: [
      { id: 27, title: "Memory Management", subtopics: [
        { t: "Stack vs heap (deep understanding)", d: "hard" },
        { t: "Garbage collector — how it works", d: "hard" },
        { t: "GC pressure and why it matters in games", d: "hard" },
        { t: "IDisposable and using statement", d: "hard" },
        { t: "Object pooling pattern", d: "hard" }
      ]},
      { id: 28, title: "Collections — Advanced", subtopics: [
        { t: "Span<T> and Memory<T> (zero-allocation)", d: "hard" },
        { t: "ArrayPool<T>", d: "hard" },
        { t: "NativeArray<T> (Unity DOTS)", d: "hard" }
      ]},
      { id: 29, title: "Unsafe Code & Pointers", subtopics: [
        { t: "unsafe keyword", d: "hard" },
        { t: "Pointers: int*", d: "hard" },
        { t: "stackalloc", d: "hard" },
        { t: "When this is relevant (Unity Burst compiler)", d: "hard" }
      ]}
    ]
  },
  {
    phase: 8, emoji: "🎮", title: "Unity-Specific C#", color: "#00ffa3",
    description: "This is what you actually use every day.",
    topics: [
      { id: 30, title: "MonoBehaviour Lifecycle", subtopics: [
        { t: "Awake() — first, even if disabled", d: "medium" },
        { t: "OnEnable() / OnDisable()", d: "medium" },
        { t: "Start() — before first frame", d: "easy" },
        { t: "Update() — every frame", d: "easy" },
        { t: "FixedUpdate() — physics timestep", d: "medium" },
        { t: "LateUpdate() — after all Updates", d: "medium" },
        { t: "OnDestroy()", d: "medium" },
        { t: "Execution order", d: "hard" }
      ]},
      { id: 31, title: "Unity Serialization", subtopics: [
        { t: "public fields appear in Inspector", d: "easy" },
        { t: "[SerializeField] — private but visible", d: "easy" },
        { t: "[Header], [Tooltip], [Range], [Space]", d: "medium" },
        { t: "ScriptableObject — data containers", d: "hard" },
        { t: "JsonUtility for save data", d: "hard" },
        { t: "PlayerPrefs for simple persistence", d: "medium" }
      ]},
      { id: 32, title: "Component System", subtopics: [
        { t: "GetComponent<T>()", d: "easy" },
        { t: "GetComponentInChildren/Parent<T>()", d: "medium" },
        { t: "Caching components in Awake()", d: "medium" },
        { t: "AddComponent<T>() at runtime", d: "hard" },
        { t: "TryGetComponent<T>() (no allocation)", d: "hard" }
      ]},
      { id: 33, title: "Coroutines", subtopics: [
        { t: "IEnumerator return type", d: "medium" },
        { t: "StartCoroutine() / StopCoroutine()", d: "medium" },
        { t: "yield return null — wait one frame", d: "medium" },
        { t: "yield return new WaitForSeconds(t)", d: "medium" },
        { t: "WaitUntil / WaitWhile", d: "hard" },
        { t: "When to use coroutines vs async/await", d: "hard" }
      ]},
      { id: 34, title: "Events & Messaging", subtopics: [
        { t: "UnityEvent — serializable events", d: "medium" },
        { t: "C# delegates and events in Unity", d: "hard" },
        { t: "Action events pattern", d: "hard" },
        { t: "Observer pattern implementation", d: "hard" }
      ]},
      { id: 35, title: "Unity Math", subtopics: [
        { t: "Vector2, Vector3, Vector4", d: "easy" },
        { t: "Quaternion — rotations", d: "hard" },
        { t: "Time.deltaTime", d: "easy" },
        { t: "Lerp, SLerp, MoveTowards", d: "medium" },
        { t: "Clamp, Approximately", d: "medium" },
        { t: "Physics.Raycast and raycasting", d: "hard" }
      ]},
      { id: 36, title: "Design Patterns in Unity", subtopics: [
        { t: "Singleton (GameManager, AudioManager)", d: "medium" },
        { t: "Object Pooling (bullets, particles)", d: "hard" },
        { t: "State Machine (player states, enemy AI)", d: "hard" },
        { t: "Observer / Event System", d: "hard" },
        { t: "Factory Pattern (spawning)", d: "hard" },
        { t: "ScriptableObject architecture", d: "hard" }
      ]}
    ]
  },
  {
    phase: 9, emoji: "🏆", title: "Professional Practices", color: "#ffd700",
    description: "Separates someone who codes from someone who engineers.",
    topics: [
      { id: 37, title: "Code Architecture", subtopics: [
        { t: "SOLID principles", d: "hard" },
        { t: "DRY (Don't Repeat Yourself)", d: "medium" },
        { t: "Separation of concerns", d: "hard" },
        { t: "Dependency injection basics", d: "hard" },
        { t: "Component composition over deep inheritance", d: "hard" }
      ]},
      { id: 38, title: "Debugging & Testing", subtopics: [
        { t: "Debug.Log, Debug.LogWarning, Debug.LogError", d: "easy" },
        { t: "Debug.DrawLine, DrawRay (visual debugging)", d: "medium" },
        { t: "Unit testing with NUnit", d: "hard" },
        { t: "Unity Test Framework", d: "hard" }
      ]},
      { id: 39, title: "Performance Profiling", subtopics: [
        { t: "Unity Profiler — CPU, GPU, memory", d: "hard" },
        { t: "Avoiding GC allocations in Update()", d: "hard" },
        { t: "Camera.main is slow (cache it)", d: "medium" },
        { t: "[BurstCompile] basics", d: "hard" },
        { t: "Job System basics", d: "hard" }
      ]},
      { id: 40, title: "Source Control & Project Structure", subtopics: [
        { t: "Git fundamentals", d: "medium" },
        { t: ".gitignore for Unity", d: "easy" },
        { t: "Folder structure conventions", d: "easy" },
        { t: "Assembly definitions (asmdef)", d: "hard" },
        { t: "Naming conventions (PascalCase, camelCase, _privateField)", d: "medium" }
      ]}
    ]
  }
];

// Timeline data
export const timeline = [
  { phases: "1-2", content: "Foundations + Control Flow", time: "3-4 weeks" },
  { phases: "3-4", content: "Collections + Methods", time: "3 weeks" },
  { phases: "5", content: "Full OOP", time: "4-5 weeks" },
  { phases: "6", content: "Advanced Features", time: "5-6 weeks" },
  { phases: "7", content: "Memory & Performance", time: "2-3 weeks" },
  { phases: "8", content: "Unity-Specific", time: "Ongoing alongside projects" },
  { phases: "9", content: "Professional Practices", time: "Ongoing" }
];

// Helper: get total topic count
export const getTotalTopics = () => roadmap.reduce((sum, p) => sum + p.topics.length, 0);

// Helper: get total subtopic count
export const getTotalSubtopics = () => roadmap.reduce((sum, p) =>
  sum + p.topics.reduce((s, t) => s + t.subtopics.length, 0), 0);

// Helper: get subtopics by difficulty
export const getByDifficulty = (level) => {
  const results = [];
  roadmap.forEach(phase => {
    phase.topics.forEach(topic => {
      topic.subtopics.forEach(sub => {
        if (sub.d === level) results.push({ phase: phase.phase, topic: topic.title, subtopic: sub.t });
      });
    });
  });
  return results;
};
