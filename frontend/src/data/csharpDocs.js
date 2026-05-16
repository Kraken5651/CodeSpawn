/**
 * C# Masterclass – Full documentation for all 9 phases (40 Topics).
 * Structured for progressive learning: Easy -> Medium -> Hard.
 */
export const csharpDocs = [
  // ====================== PHASE 1 — Absolute Foundations ======================
  {
    phase: "PHASE 1",
    title: "Absolute Foundations",
    topics: [
      {
        id: 1, title: "How C# Works",
        content: `C# is a **compiled language**. This means your human-readable code is translated into **Intermediate Language (IL)** by a compiler, and then run by the **Common Language Runtime (CLR)**.
        
**Namespaces:** Think of these as folders for your code. 'using System;' allows you to use basic tools like the Console.
**Entry Point:** Every program starts at a specific spot, usually called 'Main' in console apps or 'Awake/Start' in Unity.`
      },
      {
        id: 2, title: "Variables & Data Types",
        content: `Variables are containers for data. You must tell C# what *type* of data it's holding.
        
- **int**: Whole numbers (e.g., 10, -5)
- **float**: Decimals (e.g., 5.5f, -1.2f)
- **bool**: True or False
- **string**: Text (e.g., "Hello")
- **char**: Single character (e.g., 'A')

**var**: C# can guess the type for you (Type Inference).
**const**: A variable that never changes.`
      },
      {
        id: 3, title: "Type Conversion & Casting",
        content: `Sometimes you need to change one type to another.
        
**Implicit:** Safe and automatic (e.g., int to double).
**Explicit Casting:** You force it, potentially losing data (e.g., (int)5.5 becomes 5).
**Parsing:** Converting strings to numbers using 'int.Parse()' or the safer 'int.TryParse()'.`
      },
      {
        id: 4, title: "Operators",
        content: `Tools for math and logic.
        
- **Arithmetic**: +, -, *, /, % (remainder)
- **Comparison**: == (equal), != (not equal), >, <
- **Logic**: && (AND), || (OR), ! (NOT)
- **Ternary**: A shortcut for if-else (condition ? trueVal : falseVal).
- **Null-coalescing (??)**: Use this to provide a default value if something is null.`
      },
      {
        id: 5, title: "String Operations",
        content: `**Interpolation:** The easiest way to build strings: $"Hello {name}".
**StringBuilder:** Use this when you are changing a string hundreds of times (like in a loop) to keep your game fast.`
      }
    ]
  },
  // ====================== PHASE 2 — Control Flow ======================
  {
    phase: "PHASE 2",
    title: "Control Flow",
    topics: [
      {
        id: 6, title: "Conditionals",
        content: `How your game makes decisions.
        
**if / else**: The basic bread and butter.
**switch**: Great for checking one variable against many options.
**Switch Expressions**: A modern, cleaner way to return values based on conditions.`
      },
      {
        id: 7, title: "Loops",
        content: `Repeating actions.
        
**for**: Use when you know exactly how many times to repeat.
**foreach**: The best way to look at every item in a collection (like an inventory).
**while**: Repeat as long as a condition is true.`
      }
    ]
  },
  // ====================== PHASE 3 — Collections ======================
  {
    phase: "PHASE 3",
    title: "Collections & Data Structures",
    topics: [
      {
        id: 8, title: "Arrays",
        content: `Fixed-size lists. Once created, you can't change the size. Indexing starts at 0.`
      },
      {
        id: 9, title: "Generic Collections",
        content: `**List<T>**: A dynamic array that can grow or shrink.
**Dictionary<K, V>**: A map where you look up values using keys (like an ID).`
      },
      {
        id: 10, title: "LINQ",
        content: `Language Integrated Query. Allows you to search and filter your data like a database. 
        
Example: 'players.Where(p => p.IsAlive)'`
      }
    ]
  },
  // ====================== PHASE 4 — Methods & Functions ======================
  {
    phase: "PHASE 4",
    title: "Methods & Functions",
    topics: [
      {
        id: 11, title: "Methods",
        content: `Methods are reusable blocks of code. They perform an action and can return a result.
        
**Signature:** 'public int Add(int a, int b)'
- 'public': Who can see it.
- 'int': What it gives back (return type).
- 'Add': Its name.
- '(int a, int b)': What it needs to work (parameters).`
      },
      {
        id: 12, title: "Scope & Lifetime",
        content: `**Scope** determines where a variable is visible.
        
- **Local**: Inside a method.
- **Class/Field**: Visible to the whole class.
- **ref/out**: Keywords that let a method change the original variable passed to it. 'out' is specifically used to return extra values.`
      }
    ]
  },
  // ====================== PHASE 5 — OOP ======================
  {
    phase: "PHASE 5",
    title: "Object Oriented Programming",
    topics: [
      {
        id: 13, title: "Classes & Objects",
        content: `**Class**: A blueprint (e.g., 'Player' blueprint).
**Object**: An instance of that blueprint (e.g., 'Player 1').
        
**Properties**: Use { get; set; } to control how data is read and written.`
      },
      {
        id: 14, title: "Encapsulation",
        content: `Hiding the inner workings of a class. Use 'private' to hide data and 'public' to expose what's necessary.
        
**[SerializeField]**: A Unity-specific tool that lets you edit private variables in the Inspector without making them public to other scripts.`
      },
      {
        id: 15, title: "Inheritance",
        content: `Letting one class gain the features of another.
        
Example: 'Boss' inherits from 'Enemy'. It gets all the 'Enemy' code for free and adds its own.`
      },
      {
        id: 16, title: "Polymorphism",
        content: `The ability for a child class to change how a parent's method works.
        
**virtual**: The parent says "you can change this".
**override**: The child says "I am changing this".`
      },
      {
        id: 17, title: "Interfaces",
        content: `A 'contract'. If a class implements an interface, it **must** have the methods defined in it.
        
Great for systems like 'IDamageable' where players, enemies, and crates all take damage in different ways.`
      },
      {
        id: 18, title: "Structs & Enums",
        content: `**Structs**: Like classes but smaller and faster for simple data (like a 2D Point).
**Enums**: A set of named options (e.g., WeaponType.Sword, WeaponType.Bow).`
      }
    ]
  },
  // ====================== PHASE 6 — Advanced C# Features ======================
  {
    phase: "PHASE 6",
    title: "Advanced C# Features",
    topics: [
      {
        id: 19, title: "Exception Handling",
        content: `Handling errors gracefully.
        
**try**: The code that might fail.
**catch**: What to do if it fails.
**finally**: Code that runs no matter what.`
      },
      {
        id: 20, title: "Delegates & Events",
        content: `Allowing classes to talk to each other without being strictly connected.
        
**Event**: A "shout" that something happened (e.g., "I took damage!"). Other scripts "listen" and react.`
      },
      {
        id: 23, title: "Async / Await",
        content: `Running tasks without freezing the game. 
        
Useful for loading data from the internet or doing heavy calculations in the background.`
      }
    ]
  },
  // ====================== PHASE 7 — Memory, Performance & Systems ======================
  {
    phase: "PHASE 7",
    title: "Memory & Performance",
    topics: [
      {
        id: 27, title: "Memory Management",
        content: `Understanding how memory works is critical for mobile and console games.
        
- **Stack**: Fast, small, automatic (for simple variables like int, float).
- **Heap**: Larger, slower, managed by the Garbage Collector (for Objects and Classes).
- **IDisposable**: A way to manually tell C# to "clean up" a resource immediately instead of waiting for the Garbage Collector.`
      }
    ]
  },
  // ====================== PHASE 8 — Unity-Specific C# ======================
  {
    phase: "PHASE 8",
    title: "Unity-Specific C#",
    topics: [
      {
        id: 30, title: "MonoBehaviour Lifecycle",
        content: `Unity scripts run in a specific order:
        
1. **Awake**: Called first, even if the script is disabled. Use for caching.
2. **OnEnable**: Called every time the object is enabled.
3. **Start**: Called once before the first frame.
4. **Update**: Called every frame. Use for input and simple logic.
5. **FixedUpdate**: Called at regular intervals. Use for **Physics** (Rigidbodies).
6. **LateUpdate**: Called after all Updates. Use for Camera logic.`
      },
      {
        id: 31, title: "Unity Serialization",
        content: `Serialization lets Unity save and display your data in the Inspector.
        
- **[SerializeField]**: Makes a private variable visible in the Editor.
- **[Header]**: Adds a bold title in the Inspector to organize your fields.
- **[Range]**: Adds a slider for numerical variables.`
      },
      {
        id: 32, title: "Component System",
        content: `Unity is based on Components. You can get references to them using:
        
- **GetComponent<T>()**: Finds the component on the same object.
- **GetComponentInChildren<T>()**: Searches child objects.
- **TryGetComponent<T>()**: A safer, faster way that returns true/false if the component exists.`
      },
      {
        id: 33, title: "Coroutines",
        content: `Methods that can pause execution for a period of time.
        
- **yield return null**: Wait for the next frame.
- **yield return new WaitForSeconds(5)**: Wait for 5 seconds.
- Great for timed events like reloads, health regeneration, or cutscenes.`
      }
    ]
  },
  // ====================== PHASE 9 — Professional Practices ======================
  {
    phase: "PHASE 9",
    title: "Professional Practices",
    topics: [
      {
        id: 37, title: "Code Architecture (SOLID)",
        content: `**SOLID** is a set of principles for clean, maintainable code.
        
- **S**: Single Responsibility (a class should do only ONE thing).
- **O**: Open-Closed (classes should be open for expansion but closed for modification).
- Interface-driven design helps separate what a class DOES from how it does it.`
      },
      {
        id: 38, title: "Debugging & Testing",
        content: `**Debug.Log**: Prints messages to the Unity Console.
**Breakpoints**: Pause the code in Visual Studio to see the exact state of variables.
**Unit Testing**: Writing code to test your code automatically.`
      }
    ]
  }
];
