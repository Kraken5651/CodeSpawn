'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Users
    await queryInterface.createTable('users', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      email: { type: Sequelize.STRING, unique: true, allowNull: false },
      username: { type: Sequelize.STRING, unique: true, allowNull: false },
      password_hash: { type: Sequelize.STRING, allowNull: false },
      first_name: { type: Sequelize.STRING },
      last_name: { type: Sequelize.STRING },
      preferred_language: { type: Sequelize.STRING, defaultValue: 'C#' },
      role: { type: Sequelize.STRING, defaultValue: 'user' },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      deleted_at: { type: Sequelize.DATE }
    });

    // 2. User Profiles
    await queryInterface.createTable('user_profiles', {
      user_id: { type: Sequelize.UUID, primaryKey: true, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      total_xp: { type: Sequelize.INTEGER, defaultValue: 0 },
      level: { type: Sequelize.INTEGER, defaultValue: 1 },
      current_streak_count: { type: Sequelize.INTEGER, defaultValue: 0 },
      max_streak_count: { type: Sequelize.INTEGER, defaultValue: 0 },
      current_streak_start_date: { type: Sequelize.DATE },
      last_submission_date: { type: Sequelize.DATE },
      problems_solved: { type: Sequelize.INTEGER, defaultValue: 0 },
      problems_attempted: { type: Sequelize.INTEGER, defaultValue: 0 },
      total_submissions: { type: Sequelize.INTEGER, defaultValue: 0 },
      acceptance_rate: { type: Sequelize.DECIMAL(5, 2), defaultValue: 0.0 },
      notifications_enabled: { type: Sequelize.BOOLEAN, defaultValue: true },
      email_notifications: { type: Sequelize.BOOLEAN, defaultValue: true },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // 3. Languages
    await queryInterface.createTable('languages', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      name: { type: Sequelize.STRING, unique: true, allowNull: false },
      slug: { type: Sequelize.STRING, unique: true, allowNull: false },
      icon_url: { type: Sequelize.TEXT },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // 4. Difficulty Levels
    await queryInterface.createTable('difficulty_levels', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      name: { type: Sequelize.STRING, unique: true, allowNull: false },
      level: { type: Sequelize.INTEGER, unique: true, allowNull: false },
      xp_reward: { type: Sequelize.INTEGER },
      color: { type: Sequelize.STRING },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // 5. Categories
    await queryInterface.createTable('categories', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      name: { type: Sequelize.STRING, unique: true, allowNull: false },
      slug: { type: Sequelize.STRING, unique: true, allowNull: false },
      description: { type: Sequelize.TEXT },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // 6. Problems
    await queryInterface.createTable('problems', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      title: { type: Sequelize.STRING, allowNull: false },
      slug: { type: Sequelize.STRING, unique: true, allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: false },
      detailed_description: { type: Sequelize.TEXT },
      difficulty_id: { type: Sequelize.UUID, references: { model: 'difficulty_levels', key: 'id' } },
      category_id: { type: Sequelize.UUID, references: { model: 'categories', key: 'id' } },
      language_id: { type: Sequelize.UUID, references: { model: 'languages', key: 'id' } },
      time_limit_seconds: { type: Sequelize.INTEGER, defaultValue: 5 },
      memory_limit_mb: { type: Sequelize.INTEGER, defaultValue: 256 },
      xp_reward: { type: Sequelize.INTEGER },
      boilerplate_code: { type: Sequelize.TEXT },
      solution_code: { type: Sequelize.TEXT },
      solution_explanation: { type: Sequelize.TEXT },
      created_by: { type: Sequelize.UUID, references: { model: 'users', key: 'id' } },
      is_published: { type: Sequelize.BOOLEAN, defaultValue: false },
      is_premium: { type: Sequelize.BOOLEAN, defaultValue: false },
      acceptance_rate: { type: Sequelize.DECIMAL(5, 2), defaultValue: 0.0 },
      total_attempts: { type: Sequelize.INTEGER, defaultValue: 0 },
      total_solved: { type: Sequelize.INTEGER, defaultValue: 0 },
      total_discussions: { type: Sequelize.INTEGER, defaultValue: 0 },
      view_count: { type: Sequelize.INTEGER, defaultValue: 0 },
      likes_count: { type: Sequelize.INTEGER, defaultValue: 0 },
      rating: { type: Sequelize.DECIMAL(3, 2) },
      estimated_time_minutes: { type: Sequelize.INTEGER },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      deleted_at: { type: Sequelize.DATE }
    });

    // 7. Test Cases
    await queryInterface.createTable('test_cases', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      problem_id: { type: Sequelize.UUID, references: { model: 'problems', key: 'id' }, onDelete: 'CASCADE' },
      input: { type: Sequelize.TEXT, allowNull: false },
      expected_output: { type: Sequelize.TEXT, allowNull: false },
      explanation: { type: Sequelize.TEXT },
      is_hidden: { type: Sequelize.BOOLEAN, defaultValue: false },
      display_order: { type: Sequelize.INTEGER },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // 8. Submissions
    await queryInterface.createTable('submissions', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      user_id: { type: Sequelize.UUID, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      problem_id: { type: Sequelize.UUID, references: { model: 'problems', key: 'id' }, onDelete: 'CASCADE' },
      code: { type: Sequelize.TEXT, allowNull: false },
      language_id: { type: Sequelize.UUID, references: { model: 'languages', key: 'id' } },
      status: { type: Sequelize.STRING, defaultValue: 'PENDING' },
      passed_tests: { type: Sequelize.INTEGER, defaultValue: 0 },
      total_tests: { type: Sequelize.INTEGER },
      execution_time_ms: { type: Sequelize.INTEGER },
      memory_used_mb: { type: Sequelize.INTEGER },
      error_message: { type: Sequelize.TEXT },
      stdout_output: { type: Sequelize.TEXT },
      stderr_output: { type: Sequelize.TEXT },
      is_accepted: { type: Sequelize.BOOLEAN, defaultValue: false },
      started_at: { type: Sequelize.DATE },
      completed_at: { type: Sequelize.DATE },
      execution_details: { type: Sequelize.JSONB },
      submitted_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('submissions');
    await queryInterface.dropTable('test_cases');
    await queryInterface.dropTable('problems');
    await queryInterface.dropTable('categories');
    await queryInterface.dropTable('difficulty_levels');
    await queryInterface.dropTable('languages');
    await queryInterface.dropTable('user_profiles');
    await queryInterface.dropTable('users');
  }
};
