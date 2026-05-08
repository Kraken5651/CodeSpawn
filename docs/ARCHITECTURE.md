# CodeKraken System Architecture

## 🏛️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (Frontend)                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  React/Vue.js SPA                                        │   │
│  │  - Pages: Dashboard, Problems, Leaderboard, Profile     │   │
│  │  - Monaco Editor for code writing                        │   │
│  │  - Real-time notifications via WebSocket                │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS / REST API / WebSocket
┌──────────────────────────▼──────────────────────────────────────┐
│                    API LAYER (Backend)                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Express.js Server (Port 5000)                           │   │
│  │  - Auth Controller                                       │   │
│  │  - User Controller                                       │   │
│  │  - Problem Controller                                    │   │
│  │  - Submission Controller                                 │   │
│  │  - Social Controller                                     │   │
│  │  - Admin Controller                                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Services Layer                                          │   │
│  │  - AuthService (JWT, OAuth)                              │   │
│  │  - CodeExecutionService (Docker)                         │   │
│  │  - GamificationService (XP, Streaks)                     │   │
│  │  - LeaderboardService                                    │   │
│  │  - NotificationService (WebSocket, Email)                │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────┬──────────────────────────────────┬────────────────────┘
           │                                  │
           │ SQL                              │ Caching Layer
           │                                  │
┌──────────▼──────────┐          ┌────────────▼──────────┐
│  DATA LAYER         │          │   CACHE LAYER        │
│  ┌───────────────┐  │          │  ┌────────────────┐  │
│  │ PostgreSQL    │  │          │  │ Redis (Port    │  │
│  │               │  │          │  │ 6379)          │  │
│  │ - Users       │  │          │  │                │  │
│  │ - Problems    │  │          │  │ - Session data │  │
│  │ - Submissions │  │          │  │ - Leaderboard  │  │
│  │ - Streaks     │  │          │  │ - Cache        │  │
│  │ - Discussions │  │          │  └────────────────┘  │
│  │ - Achievements│  │          │                      │
│  └───────────────┘  │          └──────────────────────┘
└─────────────────────┘
           │
           │ Docker Compose
           │
┌──────────▼──────────────────────────────────┐
│   EXECUTION LAYER                           │
│  ┌──────────────────────────────────────┐   │
│  │ Docker Containers (Sandboxed)        │   │
│  │ - C# Runner (Roslyn)                 │   │
│  │ - Python Runner (CPython)            │   │
│  │ - JavaScript Runner (Node.js)        │   │
│  │ - C++ Runner (g++)                   │   │
│  │                                      │   │
│  │ Resource Limits:                     │   │
│  │ - CPU: 1 core                        │   │
│  │ - Memory: 256MB                      │   │
│  │ - Timeout: 5 seconds                 │   │
│  │ - Network: Disabled                  │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

---

## 🔄 Request Flow

### Authentication Flow

```
User Input (Login)
      │
      ▼
POST /api/auth/login
      │
      ├─ Validate credentials
      │
      ├─ Hash password verification
      │
      ├─ Generate JWT token
      │
      ├─ Store session in Redis
      │
      ▼
Return: { token, user, refreshToken }
      │
      ▼
Frontend stores token in HttpOnly cookie
      │
      ▼
All subsequent requests include token in Authorization header
```

### Code Submission Flow

```
User writes code & clicks "Run"
      │
      ▼
POST /api/submissions
      │
      ├─ Validate user auth
      ├─ Validate problem exists
      ├─ Validate code syntax
      │
      ▼
Create submission record in DB
      │
      ▼
Queue job in Bull (Redis Queue)
      │
      ▼
Worker picks up job
      │
      ├─ Prepare Docker container
      ├─ Copy code into container
      ├─ Run code with test cases
      ├─ Capture output & errors
      │
      ▼
Update submission with results
      │
      ▼
If all tests pass:
  ├─ Mark problem as solved
  ├─ Award XP
  ├─ Update streak
  ├─ Check achievements
  │
  ▼
Emit WebSocket event to client
      │
      ▼
Frontend shows results (pass/fail) + celebration animation
```

---

## 📊 Database Schema

### User-Related Tables

```sql
users
├── id (PK)
├── email (UNIQUE)
├── username (UNIQUE)
├── password_hash
├── profile_picture
├── bio
├── location
├── website
├── created_at
├── updated_at
└── deleted_at (soft delete)

user_profiles
├── user_id (FK)
├── total_xp
├── level
├── current_streak
├── max_streak
├── problems_solved
├── problems_attempted
├── preferred_language
├── theme
└── notifications_enabled

user_achievements
├── user_id (FK)
├── achievement_id (FK)
├── unlocked_at

user_followers
├── follower_id (FK → user_id)
├── following_id (FK → user_id)
├── created_at
```

### Problem-Related Tables

```sql
problems
├── id (PK)
├── title
├── description
├── difficulty (ENUM: EASY, MEDIUM, HARD)
├── category (ENUM: GAME_DEV, ALGORITHMS, DATA_STRUCTURES)
├── language (ENUM: C#, PYTHON, JS, CPP)
├── boilerplate_code
├── solution_code
├── time_limit (seconds)
├── memory_limit (MB)
├── xp_reward
├── attempts_count
├── success_count
├── created_by (FK → user_id)
├── created_at
├── updated_at

test_cases
├── id (PK)
├── problem_id (FK)
├── input
├── expected_output
├── is_hidden
├── explanation

problem_tags
├── problem_id (FK)
├── tag_id (FK)

tags
├── id (PK)
├── name (UNIQUE)
├── description
```

### Submission-Related Tables

```sql
submissions
├── id (PK)
├── user_id (FK)
├── problem_id (FK)
├── code
├── language
├── status (ENUM: PENDING, RUNNING, COMPLETED, FAILED, ERROR)
├── passed_tests
├── total_tests
├── execution_time (ms)
├── memory_used (MB)
├── error_message
├── output
├── is_accepted
├── submitted_at
├── completed_at

user_problems
├── user_id (FK)
├── problem_id (FK)
├── times_attempted
├── times_solved
├── last_attempted_at
├── first_solved_at
├── best_runtime
├── best_memory
```

### Gamification Tables

```sql
streaks
├── user_id (PK, FK)
├── current_streak_count
├── max_streak_count
├── current_streak_start_date
├── last_submission_date

achievements
├── id (PK)
├── name
├── description
├── icon_url
├── unlock_condition (JSON)
├── xp_reward

xp_transactions
├── id (PK)
├── user_id (FK)
├── amount
├── reason (ENUM: PROBLEM_SOLVED, STREAK, ACHIEVEMENT, BONUS)
├── problem_id (FK) [nullable]
├── created_at
```

---

## 🔐 Authentication & Authorization

### JWT Token Structure

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user_id",
    "email": "user@example.com",
    "username": "username",
    "role": "user|admin",
    "iat": 1234567890,
    "exp": 1234571490,
    "iss": "codekraken"
  },
  "signature": "..."
}
```

### Role-Based Access Control (RBAC)

```
Roles:
├── user (default)
│   ├── Can submit solutions
│   ├── Can view own profile & progress
│   ├── Can discuss problems
│   ├── Can follow other users
│   └── Can view leaderboards
│
├── moderator
│   ├── All user permissions
│   ├── Can moderate discussions
│   ├── Can report inappropriate content
│   └── Can help users
│
└── admin
    ├── All permissions
    ├── Can create/edit/delete problems
    ├── Can manage users
    ├── Can view analytics
    └── Can configure system settings
```

---

## 🚀 Deployment Architecture

### Production Environment

```
Internet
    │
    ▼
┌─────────────────────┐
│  Load Balancer      │
│  (Nginx / HAProxy)  │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
┌─────────┐   ┌─────────┐
│ Backend │   │ Backend │  (Scaled Containers)
│ Pod 1   │   │ Pod 2   │
└────┬────┘   └────┬────┘
     │             │
     └──────┬──────┘
            │
    ┌───────┴───────┐
    │               │
    ▼               ▼
┌─────────┐   ┌──────────┐
│ Database│   │  Redis   │  (Persistent Storage)
│PostgreSQL   │ Cache    │
└─────────┘   └──────────┘
    │
    ▼
┌─────────────────────┐
│  S3 / File Storage  │
│  (Backups, Assets)  │
└─────────────────────┘
```

### Containerization with Docker

Each service runs in isolated containers:

```dockerfile
# Backend container
- Node.js runtime
- Express.js server
- Sequelize ORM
- Job queue worker

# Frontend container
- Nginx reverse proxy
- React/Vue build
- Static file serving

# Execution container (per submission)
- C# runner (Roslyn)
- Python runner
- JavaScript runner
- C++ compiler

# Supporting containers
- PostgreSQL database
- Redis cache
- MinIO object storage
```

---

## 📡 Real-Time Communication (WebSocket)

### WebSocket Events

```
Client ─WebSocket─ Server

Events from Client:
├── "subscribe:problem:{id}" → Get live problem discussion
├── "submit:solution" → Real-time submission updates
├── "subscribe:leaderboard" → Live leaderboard updates
└── "typing:discussion" → Show who's typing

Events from Server:
├── "submission:status" → Submission status changed
├── "submission:complete" → Solution evaluated
├── "leaderboard:updated" → Rankings changed
├── "discussion:new_message" → New comment
├── "achievement:unlocked" → User earned achievement
└── "notification:*" → Various notifications
```

---

## 🔄 CI/CD Pipeline

```
Developer pushes code
        │
        ▼
GitHub/GitLab Webhook
        │
        ▼
┌──────────────────┐
│ Run Tests        │
│ Run Linter       │
│ Security Scan    │
└────────┬─────────┘
         │
    ┌────┴────┐
    │ Pass?   │
    └─┬────┬──┘
      │    │
   YES│    │NO
      │    ▼
      │  Reject & Notify
      │
      ▼
┌──────────────────┐
│ Build Containers │
│ Run Integration  │
│ Tests            │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Deploy to Staging│
│ Run E2E Tests    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Approval Gate    │  (Manual review)
└────────┬─────────┘
         │
    ┌────┴────┐
    │ Deploy? │
    └─┬────┬──┘
      │    │
   YES│    │NO
      │    ▼
      │  Hold
      │
      ▼
┌──────────────────┐
│ Deploy to Prod   │
│ Blue-Green       │
│ Deployment       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Health Checks    │
│ Smoke Tests      │
└──────────────────┘
```

---

## 📚 Technology Decisions

### Why PostgreSQL?
- ACID compliance for critical data
- Strong consistency
- Powerful query language
- JSONB support for flexible schemas
- Excellent for relational data (users, problems, submissions)

### Why Redis?
- In-memory caching for fast access
- Session management
- Job queue (Bull)
- Rate limiting
- Leaderboard calculations
- Real-time data

### Why Docker?
- Consistent environments
- Easy scaling
- Language/version isolation
- Safe code execution sandboxes

### Why Node.js/Express?
- JavaScript across stack
- Large ecosystem
- Great for I/O-bound operations
- Easy to scale horizontally
- Good match for real-time features

### Why React/Vue?
- Component reusability
- Fast rendering
- Good developer experience
- Large community
- Excellent tooling

---

## 🔄 Scaling Strategy

### Horizontal Scaling
- API servers: stateless, scale behind load balancer
- Database: read replicas for reads, primary for writes
- Redis: Redis Cluster for distributed caching
- Workers: Queue-based job distribution

### Vertical Scaling
- Increase machine specs (CPU, RAM)
- Database optimization (indexing, query optimization)

### Database Optimization
- Connection pooling (PgBouncer)
- Query caching with Redis
- Appropriate indexing on frequently queried columns
- Partitioning large tables

### Frontend Optimization
- Code splitting
- Lazy loading
- Image optimization
- CDN for static assets

---

## 📊 Monitoring & Logging

### Key Metrics
- API response times
- Database query performance
- Code execution success rate
- User session count
- Active submissions per minute
- Cache hit rate
- Leaderboard calculation time

### Logging
- Application logs (Bunyan/Winston)
- Access logs (Nginx)
- Error tracking (Sentry)
- User activity audit logs
- Security event logs

### Alerting
- High error rate (>1%)
- Database connection pool exhausted
- Server CPU >80%
- Memory >85%
- API response time >1s average
- Failed job queue backlog
