# Local Development Setup Guide

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** 18.0+ (https://nodejs.org/)
- **npm** 9.0+ or **yarn** 3.0+ (comes with Node.js)
- **Docker Desktop** (https://www.docker.com/products/docker-desktop)
- **Docker Compose** 2.0+ (included with Docker Desktop)
- **Git** (https://git-scm.com/)
- **PostgreSQL** (optional, if running without Docker)
- **Redis** (optional, if running without Docker)

### System Requirements
- RAM: 8GB minimum (16GB recommended)
- Disk Space: 20GB free
- OS: Windows 10+, macOS 10.15+, or Linux (Ubuntu 20.04+)

---

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/codespawn.git
cd codespawn
```

### 2. Setup Environment Variables

Copy the example environment file and configure your local settings:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Backend
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000

# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=codespawn_dev
DB_USER=codespawn
DB_PASSWORD=dev_password_change_me
DB_URL=postgresql://codespawn:dev_password_change_me@postgres:5432/codespawn_dev

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# JWT & Security
JWT_SECRET=your_jwt_secret_key_here_change_this
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
ACCESS_TOKEN_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d

# OAuth (Google & GitHub)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Frontend
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WS_URL=ws://localhost:5000

# Code Execution
CODE_EXECUTION_TIMEOUT=5000
CODE_EXECUTION_MEMORY_LIMIT=256
```

### 3. Option A: Using Docker Compose (Recommended)

```bash
# Build all containers
docker-compose build

# Start all services (backend, frontend, database, redis)
docker-compose up -d

# Wait for services to start (should take 30-60 seconds)
docker-compose ps

# You should see: postgres, redis, backend, and frontend all running

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Run database migrations
docker-compose exec backend npm run migrate

# Seed initial data
docker-compose exec backend npm run seed
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Database: localhost:5432
- Redis: localhost:6379

### 3. Option B: Manual Local Setup (Advanced)

#### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (already copied above)

# Create database
createdb codespawn_dev

# Run migrations
npm run migrate

# Seed initial data
npm run seed

# Start backend server (development mode with nodemon)
npm run dev
```

The backend will start at http://localhost:5000

#### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start at http://localhost:3000

#### Services Setup (if not using Docker)

```bash
# Install PostgreSQL (macOS with Homebrew)
brew install postgresql@14
brew services start postgresql@14

# Install Redis (macOS with Homebrew)
brew install redis
brew services start redis

# Or use Docker just for services
docker run -d -p 5432:5432 \
  -e POSTGRES_USER=codespawn \
  -e POSTGRES_PASSWORD=dev_password \
  -e POSTGRES_DB=codespawn_dev \
  postgres:14-alpine

docker run -d -p 6379:6379 redis:7-alpine
```

---

## Development Workflow

### Running Tests

```bash
# Backend unit tests
cd backend
npm run test

# Backend integration tests
npm run test:integration

# Backend with coverage
npm run test:coverage

# Frontend tests
cd frontend
npm run test

# Frontend with coverage
npm run test:coverage

# All tests
npm run test:all
```

### Linting & Formatting

```bash
# Lint backend code
cd backend
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Lint frontend code
cd frontend
npm run lint
npm run lint:fix
```

### Database Commands

```bash
# Create new migration
cd backend
npm run migrate:create -- --name add_new_table

# Run migrations
npm run migrate

# Rollback last migration
npm run migrate:rollback

# Reset database (⚠️ WARNING: Deletes all data)
npm run migrate:reset

# View migration status
npm run migrate:status

# Access database console
psql postgres://codespawn:password@localhost:5432/codespawn_dev
```

### Useful npm Scripts

```bash
# Backend
cd backend
npm run dev              # Start dev server with hot reload
npm run build            # Build for production
npm run start            # Start production server
npm run test             # Run tests
npm run test:watch      # Run tests in watch mode
npm run lint             # Lint code
npm run migrate          # Run pending migrations

# Frontend
cd frontend
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run test             # Run tests
npm run lint             # Lint code
```

---

## Docker Compose Management

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Stop services and remove volumes (⚠️ Deletes all data)
docker-compose down -v

# View running services
docker-compose ps

# View logs
docker-compose logs -f              # All services
docker-compose logs -f backend      # Just backend
docker-compose logs -f postgres     # Just database

# Restart service
docker-compose restart backend

# Rebuild service
docker-compose up -d --build backend

# Execute command in service
docker-compose exec backend npm run migrate
```

---

## Accessing Services

### Database (PostgreSQL)

```bash
# Using psql
psql -h localhost -U codespawn -d codespawn_dev

# Using Docker
docker-compose exec postgres psql -U codespawn -d codespawn_dev

# Connection string
postgresql://codespawn:dev_password@localhost:5432/codespawn_dev
```

### Redis

```bash
# Using redis-cli
redis-cli

# Using Docker
docker-compose exec redis redis-cli

# Commands
KEYS *                 # List all keys
GET key_name           # Get value
DEL key_name           # Delete key
FLUSHDB                # Clear all data
```

### Backend API

```bash
# Health check
curl http://localhost:5000/api/health

# List all problems
curl http://localhost:5000/api/problems

# With authentication
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/auth/me
```

---

## Troubleshooting

### Docker Container Won't Start

```bash
# Check logs
docker-compose logs backend

# Common issues:
# 1. Port already in use
docker ps
kill <process_id>

# 2. Database not ready
# Wait 30 seconds and retry docker-compose up

# 3. Out of disk space
docker system prune -a
```

### Database Connection Error

```bash
# Check if database is running
docker-compose ps postgres

# Verify connection string in .env
psql $DB_URL

# Check database exists
docker-compose exec postgres psql -U codespawn -l

# Reset database (⚠️ WARNING: Deletes all data)
docker-compose down -v
docker-compose up -d postgres
docker-compose exec postgres psql -U codespawn -c "CREATE DATABASE codespawn_dev;"
```

### Port Already In Use

```bash
# Find process using port 5000
lsof -i :5000

# Or 3000 for frontend
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change port in .env and docker-compose.yml
```

### Node Modules Issues

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Or with Docker
docker-compose down
docker system prune -a
docker-compose up -d --build
```

### Redis Connection Error

```bash
# Check Redis is running
docker-compose exec redis redis-cli ping

# Should return: PONG
```

---

## IDE Setup

### VS Code Extensions (Recommended)

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-python.python",
    "eamodio.gitlens",
    "ms-vscode.makefile-tools",
    "docker",
    "ms-vscode.remote-containers",
    "mongodb.mongodb-vscode",
    "github.copilot"
  ]
}
```

### VSCode Settings (.vscode/settings.json)

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact"
  ],
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true
}
```

---

## Performance Tips

1. **Use .dockerignore**: Exclude node_modules and build files
2. **Enable HMR (Hot Module Replacement)**: Frontend hot reloads on file changes
3. **Database Indexing**: Essential queries have indexes (see DATABASE_SCHEMA.md)
4. **Connection Pooling**: PostgreSQL uses PgBouncer for connection management
5. **Redis Caching**: Frequently accessed data cached in Redis

---

## Next Steps

1. Read [API.md](./API.md) for available endpoints
2. Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
3. Check [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for database structure
4. Review backend/src for code structure
5. Review frontend/src for component structure
6. Run tests to ensure setup works: `npm run test:all`

---

## Getting Help

- **Issues**: https://github.com/yourusername/codespawn/issues
- **Discussions**: https://github.com/yourusername/codespawn/discussions
- **Discord**: [Join Community](https://discord.gg/codespawn)
- **Documentation**: [Docs Site](https://docs.codespawn.dev)

---

## Common Development Tasks

### Creating a New Feature

1. Create feature branch: `git checkout -b feature/feature-name`
2. Make changes to backend and/or frontend
3. Run tests: `npm run test`
4. Commit changes: `git commit -m "feat: add feature"`
5. Push branch: `git push origin feature/feature-name`
6. Create Pull Request on GitHub

### Adding a New Database Field

1. Create migration: `npm run migrate:create -- --name add_field`
2. Edit migration file in backend/migrations/
3. Run migration: `npm run migrate`
4. Update Sequelize model in backend/src/models/
5. Update API endpoints if needed
6. Update tests

### Debugging

```bash
# Backend debugging
node --inspect-brk backend/src/app.js

# Then open chrome://inspect in Chrome

# Frontend debugging
# Open DevTools in browser (F12)
# Use React DevTools browser extension

# Enable debug logging
DEBUG=app:* npm run dev
```

