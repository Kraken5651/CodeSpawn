# 🦑 CodeKraken - Multi-Language Gamified Coding Learning Platform

> Learn to code and master game development through gamified challenges, streaks, and community interaction. Similar to LeetCode, GeeksForGeeks, and Exercism but focused on **game development**.

## 🎮 Platform Features

### Language Support
- ✅ **C#** (Unity game development) - Currently Live
- 🔜 **Python** (Game dev, AI, algorithms)
- 🔜 **JavaScript** (Game dev, web, algorithms)
- 🔜 **C++** (Unreal Engine, systems programming)
- 🔜 **Blueprint** (Unreal visual scripting)

### Engine/Framework Integration
- ✅ **Unity** - C# tutorials, documentation, projects
- 🔜 **Unreal Engine** - C++ blueprints, documentation
- 🔜 **Godot** - GDScript integration
- 🔜 **Game Development Algorithms** - General concepts

### Gamification & Social
- 📊 **Streak System** - Track daily coding streaks
- ⭐ **XP & Leveling** - Earn points for solving problems
- 🏆 **Leaderboards** - Global, weekly, friend-based rankings
- 🎯 **Achievements & Badges** - Unlock milestones
- 👥 **Social Features** - Follow users, discuss solutions
- 📈 **Progress Tracking** - Visualize learning journey
- 🏅 **Problem Difficulty Tiers** - Beginner to Advanced

### Learning Resources
- 📚 **Interactive Tutorials** - Lesson-based learning
- 📖 **Documentation** - Embedded Unity/Unreal docs
- 🎬 **Video Tutorials** - Integration with YouTube/Vimeo
- 💬 **Discussions** - Community problem-solving
- 🤝 **Mentorship** - Connect with experienced developers

---

## 🏗️ Technology Stack

### Backend
- **Framework:** Node.js + Express.js
- **Database:** PostgreSQL + Redis (caching)
- **ORM:** Sequelize or Prisma
- **Authentication:** JWT + OAuth (Google, GitHub)
- **Containerization:** Docker & Docker Compose
- **APIs:** RESTful + WebSocket for real-time

### Frontend
- **Framework:** React.js / Vue.js 3
- **State Management:** Redux / Pinia
- **Styling:** Tailwind CSS
- **Code Editor:** Monaco Editor / CodeMirror
- **UI Components:** Shadcn/ui or Material-UI
- **Build Tool:** Vite / Webpack

### Code Execution
- **Backend:** Docker containers for sandboxed execution
- **Languages:** polyglot support via containerized environments
- **Timeout/Security:** Resource limits, network isolation

---

## 📁 Project Structure

```
codekraken/
├── README.md                    # This file
├── docs/                        # Documentation
│   ├── API.md                   # API endpoints
│   ├── ARCHITECTURE.md          # System design
│   ├── DATABASE_SCHEMA.md       # DB structure
│   ├── SETUP.md                 # Local setup guide
│   └── DEPLOYMENT.md            # Production deployment
├── backend/
│   ├── src/
│   │   ├── controllers/         # Route handlers
│   │   ├── models/              # Database models
│   │   ├── routes/              # API routes
│   │   ├── middleware/          # Auth, validators
│   │   ├── services/            # Business logic
│   │   ├── utils/               # Helpers
│   │   ├── socket/              # WebSocket handlers
│   │   └── app.js               # Express app
│   ├── migrations/              # Database migrations
│   ├── config/                  # Configuration files
│   ├── tests/                   # Unit & integration tests
│   ├── package.json
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── pages/               # Page components
│   │   ├── services/            # API client
│   │   ├── store/               # State management
│   │   ├── hooks/               # Custom React hooks
│   │   ├── styles/              # Global styles
│   │   ├── utils/               # Utility functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/                  # Static assets
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
├── database/
│   ├── schema.sql               # Database schema
│   ├── migrations/              # Migration files
│   ├── seeders/                 # Seed data
│   └── backups/                 # Database backups
├── docker-compose.yml           # Multi-container setup
├── .env.example                 # Environment template
└── .gitignore
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 14+

### Local Development

```bash
# 1. Clone repository
git clone https://github.com/yourusername/codekraken.git
cd codekraken

# 2. Setup environment
cp .env.example .env
# Edit .env with your config

# 3. Start with Docker
docker-compose up -d

# 4. Run migrations
docker-compose exec backend npm run migrate

# 5. Start services
# Backend: http://localhost:5000
# Frontend: http://localhost:3000
```

### Manual Setup

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

---

## 📊 Core Modules

### 1. **User Management**
- Registration & login
- OAuth integration
- Profile customization
- User statistics & achievements

### 2. **Problem/Challenge System**
- Multi-language problem templates
- Multiple difficulty levels
- Test case management
- Solution submission & validation

### 3. **Code Execution**
- Sandboxed execution environment
- Multi-language support
- Real-time output streaming
- Memory & timeout limits

### 4. **Gamification**
- XP system
- Streak tracking
- Badge/achievement unlocking
- Leaderboard ranking

### 5. **Social Features**
- User following
- Problem discussions
- Solution sharing
- Mentorship requests

### 6. **Admin Dashboard**
- Problem management
- User moderation
- Analytics & reporting
- Content curation

---

## 🔄 API Overview

### Authentication
```
POST   /api/auth/register        # User registration
POST   /api/auth/login           # User login
POST   /api/auth/logout          # User logout
POST   /api/auth/refresh         # Refresh JWT
GET    /api/auth/me              # Current user profile
```

### Users
```
GET    /api/users/:id            # Get user profile
PUT    /api/users/:id            # Update profile
GET    /api/users/:id/problems   # User's solved problems
GET    /api/users/leaderboard    # Global leaderboard
GET    /api/users/:id/streak     # User's streak info
```

### Problems/Challenges
```
GET    /api/problems             # List all problems
GET    /api/problems/:id         # Get problem details
POST   /api/problems             # Create problem (admin)
PUT    /api/problems/:id         # Update problem (admin)
DELETE /api/problems/:id         # Delete problem (admin)
GET    /api/problems/filter      # Filter by language, difficulty
```

### Submissions
```
POST   /api/submissions          # Submit solution
GET    /api/submissions/:id      # Get submission details
GET    /api/problems/:id/submissions  # My submissions for problem
```

### Learning Paths
```
GET    /api/paths                # List learning paths
GET    /api/paths/:id            # Get path details
GET    /api/paths/:id/progress   # User's progress in path
```

### Social
```
GET    /api/discussions/:problemId  # Problem discussions
POST   /api/discussions          # Create discussion
GET    /api/users/:id/following  # User's followers
POST   /api/users/:id/follow     # Follow user
```

---

## 📈 Data Models

### Core Entities
- **User** - User accounts with profiles
- **Problem** - Coding challenges
- **Submission** - Code submissions & test results
- **Language** - Supported programming languages
- **Difficulty** - Problem difficulty levels
- **Achievement** - Badges & milestones
- **Streak** - Daily coding streaks
- **Discussion** - Problem discussions
- **LearningPath** - Curated lesson sequences

---

## 🔐 Security Features

- JWT token-based authentication
- Role-based access control (RBAC)
- Sandboxed code execution
- Rate limiting on API endpoints
- CORS protection
- SQL injection prevention (Sequelize ORM)
- XSS protection
- HTTPS enforcement in production

---

## 🐳 Docker Deployment

```bash
# Build all containers
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down
```

---

## 📚 Documentation

- [API Documentation](./docs/API.md)
- [Architecture & Design](./docs/ARCHITECTURE.md)
- [Database Schema](./docs/DATABASE_SCHEMA.md)
- [Setup Guide](./docs/SETUP.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

---

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Areas We Need Help
- [ ] Problem creation & curation
- [ ] Tutorial video integrations
- [ ] UI/UX improvements
- [ ] Language support expansion
- [ ] Documentation improvements
- [ ] Performance optimization

---

## 📜 License

MIT License - see [LICENSE](./LICENSE) file

---

## 🌟 Roadmap

### Phase 1 (Current)
- ✅ C# & Unity learning
- ✅ Basic problem system
- ✅ Gamification mechanics
- ⚡ Social features

### Phase 2
- 🔜 Python support
- 🔜 JavaScript support
- 🔜 Advanced leaderboards
- 🔜 Mentorship system

### Phase 3
- 🔜 C++ & Unreal Engine
- 🔜 Video tutorials
- 🔜 Community competitions
- 🔜 Mobile app

### Phase 4
- 🔜 AI-powered hints
- 🔜 Job board integration
- 🔜 Certification programs
- 🔜 Corporate training

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/yourusername/codekraken/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/codekraken/discussions)
- **Email:** support@codekraken.dev
- **Discord:** [Join Our Community](https://discord.gg/codekraken)

---

## 🎯 Vision

CodeKraken aims to be the **premier platform for aspiring and experienced developers** to learn game development through hands-on coding challenges, community interaction, and gamified progression. We believe coding should be engaging, rewarding, and social.

**"Code like a gamer. Learn like a pro. Build like a master."** 🦑🎮
