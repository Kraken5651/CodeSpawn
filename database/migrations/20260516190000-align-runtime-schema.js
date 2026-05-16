'use strict';

const addColumnIfMissing = async (queryInterface, table, column, definition) => {
  const description = await queryInterface.describeTable(table);
  if (!description[column]) {
    await queryInterface.addColumn(table, column, definition);
  }
};

const removeColumnIfPresent = async (queryInterface, table, column) => {
  const description = await queryInterface.describeTable(table);
  if (description[column]) {
    await queryInterface.removeColumn(table, column);
  }
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await addColumnIfMissing(queryInterface, 'user_profiles', 'max_streak_count', { type: Sequelize.INTEGER, defaultValue: 0 });
    await addColumnIfMissing(queryInterface, 'user_profiles', 'current_streak_start_date', { type: Sequelize.DATE });
    await addColumnIfMissing(queryInterface, 'user_profiles', 'last_submission_date', { type: Sequelize.DATE });
    await addColumnIfMissing(queryInterface, 'user_profiles', 'problems_attempted', { type: Sequelize.INTEGER, defaultValue: 0 });
    await addColumnIfMissing(queryInterface, 'user_profiles', 'total_submissions', { type: Sequelize.INTEGER, defaultValue: 0 });
    await addColumnIfMissing(queryInterface, 'user_profiles', 'acceptance_rate', { type: Sequelize.DECIMAL(5, 2), defaultValue: 0.0 });
    await addColumnIfMissing(queryInterface, 'user_profiles', 'notifications_enabled', { type: Sequelize.BOOLEAN, defaultValue: true });
    await addColumnIfMissing(queryInterface, 'user_profiles', 'email_notifications', { type: Sequelize.BOOLEAN, defaultValue: true });

    await addColumnIfMissing(queryInterface, 'problems', 'detailed_description', { type: Sequelize.TEXT });
    await addColumnIfMissing(queryInterface, 'problems', 'time_limit_seconds', { type: Sequelize.INTEGER, defaultValue: 5 });
    await addColumnIfMissing(queryInterface, 'problems', 'memory_limit_mb', { type: Sequelize.INTEGER, defaultValue: 256 });
    await addColumnIfMissing(queryInterface, 'problems', 'solution_explanation', { type: Sequelize.TEXT });
    await addColumnIfMissing(queryInterface, 'problems', 'is_premium', { type: Sequelize.BOOLEAN, defaultValue: false });
    await addColumnIfMissing(queryInterface, 'problems', 'acceptance_rate', { type: Sequelize.DECIMAL(5, 2), defaultValue: 0.0 });
    await addColumnIfMissing(queryInterface, 'problems', 'total_attempts', { type: Sequelize.INTEGER, defaultValue: 0 });
    await addColumnIfMissing(queryInterface, 'problems', 'total_solved', { type: Sequelize.INTEGER, defaultValue: 0 });
    await addColumnIfMissing(queryInterface, 'problems', 'total_discussions', { type: Sequelize.INTEGER, defaultValue: 0 });
    await addColumnIfMissing(queryInterface, 'problems', 'view_count', { type: Sequelize.INTEGER, defaultValue: 0 });
    await addColumnIfMissing(queryInterface, 'problems', 'likes_count', { type: Sequelize.INTEGER, defaultValue: 0 });
    await addColumnIfMissing(queryInterface, 'problems', 'rating', { type: Sequelize.DECIMAL(3, 2) });
    await addColumnIfMissing(queryInterface, 'problems', 'estimated_time_minutes', { type: Sequelize.INTEGER });
    await addColumnIfMissing(queryInterface, 'problems', 'deleted_at', { type: Sequelize.DATE });

    await addColumnIfMissing(queryInterface, 'test_cases', 'explanation', { type: Sequelize.TEXT });
    await addColumnIfMissing(queryInterface, 'test_cases', 'display_order', { type: Sequelize.INTEGER });

    await addColumnIfMissing(queryInterface, 'submissions', 'execution_time_ms', { type: Sequelize.INTEGER });
    await addColumnIfMissing(queryInterface, 'submissions', 'memory_used_mb', { type: Sequelize.INTEGER });
    await addColumnIfMissing(queryInterface, 'submissions', 'error_message', { type: Sequelize.TEXT });
    await addColumnIfMissing(queryInterface, 'submissions', 'stdout_output', { type: Sequelize.TEXT });
    await addColumnIfMissing(queryInterface, 'submissions', 'stderr_output', { type: Sequelize.TEXT });
    await addColumnIfMissing(queryInterface, 'submissions', 'started_at', { type: Sequelize.DATE });
    await addColumnIfMissing(queryInterface, 'submissions', 'completed_at', { type: Sequelize.DATE });
    await addColumnIfMissing(queryInterface, 'submissions', 'execution_details', { type: Sequelize.JSONB });
  },

  down: async (queryInterface) => {
    await removeColumnIfPresent(queryInterface, 'submissions', 'execution_details');
    await removeColumnIfPresent(queryInterface, 'submissions', 'completed_at');
    await removeColumnIfPresent(queryInterface, 'submissions', 'started_at');
    await removeColumnIfPresent(queryInterface, 'submissions', 'stderr_output');
    await removeColumnIfPresent(queryInterface, 'submissions', 'stdout_output');
    await removeColumnIfPresent(queryInterface, 'submissions', 'error_message');
    await removeColumnIfPresent(queryInterface, 'submissions', 'memory_used_mb');
    await removeColumnIfPresent(queryInterface, 'submissions', 'execution_time_ms');

    await removeColumnIfPresent(queryInterface, 'test_cases', 'display_order');
    await removeColumnIfPresent(queryInterface, 'test_cases', 'explanation');

    await removeColumnIfPresent(queryInterface, 'problems', 'deleted_at');
    await removeColumnIfPresent(queryInterface, 'problems', 'estimated_time_minutes');
    await removeColumnIfPresent(queryInterface, 'problems', 'rating');
    await removeColumnIfPresent(queryInterface, 'problems', 'likes_count');
    await removeColumnIfPresent(queryInterface, 'problems', 'view_count');
    await removeColumnIfPresent(queryInterface, 'problems', 'total_discussions');
    await removeColumnIfPresent(queryInterface, 'problems', 'total_solved');
    await removeColumnIfPresent(queryInterface, 'problems', 'total_attempts');
    await removeColumnIfPresent(queryInterface, 'problems', 'acceptance_rate');
    await removeColumnIfPresent(queryInterface, 'problems', 'is_premium');
    await removeColumnIfPresent(queryInterface, 'problems', 'solution_explanation');
    await removeColumnIfPresent(queryInterface, 'problems', 'memory_limit_mb');
    await removeColumnIfPresent(queryInterface, 'problems', 'time_limit_seconds');
    await removeColumnIfPresent(queryInterface, 'problems', 'detailed_description');

    await removeColumnIfPresent(queryInterface, 'user_profiles', 'email_notifications');
    await removeColumnIfPresent(queryInterface, 'user_profiles', 'notifications_enabled');
    await removeColumnIfPresent(queryInterface, 'user_profiles', 'acceptance_rate');
    await removeColumnIfPresent(queryInterface, 'user_profiles', 'total_submissions');
    await removeColumnIfPresent(queryInterface, 'user_profiles', 'problems_attempted');
    await removeColumnIfPresent(queryInterface, 'user_profiles', 'last_submission_date');
    await removeColumnIfPresent(queryInterface, 'user_profiles', 'current_streak_start_date');
    await removeColumnIfPresent(queryInterface, 'user_profiles', 'max_streak_count');
  }
};
