# CodeSpawn - Complete Database Schema

## PostgreSQL Schema Definition

```sql
-- ============================================================================
-- USERS & AUTHENTICATION
-- ============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    profile_picture_url TEXT,
    bio TEXT,
    location VARCHAR(255),
    website_url VARCHAR(255),
    social_github VARCHAR(255),
    social_twitter VARCHAR(255),
    preferred_language VARCHAR(50) DEFAULT 'C#',
    theme VARCHAR(20) DEFAULT 'dark', -- 'light' | 'dark' | 'auto'
    role VARCHAR(50) DEFAULT 'user', -- 'user' | 'moderator' | 'admin'
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    total_xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    current_streak_count INTEGER DEFAULT 0,
    max_streak_count INTEGER DEFAULT 0,
    current_streak_start_date DATE,
    last_submission_date DATE,
    problems_solved INTEGER DEFAULT 0,
    problems_attempted INTEGER DEFAULT 0,
    total_submissions INTEGER DEFAULT 0,
    acceptance_rate DECIMAL(5, 2) DEFAULT 0.0,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE oauth_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL, -- 'google' | 'github' | 'discord'
    provider_user_id VARCHAR(255) NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    token_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(provider, provider_user_id)
);

CREATE TABLE sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    access_token VARCHAR(500),
    refresh_token VARCHAR(500),
    user_agent TEXT,
    ip_address VARCHAR(45),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- PROBLEMS & CODING CHALLENGES
-- ============================================================================

CREATE TABLE languages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL, -- 'C#', 'Python', 'JavaScript', 'C++'
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE difficulty_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL, -- 'EASY', 'MEDIUM', 'HARD', 'EXPERT'
    level INTEGER UNIQUE NOT NULL, -- 1, 2, 3, 4
    xp_reward INTEGER, -- 50, 100, 150, 200
    color VARCHAR(20), -- 'green', 'yellow', 'red', 'purple'
    description TEXT
);

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon_emoji VARCHAR(10),
    color VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE problems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    detailed_description TEXT,
    difficulty_id UUID NOT NULL REFERENCES difficulty_levels(id),
    category_id UUID NOT NULL REFERENCES categories(id),
    language_id UUID NOT NULL REFERENCES languages(id),
    time_limit_seconds INTEGER DEFAULT 5,
    memory_limit_mb INTEGER DEFAULT 256,
    xp_reward INTEGER,
    boilerplate_code TEXT, -- Starting code template
    solution_code TEXT,
    solution_explanation TEXT,
    created_by UUID NOT NULL REFERENCES users(id),
    is_published BOOLEAN DEFAULT FALSE,
    is_premium BOOLEAN DEFAULT FALSE,
    acceptance_rate DECIMAL(5, 2) DEFAULT 0.0,
    total_attempts INTEGER DEFAULT 0,
    total_solved INTEGER DEFAULT 0,
    total_discussions INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    rating DECIMAL(3, 2),
    estimated_time_minutes INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE test_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    input TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    explanation TEXT,
    is_hidden BOOLEAN DEFAULT FALSE, -- Hidden from users, used for validation
    display_order INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(20),
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE problem_tags (
    problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (problem_id, tag_id)
);

-- ============================================================================
-- SUBMISSIONS & CODE EXECUTION
-- ============================================================================

CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    language_id UUID NOT NULL REFERENCES languages(id),
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, RUNNING, COMPLETED, FAILED, ERROR, TIMEOUT
    passed_tests INTEGER DEFAULT 0,
    total_tests INTEGER,
    execution_time_ms INTEGER,
    memory_used_mb INTEGER,
    error_message TEXT,
    stdout_output TEXT,
    stderr_output TEXT,
    is_accepted BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    execution_details JSONB -- For extended debugging info
);

CREATE TABLE user_problems (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    times_attempted INTEGER DEFAULT 0,
    times_solved INTEGER DEFAULT 0,
    last_attempted_at TIMESTAMP,
    first_solved_at TIMESTAMP,
    best_runtime_ms INTEGER,
    best_memory_mb INTEGER,
    last_submission_status VARCHAR(50),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, problem_id)
);

-- ============================================================================
-- GAMIFICATION & ACHIEVEMENTS
-- ============================================================================

CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon_url TEXT,
    icon_emoji VARCHAR(10),
    unlock_condition JSONB NOT NULL, -- {type: 'problems_solved', count: 10}
    xp_reward INTEGER DEFAULT 0,
    rarity VARCHAR(50) DEFAULT 'COMMON', -- COMMON, UNCOMMON, RARE, EPIC, LEGENDARY
    difficulty VARCHAR(50),
    category VARCHAR(100), -- 'milestone', 'streak', 'skill', 'social', etc.
    is_hidden BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0, -- For partially completed achievements
    unlocked_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, achievement_id)
);

CREATE TABLE streaks (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    current_streak_count INTEGER DEFAULT 0,
    max_streak_count INTEGER DEFAULT 0,
    current_streak_start_date DATE,
    last_submission_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE xp_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    reason VARCHAR(100) NOT NULL, -- 'problem_solved', 'streak_bonus', 'achievement', 'community_help'
    problem_id UUID REFERENCES problems(id) ON DELETE SET NULL,
    achievement_id UUID REFERENCES achievements(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- SOCIAL & COMMUNITY
-- ============================================================================

CREATE TABLE user_followers (
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, following_id),
    CHECK (follower_id != following_id)
);

CREATE TABLE discussions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50), -- 'solution', 'question', 'bug', 'optimization'
    is_pinned BOOLEAN DEFAULT FALSE,
    is_closed BOOLEAN DEFAULT FALSE,
    views_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE discussion_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    parent_reply_id UUID REFERENCES discussion_replies(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    is_accepted_answer BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE user_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    discussion_id UUID REFERENCES discussions(id) ON DELETE CASCADE,
    reply_id UUID REFERENCES discussion_replies(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK ((discussion_id IS NOT NULL AND reply_id IS NULL) OR (discussion_id IS NULL AND reply_id IS NOT NULL))
);

-- ============================================================================
-- LEARNING PATHS & PROGRESSION
-- ============================================================================

CREATE TABLE learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    level VARCHAR(50), -- 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'
    estimated_hours INTEGER,
    icon_emoji VARCHAR(10),
    is_published BOOLEAN DEFAULT FALSE,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE learning_path_problems (
    learning_path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
    problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    is_required BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (learning_path_id, problem_id)
);

CREATE TABLE user_learning_progress (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    learning_path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
    progress_percentage INTEGER DEFAULT 0,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    last_accessed_at TIMESTAMP,
    PRIMARY KEY (user_id, learning_path_id)
);

-- ============================================================================
-- LEADERBOARDS & RANKINGS
-- ============================================================================

CREATE TABLE leaderboard_entries (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    weekly_rank INTEGER,
    weekly_xp INTEGER DEFAULT 0,
    monthly_rank INTEGER,
    monthly_xp INTEGER DEFAULT 0,
    all_time_rank INTEGER,
    all_time_xp INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friendship_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'PENDING', -- 'PENDING', 'ACCEPTED', 'DECLINED', 'BLOCKED'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP,
    UNIQUE(from_user_id, to_user_id),
    CHECK (from_user_id != to_user_id)
);

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL, -- 'submission_result', 'achievement_unlocked', 'discussion_reply', etc.
    title VARCHAR(255) NOT NULL,
    content TEXT,
    related_problem_id UUID REFERENCES problems(id) ON DELETE SET NULL,
    related_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    is_read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    INDEX idx_user_unread (user_id, is_read)
);

-- ============================================================================
-- ADMIN & MODERATION
-- ============================================================================

CREATE TABLE problem_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    reported_by UUID NOT NULL REFERENCES users(id),
    reason VARCHAR(255) NOT NULL, -- 'incorrect_expected_output', 'unclear_description', 'duplicate', 'offensive_content'
    details TEXT,
    status VARCHAR(50) DEFAULT 'OPEN', -- 'OPEN', 'IN_REVIEW', 'RESOLVED', 'DISMISSED'
    resolution_notes TEXT,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE content_moderation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type VARCHAR(50) NOT NULL, -- 'discussion', 'reply', 'problem'
    content_id UUID NOT NULL,
    flagged_by UUID NOT NULL REFERENCES users(id),
    reason VARCHAR(100) NOT NULL, -- 'spam', 'inappropriate', 'harassment', 'misinformation'
    status VARCHAR(50) DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED', 'REMOVED'
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    changes JSONB, -- Before and after values
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_action (action, created_at),
    INDEX idx_audit_resource (resource_type, resource_id)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_problems_difficulty ON problems(difficulty_id);
CREATE INDEX idx_problems_category ON problems(category_id);
CREATE INDEX idx_problems_language ON problems(language_id);
CREATE INDEX idx_problems_published ON problems(is_published);
CREATE INDEX idx_submissions_user_problem ON submissions(user_id, problem_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_created_at ON submissions(created_at);
CREATE INDEX idx_user_problems_solved ON user_problems(user_id, times_solved);
CREATE INDEX idx_discussions_problem ON discussions(problem_id);
CREATE INDEX idx_discussions_created_at ON discussions(created_at);
CREATE INDEX idx_follower_following ON user_followers(follower_id, following_id);
CREATE INDEX idx_xp_transactions_user ON xp_transactions(user_id, created_at);
CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read, created_at);

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

CREATE VIEW user_problem_stats AS
SELECT 
    u.id as user_id,
    COUNT(DISTINCT CASE WHEN up.times_solved > 0 THEN up.problem_id END) as problems_solved,
    COUNT(DISTINCT up.problem_id) as problems_attempted,
    AVG(CASE WHEN up.times_solved > 0 THEN 100.0 ELSE 0 END) as accuracy_percentage
FROM users u
LEFT JOIN user_problems up ON u.id = up.user_id
GROUP BY u.id;

CREATE VIEW problem_popularity AS
SELECT 
    p.id,
    p.title,
    COUNT(DISTINCT up.user_id) as unique_users_attempted,
    COUNT(DISTINCT CASE WHEN up.times_solved > 0 THEN up.user_id END) as unique_users_solved,
    (CAST(COUNT(DISTINCT CASE WHEN up.times_solved > 0 THEN up.user_id END) AS FLOAT) / 
     NULLIF(COUNT(DISTINCT up.user_id), 0) * 100) as success_rate
FROM problems p
LEFT JOIN user_problems up ON p.id = up.problem_id
WHERE p.is_published = TRUE
GROUP BY p.id, p.title;
```

---

## Redis Key Structure

```
# Session storage
session:{sessionId} = {userObject}

# User data caching
user:{userId}:profile = {profileData}
user:{userId}:achievements = {achievementsArray}
user:{userId}:streak = {streakData}

# Problem caching
problem:{problemId} = {problemData}
problem:{problemId}:testcases = {testCasesArray}
problem:{problemId}:discussions = {discussionsArray}

# Leaderboards
leaderboard:global:weekly = ZSET of user scores (sorted by XP)
leaderboard:global:monthly = ZSET of user scores
leaderboard:global:alltime = ZSET of user scores
leaderboard:user:{userId}:following = ZSET of scores of users being followed

# Problem stats (updated frequently)
problem:stats:{problemId} = {statsObject}

# Rate limiting
ratelimit:user:{userId}:submissions = counter

# Job queues
queue:code_execution = {submissionIds to process}
queue:achievements = {userIds to check}
```

