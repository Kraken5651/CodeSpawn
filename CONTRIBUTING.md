# Contributing to CodeSpawn

Thank you for your interest in contributing to CodeSpawn! We welcome contributions from everyone.

## Code of Conduct

Be respectful, inclusive, and professional in all interactions.

## Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/codespawn.git
   cd codespawn
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Set up development environment**
   ```bash
   # See SETUP.md for detailed instructions
   docker-compose up -d
   ```

4. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic

5. **Run tests and linting**
   ```bash
   npm run test
   npm run lint:fix
   npm run format
   ```

6. **Commit your changes**
   ```bash
   git commit -m "feat: describe your changes"
   ```
   - Use conventional commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`

7. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Create a Pull Request**
   - Provide a clear description
   - Reference any related issues
   - Ensure all checks pass

## Development Guidelines

### Backend (Node.js/Express)
- Use async/await over callbacks
- Implement proper error handling
- Write unit tests for new features
- Use TypeScript when possible
- Follow REST API conventions
- Add JSDoc comments for functions

### Frontend (React/Vue)
- Create reusable components
- Use hooks for state management
- Keep components small and focused
- Write meaningful prop comments
- Test components with Vitest

### Database
- Write migrations for schema changes
- Use proper indexing
- Add constraints for data integrity
- Document complex queries

### Git Workflow
```
main (stable)
  ↓
develop (development)
  ↓
feature/xxx (your feature branch)
```

## Issue Types

### Bug Reports
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

### Feature Requests
- Clear use case
- Why it would be useful
- Proposed implementation (if you have ideas)

### Documentation
- Typos, unclear instructions
- Missing sections
- Outdated information

## Review Process

1. Code review by maintainers
2. Automated tests must pass
3. No conflicts with main branch
4. At least one approval required

## Questions?

- Open an issue with the question label
- Ask in Discussions
- Join our Discord community

## Thank You!

Your contributions help make CodeSpawn better for everyone! 🦑

