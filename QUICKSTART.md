# 🚀 Quick Start Guide

Get CodeSpawn running locally in minutes!

## Prerequisites
- Docker & Docker Compose (easiest option)
- OR Node.js 18+ + PostgreSQL 14+ + Redis 7+

## Option 1: Docker (Recommended ⭐)

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/codespawn.git
cd codespawn

# 2. Start all services
docker-compose up -d

# 3. Wait 30 seconds for services to be ready

# 4. Access the platform
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# API Docs: http://localhost:5000/docs
```

Done! The backend will auto-initialize with the database.

### Troubleshooting Docker

```bash
# View logs
docker-compose logs -f backend

# Restart all services
docker-compose restart

# Reset everything
docker-compose down -v
docker-compose up -d
```

## Option 2: Manual Setup

### Backend

```bash
cd backend
npm install

# Create .env from template
cp ../.env.example .env

# Update .env with your PostgreSQL/Redis connection

# Run migrations
npm run migrate

# Start development server
npm run dev
```

### Frontend

```bash
cd frontend
npm install

# Start Vite dev server
npm run dev
```

### Database & Cache

```bash
# PostgreSQL
brew install postgresql@14
brew services start postgresql@14

# Redis
brew install redis
brew services start redis
```

## First Time Setup

1. **Create an admin account**
   ```bash
   # Register at http://localhost:3000/register
   email: admin@codespawn.dev
   username: admin
   password: your_password
   ```

2. **Access backend API**
   - Health check: `curl http://localhost:5000/api/health`
   - Login: `POST /api/auth/login`
   - Create problem: `POST /api/problems` (admin only)

3. **Create sample problems**
   ```bash
   # Use API or admin dashboard to create problems
   # Problems should have test cases and boilerplate code
   ```

## Key Endpoints

```
# Authentication
POST   /api/auth/register      - Create account
POST   /api/auth/login         - Login
GET    /api/auth/me            - Current user

# Problems
GET    /api/problems           - List problems
GET    /api/problems/:id       - Get problem details
POST   /api/problems           - Create (admin)

# Submissions
POST   /api/submissions        - Submit code
GET    /api/submissions/:id    - Get results

# Users
GET    /api/users/:id          - User profile
GET    /api/users/leaderboard  - Leaderboard
```

## Testing

```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test

# All tests
npm run test:all
```

## Development Commands

```bash
# Backend
cd backend
npm run dev              # Start with hot reload
npm run lint            # Check code style
npm run lint:fix        # Auto-fix lint issues
npm run migrate         # Run pending migrations

# Frontend
cd frontend
npm run dev             # Start dev server
npm run build           # Production build
npm run preview         # Preview production build
npm run lint            # Check code style
```

## Architecture Overview

```
Frontend (React + Vite)
    ↓
    ↓ HTTP/WebSocket
    ↓
Backend (Express.js)
    ├── Auth (JWT)
    ├── Problems
    ├── Submissions
    ├── Users
    └── Leaderboards
    ↓
    ├── PostgreSQL (Data)
    ├── Redis (Cache/Sessions)
    └── Docker (Code Execution)
```

## Next Steps

1. **Read the docs**
   - [Setup Guide](./docs/SETUP.md)
   - [API Documentation](./docs/API.md)
   - [Architecture](./docs/ARCHITECTURE.md)

2. **Create content**
   - Add problems via API
   - Write problem descriptions
   - Create test cases

3. **Customize**
   - Update branding
   - Add your problems
   - Configure gamification rules

4. **Deploy** (when ready)
   - See [Deployment Guide](./docs/DEPLOYMENT.md)
   - Configure production environment
   - Set up CI/CD pipeline

## Common Issues

### Port already in use
```bash
# Kill process using port
lsof -i :3000  # Frontend
lsof -i :5000  # Backend
kill -9 <PID>
```

### Database connection failed
```bash
# Check PostgreSQL is running
pg_isready -h localhost

# Or in Docker
docker-compose exec postgres pg_isready -U codespawn
```

### Redis connection failed
```bash
# Check Redis is running
redis-cli ping

# Or in Docker
docker-compose exec redis redis-cli ping
```

## Getting Help

- 📖 Read the [documentation](./docs/)
- 💬 Ask in [Discussions](https://github.com/yourusername/codespawn/discussions)
- 🐛 Report bugs as [Issues](https://github.com/yourusername/codespawn/issues)
- 🤝 Check [Contributing Guide](./CONTRIBUTING.md)

## Environment Variables

Key variables to configure:

```env
# Backend
NODE_ENV=development
PORT=5000
JWT_SECRET=your_secret_key

# Database
DB_HOST=localhost
DB_USER=codespawn
DB_PASSWORD=dev_password
DB_NAME=codespawn_dev

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Frontend
VITE_API_URL=http://localhost:5000/api
```

See [.env.example](.env.example) for all variables.

---

**You're all set!** 🎉 Start exploring CodeSpawn!

