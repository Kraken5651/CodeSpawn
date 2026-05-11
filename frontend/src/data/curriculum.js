import { roadmap } from './roadmap';

export const languages = [
  { id: 'csharp-core', name: 'C# Masterclass (All 9 Phases)', icon: 'Cpu', color: '#8a2be2', description: 'The complete 40-topic roadmap from absolute foundations to advanced engineering.' },
  { id: 'js-core', name: 'JavaScript Basics', icon: 'Code', color: '#f7df1e', description: 'The language of the web. Variables, closures, promises.' },
  { id: 'js-game', name: 'JavaScript Game Dev', icon: 'Layout', color: '#ff6b6b', description: 'Create interactive 2D games directly in the browser.' },
  { id: 'python-core', name: 'Python Basics', icon: 'Terminal', color: '#ffde57', description: 'Simple syntax, powerful logic. From zero to data processing.' }
];

// Dynamically build paths from roadmap
export const paths = {
  "csharp-core": {
    id: "csharp-core",
    stages: roadmap.map(phase => ({
      id: `csc-p${phase.phase}`,
      title: `${phase.emoji} ${phase.title}`,
      lessons: phase.topics.map(topic => `csc-t${topic.id}`)
    }))
  },
  "js-core": { id: "js-core", stages: [{ id: "jsc-1", title: "Web Logic", lessons: ["jsc-1-1"] }] },
  "js-game": { id: "js-game", stages: [{ id: "jsg-1", title: "Canvas", lessons: ["jsg-1-1"] }] },
  "python-core": { id: "python-core", stages: [{ id: "pyc-1", title: "Python Basics", lessons: ["pyc-1-1"] }] }
};

export const curriculum = [
  // ================= PHASE 1: FOUNDATIONS =================
  {
    id: "csc-t1", language: "csharp", stageId: "csc-p1",
    title: "1. How C# Works", subtitle: "Compilers & Namespaces",
    difficulty: "Easy", xp: 100, category: "Phase 1: Foundations",
    instruction: "C# programs need a namespace and an entry point. Use 'using System;' to access console functions. Add a comment explaining what the code does.",
    quest: "using System;\n// Entry point for the application\nConsole.WriteLine(\"Hello World\");",
    starterCode: "// 1. Add 'using System;'\n// 2. Add a single-line comment\n// 3. Write Console.WriteLine(\"Ready\");\n",
    solutionHints: ["using System;", "//", "Console.WriteLine"],
    indirectHint: "Start with 'using System;' at the top. Comments start with '//'.",
    scene: { type: "ui-preview", playerSprite: "knight", label: "Runtime Initialized" }
  },
  {
    id: "csc-t2", language: "csharp", stageId: "csc-p1",
    title: "2. Variables & Data Types", subtitle: "Value Types",
    difficulty: "Easy", xp: 100, category: "Phase 1: Foundations",
    instruction: "Declare an integer 'health' and a float 'speed'. Initialize them with values 100 and 5.5f.",
    quest: "int health = 100;\nfloat speed = 5.5f;",
    starterCode: "public class Player {\n    public void Init() {\n        // Declare int 'health'\n        // Declare float 'speed'\n    }\n}",
    solutionHints: ["int health = 100", "float speed = 5.5f"],
    indirectHint: "Floats need an 'f' suffix, e.g., 5.5f.",
    scene: { type: "ui-preview", playerSprite: "knight", label: "Stats Allocated" }
  },
  {
    id: "csc-t3", language: "csharp", stageId: "csc-p1",
    title: "3. Type Casting", subtitle: "Implicit & Explicit",
    difficulty: "Easy", xp: 100, category: "Phase 1: Foundations",
    instruction: "Safely convert a string to an int using int.TryParse. Also explicitly cast a double to an int.",
    quest: "int.TryParse(\"10\", out int result);\nint castedValue = (int)5.5;",
    starterCode: "public class Converter {\n    public void Run() {\n        string input = \"50\";\n        double val = 9.99;\n        \n        // 1. TryParse 'input' into 'bonus'\n        // 2. Cast 'val' to int 'truncated'\n    }\n}",
    solutionHints: ["int.TryParse", "out int", "(int)val"],
    indirectHint: "Use (int)variable for explicit casting. TryParse uses an 'out' parameter.",
    scene: { type: "ui-preview", playerSprite: "knight", label: "Types Converted" }
  },
  {
    id: "csc-t4", language: "csharp", stageId: "csc-p1",
    title: "4. Operators", subtitle: "Arithmetic & Logic",
    difficulty: "Easy", xp: 100, category: "Phase 1: Foundations",
    instruction: "Use the increment operator (++) and the null-coalescing operator (??) to set a default name.",
    quest: "score++;\nstring activeName = playerName ?? \"Guest\";",
    starterCode: "public class Game {\n    public void Update(string playerName, int score) {\n        // 1. Increment score\n        // 2. Set 'activeName' using ?? for playerName\n    }\n}",
    solutionHints: ["score++", "?? \"Guest\""],
    indirectHint: "?? returns the right side if the left side is null.",
    scene: { type: "ui-preview", playerSprite: "knight", label: "Logic Applied" }
  },
  {
    id: "csc-t5", language: "csharp", stageId: "csc-p1",
    title: "5. Strings", subtitle: "Interpolation & Builder",
    difficulty: "Easy", xp: 100, category: "Phase 1: Foundations",
    instruction: "Use string interpolation to format a message: $\"Score: {score}\".",
    quest: "string msg = $\"Score: {score}\";",
    starterCode: "public class UI {\n    public void Show(int score) {\n        // Create interpolated string 'msg'\n    }\n}",
    solutionHints: ["$\"Score: {score}\""],
    indirectHint: "String interpolation starts with $ followed by double quotes.",
    scene: { type: "ui-preview", playerSprite: "knight", label: "UI Text Formatted" }
  },

  // ================= PHASE 2: CONTROL FLOW =================
  {
    id: "csc-t6", language: "csharp", stageId: "csc-p2",
    title: "6. Conditionals", subtitle: "If & Switch",
    difficulty: "Medium", xp: 150, category: "Phase 2: Flow",
    instruction: "Write a switch expression that returns 1 for \"Easy\", 2 for \"Hard\", and 0 for anything else.",
    quest: "int difficulty = mode switch {\n    \"Easy\" => 1,\n    \"Hard\" => 2,\n    _ => 0\n};",
    starterCode: "public class Settings {\n    public int GetLevel(string mode) {\n        // Use a switch expression\n    }\n}",
    solutionHints: ["switch", "=>", "_ =>"],
    indirectHint: "Switch expressions use => for mapping cases.",
    scene: { type: "gate-logic", playerSprite: "knight" }
  },
  {
    id: "csc-t7", language: "csharp", stageId: "csc-p2",
    title: "7. Loops", subtitle: "For & Foreach",
    difficulty: "Medium", xp: 150, category: "Phase 2: Flow",
    instruction: "Use a foreach loop to iterate through a list of names and print them.",
    quest: "foreach (var name in names) {\n    Console.WriteLine(name);\n}",
    starterCode: "using System;\nusing System.Collections.Generic;\n\npublic class ListPrinter {\n    public void Print(List<string> names) {\n        // Write foreach loop\n    }\n}",
    solutionHints: ["foreach", "in names", "Console.WriteLine"],
    indirectHint: "foreach (var item in collection) is the syntax.",
    scene: { type: "loop", playerSprite: "knight" }
  },

  // ================= PHASE 3: COLLECTIONS =================
  {
    id: "csc-t8", language: "csharp", stageId: "csc-p3",
    title: "8. Arrays", subtitle: "Fixed Collections",
    difficulty: "Medium", xp: 200, category: "Phase 3: Data",
    instruction: "Initialize an array of 3 integers and set the first value to 10.",
    quest: "int[] scores = new int[3];\nscores[0] = 10;",
    starterCode: "public class HighScore {\n    public void Init() {\n        // Create array 'scores' and set first index\n    }\n}",
    solutionHints: ["int[]", "new int[3]", "scores[0] = 10"],
    indirectHint: "Arrays use [] and are indexed starting from 0.",
    scene: { type: "array", playerSprite: "knight", fillCount: 1 }
  },
  {
    id: "csc-t9", language: "csharp", stageId: "csc-p3",
    title: "9. Generic Collections", subtitle: "Lists & Dictionaries",
    difficulty: "Medium", xp: 200, category: "Phase 3: Data",
    instruction: "Create a List<string> named 'inventory' and add \"Sword\".",
    quest: "List<string> inventory = new List<string>();\ninventory.Add(\"Sword\");",
    starterCode: "using System.Collections.Generic;\n\npublic class PlayerData {\n    public void Start() {\n        // Create List and add item\n    }\n}",
    solutionHints: ["List<string>", "new List<string>()", "Add(\"Sword\")"],
    indirectHint: "Lists are dynamic arrays. Use .Add() to insert items.",
    scene: { type: "array", playerSprite: "knight", fillCount: 2 }
  },
  {
    id: "csc-t10", language: "csharp", stageId: "csc-p3",
    title: "10. LINQ", subtitle: "Querying Data",
    difficulty: "Hard", xp: 250, category: "Phase 3: Data",
    instruction: "Use LINQ Where to filter numbers greater than 5 and convert to a list.",
    quest: "var filtered = numbers.Where(n => n > 5).ToList();",
    starterCode: "using System.Linq;\nusing System.Collections.Generic;\n\npublic class Processor {\n    public void Filter(List<int> numbers) {\n        // Use LINQ Where\n    }\n}",
    solutionHints: ["Where", "n => n > 5", "ToList()"],
    indirectHint: "Import System.Linq to use extension methods like Where.",
    scene: { type: "array", playerSprite: "slime", fillCount: 4 }
  },

  // ================= PHASE 4: METHODS =================
  {
    id: "csc-t11", language: "csharp", stageId: "csc-p4",
    title: "11. Methods", subtitle: "Defining & Calling",
    difficulty: "Medium", xp: 250, category: "Phase 4: Methods",
    instruction: "Define a method named 'Add' that takes two integers and returns their sum.",
    quest: "public int Add(int a, int b) {\n    return a + b;\n}",
    starterCode: "public class Calculator {\n    // Define the Add method\n}",
    solutionHints: ["public int Add", "int a, int b", "return a + b"],
    indirectHint: "Method signature: access_modifier return_type Name(parameters).",
    scene: { type: "ui-preview", playerSprite: "knight", label: "Logic Encapsulated" }
  },
  {
    id: "csc-t12", language: "csharp", stageId: "csc-p4",
    title: "12. Scope & Parameters", subtitle: "ref & out",
    difficulty: "Hard", xp: 300, category: "Phase 4: Methods",
    instruction: "Use the 'out' keyword to return multiple values from a method.",
    quest: "public void GetStats(out int hp, out int mp) {\n    hp = 100;\n    mp = 50;\n}",
    starterCode: "public class StatsManager {\n    // Define GetStats using 'out'\n}",
    solutionHints: ["out int hp", "out int mp", "hp =", "mp ="],
    indirectHint: "You must assign values to 'out' parameters before the method ends.",
    scene: { type: "ui-preview", playerSprite: "knight", label: "Parameters Passed" }
  },

  // ================= PHASE 5: OOP =================
  {
    id: "csc-t13", language: "csharp", stageId: "csc-p5",
    title: "13. Classes & Objects", subtitle: "Fields & Properties",
    difficulty: "Medium", xp: 300, category: "Phase 5: OOP",
    instruction: "Create a Player class with an auto-property for 'Name'.",
    quest: "public class Player {\n    public string Name { get; set; }\n}",
    starterCode: "// Define the Player class\n",
    solutionHints: ["public class Player", "{ get; set; }"],
    indirectHint: "Auto-properties use { get; set; } syntax.",
    scene: { type: "ui-preview", playerSprite: "knight", label: "Class Instantiated" }
  },
  {
    id: "csc-t14", language: "csharp", stageId: "csc-p5",
    title: "14. Encapsulation", subtitle: "SerializeField",
    difficulty: "Medium", xp: 300, category: "Phase 5: OOP",
    instruction: "Use [SerializeField] to expose a private variable to the Unity inspector.",
    quest: "[SerializeField] private float speed = 5f;",
    starterCode: "using UnityEngine;\n\npublic class Controller : MonoBehaviour {\n    // Serialize the private speed field\n}",
    solutionHints: ["[SerializeField]", "private float speed"],
    indirectHint: "SerializeField attribute makes private fields visible in the Inspector.",
    scene: { type: "ui-preview", playerSprite: "knight", label: "Field Serialized" }
  },
  {
    id: "csc-t15", language: "csharp", stageId: "csc-p5",
    title: "15. Inheritance", subtitle: "Base & Derived",
    difficulty: "Hard", xp: 350, category: "Phase 5: OOP",
    instruction: "Create a Boss class that inherits from Enemy.",
    quest: "public class Enemy { }\npublic class Boss : Enemy { }",
    starterCode: "// Define Enemy and Boss classes\n",
    solutionHints: ["class Boss : Enemy"],
    indirectHint: "Inheritance uses the colon (:) operator.",
    scene: { type: "collision", playerSprite: "slime" }
  },
  {
    id: "csc-t16", language: "csharp", stageId: "csc-p5",
    title: "16. Polymorphism", subtitle: "Virtual & Override",
    difficulty: "Hard", xp: 400, category: "Phase 5: OOP",
    instruction: "Override a virtual method in the derived class.",
    quest: "public virtual void Attack() { }\npublic override void Attack() { }",
    starterCode: "public class Enemy {\n    // Define virtual Attack\n}\n\npublic class Boss : Enemy {\n    // Override Attack\n}",
    solutionHints: ["virtual void Attack", "override void Attack"],
    indirectHint: "Use 'virtual' in the base and 'override' in the child.",
    scene: { type: "collision", playerSprite: "slime" }
  },
  {
    id: "csc-t17", language: "csharp", stageId: "csc-p5",
    title: "17. Interfaces", subtitle: "Contracts",
    difficulty: "Hard", xp: 400, category: "Phase 5: OOP",
    instruction: "Define an IDamageable interface with a TakeDamage method.",
    quest: "public interface IDamageable {\n    void TakeDamage(int amount);\n}",
    starterCode: "// Define IDamageable interface\n",
    solutionHints: ["interface IDamageable", "void TakeDamage"],
    indirectHint: "Interfaces only define signatures, no bodies.",
    scene: { type: "ui-preview", playerSprite: "knight", label: "Interface Implemented" }
  },
  {
    id: "csc-t18", language: "csharp", stageId: "csc-p5",
    title: "18. Structs & Enums", subtitle: "Value Types",
    difficulty: "Medium", xp: 250, category: "Phase 5: OOP",
    instruction: "Define an enum for WeaponType with Sword and Bow.",
    quest: "public enum WeaponType { Sword, Bow }",
    starterCode: "// Define the enum\n",
    solutionHints: ["enum WeaponType", "Sword", "Bow"],
    indirectHint: "Enums are sets of named constants.",
    scene: { type: "ui-preview", playerSprite: "knight", label: "State Defined" }
  },

  // ================= PHASE 6: ADVANCED =================
  {
    id: "csc-t19", language: "csharp", stageId: "csc-p6",
    title: "19. Exception Handling", subtitle: "Try/Catch",
    difficulty: "Hard", xp: 450, category: "Phase 6: Advanced",
    instruction: "Wrap code in a try-catch block and handle a DivideByZeroException.",
    quest: "try {\n    int result = 10 / 0;\n} catch (DivideByZeroException ex) {\n    Console.WriteLine(\"Error!\");\n}",
    starterCode: "using System;\n\npublic class MathHelper {\n    public void SafeDivide() {\n        // try-catch division by zero\n    }\n}",
    solutionHints: ["try", "catch (DivideByZeroException", "Console.WriteLine"],
    indirectHint: "The catch block handles the specific exception type.",
    scene: { type: "gate-logic", playerSprite: "knight" }
  },
  {
    id: "csc-t20", language: "csharp", stageId: "csc-p6",
    title: "20. Delegates & Events", subtitle: "Publisher Pattern",
    difficulty: "Extreme", xp: 500, category: "Phase 6: Advanced",
    instruction: "Declare an event of type Action.",
    quest: "public event Action OnDamaged;",
    starterCode: "using System;\n\npublic class Health {\n    // Declare the event 'OnDamaged'\n}",
    solutionHints: ["event Action", "OnDamaged"],
    indirectHint: "Events use the 'event' keyword followed by a delegate type.",
    scene: { type: "ui-preview", playerSprite: "slime", label: "Event Fired" }
  },

  // ================= PHASE 7: MEMORY =================
  {
    id: "csc-t27", language: "csharp", stageId: "csc-p7",
    title: "27. Memory Management", subtitle: "IDisposable",
    difficulty: "Extreme", xp: 600, category: "Phase 7: Memory",
    instruction: "Implement IDisposable and call Dispose() to clean up resources.",
    quest: "public class Resource : IDisposable {\n    public void Dispose() { /* cleanup */ }\n}",
    starterCode: "using System;\n\npublic class ResourceHandler {\n    // Implement IDisposable\n}",
    solutionHints: ["IDisposable", "void Dispose()"],
    indirectHint: "IDisposable is a standard interface for releasing unmanaged resources.",
    scene: { type: "ui-preview", playerSprite: "knight", label: "Memory Cleaned" }
  },

  // ================= PHASE 8: UNITY SPECIFIC =================
  {
    id: "csc-t30", language: "csharp", stageId: "csc-p8",
    title: "30. MonoBehaviour", subtitle: "Lifecycle Hooks",
    difficulty: "Medium", xp: 300, category: "Phase 8: Unity",
    instruction: "Cache a component in Awake() to avoid performance overhead.",
    quest: "void Awake() {\n    rb = GetComponent<Rigidbody>();\n}",
    starterCode: "using UnityEngine;\n\npublic class PhysicsMover : MonoBehaviour {\n    Rigidbody rb;\n    // Implement Awake\n}",
    solutionHints: ["void Awake()", "GetComponent<Rigidbody>()"],
    indirectHint: "Awake is called once when the script instance is being loaded.",
    scene: { type: "ui-preview", playerSprite: "knight", label: "Physics Initialized" }
  },
  {
    id: "csc-t31", language: "csharp", stageId: "csc-p8",
    title: "31. Unity Serialization", subtitle: "Inspector Control",
    difficulty: "Medium", xp: 300, category: "Phase 8: Unity",
    instruction: "Use [Header] to organize variables in the Inspector.",
    quest: "[Header(\"Movement\")]\n[SerializeField] private float speed;",
    starterCode: "using UnityEngine;\n\npublic class PlayerSettings : MonoBehaviour {\n    // Add a Header and Serialize speed\n}",
    solutionHints: ["[Header", "[SerializeField]"],
    indirectHint: "Header is useful for grouping fields in the Inspector.",
    scene: { type: "ui-preview", playerSprite: "knight", label: "Inspector Organized" }
  },
  {
    id: "csc-t32", language: "csharp", stageId: "csc-p8",
    title: "32. Component System", subtitle: "Communication",
    difficulty: "Medium", xp: 300, category: "Phase 8: Unity",
    instruction: "Get a component from a child object.",
    quest: "anim = GetComponentInChildren<Animator>();",
    starterCode: "using UnityEngine;\n\npublic class Character : MonoBehaviour {\n    Animator anim;\n    void Start() {\n        // Get Animator from children\n    }\n}",
    solutionHints: ["GetComponentInChildren<Animator>()"],
    indirectHint: "GetComponentInChildren looks for the component in child GameObjects.",
    scene: { type: "ui-preview", playerSprite: "knight", label: "Child Found" }
  },
  {
    id: "csc-t33", language: "csharp", stageId: "csc-p8",
    title: "33. Coroutines", subtitle: "Time Management",
    difficulty: "Hard", xp: 400, category: "Phase 8: Unity",
    instruction: "Create a coroutine that waits for 2 seconds.",
    quest: "IEnumerator Wait() {\n    yield return new WaitForSeconds(2);\n}",
    starterCode: "using System.Collections;\nusing UnityEngine;\n\npublic class Timer : MonoBehaviour {\n    // Implement Wait coroutine\n}",
    solutionHints: ["IEnumerator", "yield return new WaitForSeconds"],
    indirectHint: "Coroutines return IEnumerator and use 'yield return' to pause.",
    scene: { type: "ui-preview", playerSprite: "knight", label: "Waiting..." }
  },
  {
    id: "csc-t35", language: "csharp", stageId: "csc-p8",
    title: "35. Unity Math", subtitle: "Vectors & DeltaTime",
    difficulty: "Medium", xp: 350, category: "Phase 8: Unity",
    instruction: "Move an object forward frame-rate independently.",
    quest: "transform.Translate(Vector3.forward * speed * Time.deltaTime);",
    starterCode: "using UnityEngine;\n\npublic class Mover : MonoBehaviour {\n    public float speed = 5f;\n    void Update() {\n        // Move forward using Time.deltaTime\n    }\n}",
    solutionHints: ["transform.Translate", "Vector3.forward", "Time.deltaTime"],
    indirectHint: "Time.deltaTime makes movement smooth regardless of FPS.",
    scene: { type: "move", initialX: 50, targetX: 250, playerSprite: "knight" }
  },
  // ================= PHASE 9: PROFESSIONAL =================
  {
    id: "csc-t37", language: "csharp", stageId: "csc-p9",
    title: "37. Code Architecture", subtitle: "SOLID Principles",
    difficulty: "Master", xp: 1000, category: "Phase 9: Engineering",
    instruction: "Follow the Single Responsibility Principle by creating a dedicated Logger class.",
    quest: "public class Logger {\n    public void Log(string msg) { /* log to console */ }\n}",
    starterCode: "// Define a dedicated Logger class\n",
    solutionHints: ["public class Logger", "void Log"],
    indirectHint: "SOLID's 'S' stands for Single Responsibility — one class, one job.",
    scene: { type: "ui-preview", playerSprite: "knight", label: "Architecture SOLID" }
  },

  { id: "jsc-1-1", language: "javascript", stageId: "jsc-1", title: "Memory Blocks", subtitle: "JS Const", difficulty: "Medium", xp: 100, category: "JS Fundamentals", instruction: "Allocate an immutable memory block named `maxHealth` targeting integer 100.", quest: "const maxHealth = 100;", starterCode: "// Lock health state\n", solutionHints: ["const", "maxHealth", "100"], indirectHint: "Immutable variables in JS use `const`.", scene: { type: "ui-preview", playerSprite: "monster_ball", label: "HP: 100" } },
  { id: "jsg-1-1", language: "javascript", stageId: "jsg-1", title: "Canvas Context", subtitle: "2D Rendering", difficulty: "Medium", xp: 200, category: "Web Game Dev", instruction: "Use `ctx.fillRect(0, 0, 50, 50)` to draw a square.", quest: "ctx.fillRect(0, 0, 50, 50);", starterCode: "function draw() {\n    // Draw square\n}", solutionHints: ["ctx.fillRect", "0", "50"], indirectHint: "ctx.fillRect(x, y, w, h);", scene: { type: "ui-preview", playerSprite: "slime", label: "Rendered" } },
  { id: "pyc-1-1", language: "python", stageId: "pyc-1", title: "Scripting Flow", subtitle: "Python Variables", difficulty: "Medium", xp: 100, category: "Python Fundamentals", instruction: "Assign integer 100 to dynamic type pointer `health`.", quest: "health = 100", starterCode: "# Bind pointer\n", solutionHints: ["health", "100"], indirectHint: "Python requires no type keywords. Just name = value.", scene: { type: "ui-preview", playerSprite: "slime", label: "Health Set" } }
];
