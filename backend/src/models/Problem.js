/**
 * Problem Model
 * Coding challenges/problems for users to solve
 */

module.exports = (sequelize, DataTypes) => {
  const Problem = sequelize.define('Problem', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    detailed_description: {
      type: DataTypes.TEXT
    },
    difficulty_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'difficulty_levels',
        key: 'id'
      }
    },
    language_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'languages',
        key: 'id'
      }
    },
    time_limit_seconds: {
      type: DataTypes.INTEGER,
      defaultValue: 5
    },
    memory_limit_mb: {
      type: DataTypes.INTEGER,
      defaultValue: 256
    },
    xp_reward: {
      type: DataTypes.INTEGER
    },
    boilerplate_code: {
      type: DataTypes.TEXT
    },
    solution_code: {
      type: DataTypes.TEXT
    },
    solution_explanation: {
      type: DataTypes.TEXT
    },
    created_by: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_premium: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    acceptance_rate: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.0
    },
    total_attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    total_solved: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    total_discussions: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    view_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    likes_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2)
    },
    estimated_time_minutes: {
      type: DataTypes.INTEGER
    },
    deleted_at: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'problems',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true
  });

  Problem.associate = (models) => {
    Problem.belongsTo(models.DifficultyLevel, {
      foreignKey: 'difficulty_id',
      as: 'difficulty'
    });

    Problem.belongsTo(models.Language, {
      foreignKey: 'language_id',
      as: 'language'
    });

    Problem.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'creator'
    });

    Problem.hasMany(models.Submission, {
      foreignKey: 'problem_id',
      as: 'submissions'
    });

    Problem.hasMany(models.TestCase, {
      foreignKey: 'problem_id',
      as: 'test_cases'
    });

    Problem.hasMany(models.Discussion, {
      foreignKey: 'problem_id',
      as: 'discussions'
    });
  };

  return Problem;
};
