# CodeSpawn API Documentation

Base URL: `https://api.codespawn.dev/api`

Authentication: JWT Bearer token in `Authorization` header

---

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "securePassword123",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "username",
      "created_at": "2024-01-01T00:00:00Z"
    },
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

**Errors:**
- 400: Invalid input or email already exists
- 422: Validation error

---

### POST /auth/login
Authenticate user and get tokens.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "username",
      "role": "user",
      "profile_picture_url": null
    },
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 3600
  }
}
```

**Errors:**
- 401: Invalid credentials
- 404: User not found

---

### POST /auth/logout
Logout user (invalidate token).

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### POST /auth/refresh
Refresh access token using refresh token.

**Request:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "expiresIn": 3600
  }
}
```

---

### GET /auth/me
Get current authenticated user profile.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "username",
      "first_name": "John",
      "last_name": "Doe",
      "profile_picture_url": "https://...",
      "bio": "Aspiring game developer",
      "location": "San Francisco, CA",
      "website_url": "https://example.com",
      "role": "user",
      "created_at": "2024-01-01T00:00:00Z"
    },
    "profile": {
      "total_xp": 5420,
      "level": 12,
      "current_streak": 15,
      "max_streak": 42,
      "problems_solved": 87,
      "problems_attempted": 120,
      "acceptance_rate": 72.5
    }
  }
}
```

---

## User Endpoints

### GET /users/:id
Get user profile and statistics.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "username",
      "profile_picture_url": "https://...",
      "bio": "Aspiring game developer",
      "location": "San Francisco, CA",
      "website_url": "https://example.com",
      "social_github": "username",
      "social_twitter": "username"
    },
    "profile": {
      "total_xp": 5420,
      "level": 12,
      "current_streak": 15,
      "max_streak": 42,
      "problems_solved": 87,
      "problems_attempted": 120,
      "acceptance_rate": 72.5
    },
    "recent_achievements": [
      {
        "id": "uuid",
        "name": "First Blood",
        "description": "Solved your first problem",
        "icon_url": "https://...",
        "unlocked_at": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

---

### PUT /users/:id
Update user profile (authenticated user only).

**Request:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "bio": "Game dev enthusiast",
  "location": "San Francisco, CA",
  "website_url": "https://example.com",
  "preferred_language": "C#",
  "theme": "dark"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": { /* updated user */ }
  }
}
```

---

### GET /users/:id/problems
Get list of problems solved by user.

**Query Parameters:**
- `page`: 1 (default: 1)
- `limit`: 20 (default: 20)
- `sort_by`: 'date' | 'difficulty' (default: 'date')

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "problems": [
      {
        "id": "uuid",
        "title": "Variable Types",
        "difficulty": "EASY",
        "language": "C#",
        "solved_at": "2024-01-15T10:30:00Z",
        "runtime_ms": 125,
        "memory_mb": 45
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 87,
      "pages": 5
    }
  }
}
```

---

### GET /users/:id/streak
Get user's current and historical streak data.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "current_streak": 15,
    "max_streak": 42,
    "streak_start_date": "2024-01-18T00:00:00Z",
    "last_submission_date": "2024-02-01T18:45:00Z",
    "streak_history": [
      {
        "date": "2024-01-18",
        "problems_solved": 2,
        "xp_earned": 150
      }
    ]
  }
}
```

---

### GET /users/leaderboard
Get global leaderboard.

**Query Parameters:**
- `period`: 'weekly' | 'monthly' | 'alltime' (default: 'weekly')
- `page`: 1 (default: 1)
- `limit`: 50 (default: 50)
- `language`: 'C#', 'Python', etc. (optional filter)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "user": {
          "id": "uuid",
          "username": "topuser",
          "profile_picture_url": "https://..."
        },
        "xp": 25420,
        "problems_solved": 342,
        "streak": 120,
        "level": 45
      }
    ],
    "period": "weekly",
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 10000
    }
  }
}
```

---

### GET /users/:id/following
Get users that a user is following.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "username": "friendname",
        "profile_picture_url": "https://...",
        "total_xp": 8420,
        "level": 18
      }
    ]
  }
}
```

---

### POST /users/:id/follow
Follow a user.

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Now following user"
}
```

---

### DELETE /users/:id/follow
Unfollow a user.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Unfollowed user"
}
```

---

## Problem Endpoints

### GET /problems
List all problems with filtering.

**Query Parameters:**
- `page`: 1 (default: 1)
- `limit`: 20 (default: 20)
- `difficulty`: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT' (optional)
- `language`: 'C#' | 'Python' | 'JavaScript' | 'C++' (optional)
- `category`: 'game_dev' | 'algorithms' | etc. (optional)
- `status`: 'solved' | 'attempted' | 'unsolved' (optional, requires auth)
- `search`: search term (optional)
- `sort_by`: 'trending' | 'popular' | 'newest' | 'difficulty' (default: 'trending')

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "problems": [
      {
        "id": "uuid",
        "title": "Variable Types",
        "slug": "variable-types",
        "difficulty": {
          "id": "uuid",
          "name": "EASY",
          "xp_reward": 50
        },
        "category": {
          "id": "uuid",
          "name": "C# Foundations"
        },
        "language": {
          "id": "uuid",
          "name": "C#"
        },
        "acceptance_rate": 85.5,
        "total_attempts": 1250,
        "your_status": "solved", // Only if authenticated
        "estimated_time_minutes": 10,
        "rating": 4.5
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 450,
      "pages": 23
    }
  }
}
```

---

### GET /problems/:id
Get detailed problem information.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "problem": {
      "id": "uuid",
      "title": "Variable Types",
      "slug": "variable-types",
      "description": "Learn about...",
      "detailed_description": "In this problem...",
      "difficulty": { /* ... */ },
      "category": { /* ... */ },
      "language": { /* ... */ },
      "boilerplate_code": "public class Solution {\n    public void Solve() {\n        // Write your code here\n    }\n}",
      "time_limit_seconds": 5,
      "memory_limit_mb": 256,
      "estimated_time_minutes": 10,
      "xp_reward": 50,
      "acceptance_rate": 85.5,
      "total_discussions": 42,
      "your_status": "solved", // Only if authenticated
      "your_best_runtime_ms": 125,
      "your_best_memory_mb": 45,
      "tags": ["variables", "types", "basics"],
      "created_by": {
        "id": "uuid",
        "username": "problemauthor"
      },
      "created_at": "2024-01-01T00:00:00Z"
    },
    "test_cases_preview": [
      {
        "id": "uuid",
        "input": "int x = 5;",
        "expected_output": "5",
        "explanation": "Declaring an integer variable"
      }
    ]
  }
}
```

---

### POST /problems
Create a new problem (admin/moderator only).

**Request:**
```json
{
  "title": "Variable Types",
  "description": "Learn about...",
  "detailed_description": "In this problem...",
  "difficulty_id": "uuid",
  "category_id": "uuid",
  "language_id": "uuid",
  "boilerplate_code": "...",
  "solution_code": "...",
  "solution_explanation": "...",
  "time_limit_seconds": 5,
  "memory_limit_mb": 256,
  "estimated_time_minutes": 10,
  "tags": ["variables", "types"]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "problem": { /* created problem */ }
  }
}
```

---

## Submission Endpoints

### POST /submissions
Submit code solution for a problem.

**Request:**
```json
{
  "problem_id": "uuid",
  "code": "public class Solution {\n    public void Solve() {\n        // Your solution\n    }\n}",
  "language_id": "uuid"
}
```

**Response (202 Accepted):**
```json
{
  "success": true,
  "message": "Submission queued for execution",
  "data": {
    "submission": {
      "id": "uuid",
      "status": "PENDING",
      "submitted_at": "2024-02-01T18:45:00Z"
    }
  }
}
```

---

### GET /submissions/:id
Get submission details and results.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "submission": {
      "id": "uuid",
      "user_id": "uuid",
      "problem_id": "uuid",
      "code": "...",
      "language": "C#",
      "status": "COMPLETED",
      "is_accepted": true,
      "passed_tests": 10,
      "total_tests": 10,
      "execution_time_ms": 125,
      "memory_used_mb": 45,
      "stdout_output": "Output here...",
      "stderr_output": null,
      "submitted_at": "2024-02-01T18:45:00Z",
      "completed_at": "2024-02-01T18:45:05Z"
    }
  }
}
```

---

### GET /problems/:id/submissions
Get your submissions for a problem.

**Query Parameters:**
- `page`: 1 (default: 1)
- `limit`: 20 (default: 20)
- `status`: 'ACCEPTED' | 'FAILED' (optional)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "submissions": [
      {
        "id": "uuid",
        "status": "COMPLETED",
        "is_accepted": true,
        "passed_tests": 10,
        "total_tests": 10,
        "execution_time_ms": 125,
        "memory_used_mb": 45,
        "submitted_at": "2024-02-01T18:45:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5
    }
  }
}
```

---

## Discussion Endpoints

### GET /discussions/:problemId
Get discussions for a problem.

**Query Parameters:**
- `page`: 1
- `limit`: 20
- `sort_by`: 'newest' | 'popular' | 'most_replied'

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "discussions": [
      {
        "id": "uuid",
        "title": "How to approach this?",
        "user": {
          "id": "uuid",
          "username": "asker"
        },
        "category": "question",
        "views_count": 42,
        "replies_count": 5,
        "likes_count": 3,
        "is_pinned": false,
        "created_at": "2024-02-01T10:00:00Z",
        "updated_at": "2024-02-01T18:45:00Z"
      }
    ],
    "pagination": { /* ... */ }
  }
}
```

---

### GET /discussions/:id
Get single discussion with replies.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "discussion": {
      "id": "uuid",
      "title": "How to approach this?",
      "content": "I'm stuck on...",
      "user": {
        "id": "uuid",
        "username": "asker",
        "profile_picture_url": "https://..."
      },
      "category": "question",
      "views_count": 42,
      "likes_count": 3,
      "is_liked_by_you": false,
      "created_at": "2024-02-01T10:00:00Z"
    },
    "replies": [
      {
        "id": "uuid",
        "content": "Try this approach...",
        "user": {
          "id": "uuid",
          "username": "helper"
        },
        "likes_count": 5,
        "is_accepted_answer": true,
        "created_at": "2024-02-01T11:00:00Z"
      }
    ]
  }
}
```

---

### POST /discussions
Create new discussion.

**Request:**
```json
{
  "problem_id": "uuid",
  "title": "How to approach this?",
  "content": "I'm stuck on...",
  "category": "question"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "discussion": { /* created discussion */ }
  }
}
```

---

### POST /discussions/:id/replies
Reply to discussion.

**Request:**
```json
{
  "content": "Try this approach...",
  "parent_reply_id": null // For nested replies
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "reply": { /* created reply */ }
  }
}
```

---

## Achievement Endpoints

### GET /achievements
Get all available achievements.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "achievements": [
      {
        "id": "uuid",
        "name": "First Blood",
        "description": "Solve your first problem",
        "icon_emoji": "🩸",
        "rarity": "COMMON",
        "category": "milestone",
        "xp_reward": 10,
        "unlock_condition": {
          "type": "problems_solved",
          "count": 1
        }
      }
    ]
  }
}
```

---

### GET /users/:id/achievements
Get user's achievements.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "achievements": [
      {
        "id": "uuid",
        "name": "First Blood",
        "description": "Solve your first problem",
        "icon_emoji": "🩸",
        "unlocked_at": "2024-01-15T10:30:00Z"
      }
    ],
    "locked_achievements": [
      {
        "id": "uuid",
        "name": "Speedrunner",
        "description": "Solve 5 problems in under 1 minute each",
        "progress": 2,
        "required": 5
      }
    ]
  }
}
```

---

## Learning Path Endpoints

### GET /paths
Get all learning paths.

**Query Parameters:**
- `level`: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "paths": [
      {
        "id": "uuid",
        "title": "C# Game Development Fundamentals",
        "description": "Learn the basics...",
        "level": "BEGINNER",
        "estimated_hours": 20,
        "problems_count": 45,
        "enrolled_users": 1250,
        "your_progress": 35, // Only if authenticated
        "icon_emoji": "🎮"
      }
    ]
  }
}
```

---

### GET /paths/:id
Get learning path details.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "path": {
      "id": "uuid",
      "title": "C# Game Development Fundamentals",
      "description": "Learn the basics...",
      "level": "BEGINNER",
      "estimated_hours": 20,
      "your_progress": 35,
      "your_completion_estimate": "5 hours remaining"
    },
    "problems": [
      {
        "id": "uuid",
        "title": "Variable Types",
        "order": 1,
        "is_required": true,
        "your_status": "solved",
        "xp_reward": 50
      }
    ]
  }
}
```

---

## Admin Endpoints

### GET /admin/analytics
Get platform analytics (admin only).

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 10000,
      "active_today": 1250,
      "active_this_week": 5000,
      "new_this_week": 250
    },
    "problems": {
      "total": 450,
      "solved_today": 5000,
      "avg_difficulty": 2.5
    },
    "submissions": {
      "total": 75000,
      "accepted_rate": 62.5,
      "avg_execution_time_ms": 145
    },
    "engagement": {
      "avg_streak": 12.5,
      "avg_xp_per_user": 4250
    }
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR` (400)
- `UNAUTHORIZED` (401)
- `FORBIDDEN` (403)
- `NOT_FOUND` (404)
- `CONFLICT` (409)
- `RATE_LIMITED` (429)
- `SERVER_ERROR` (500)

---

## Rate Limiting

- Authenticated users: 100 requests per minute
- Anonymous users: 20 requests per minute
- File uploads: 10 per hour
- Code submissions: 50 per hour

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

