/**
 * UserProfile Model
 * Stores gamification and progression data for users
 */

module.exports = (sequelize, DataTypes) => {
  const UserProfile = sequelize.define('UserProfile', {
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    total_xp: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    level: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    current_streak_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    max_streak_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    current_streak_start_date: {
      type: DataTypes.DATE
    },
    last_submission_date: {
      type: DataTypes.DATE
    },
    problems_solved: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    problems_attempted: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    total_submissions: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    acceptance_rate: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.0
    },
    notifications_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    email_notifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'user_profiles',
    timestamps: false,
    createdAt: false,
    updatedAt: 'updated_at'
  });

  UserProfile.associate = (models) => {
    UserProfile.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return UserProfile;
};
