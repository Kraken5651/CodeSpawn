/**
 * Submission Model
 * Code submissions from users for problems
 */

module.exports = (sequelize, DataTypes) => {
  const Submission = sequelize.define('Submission', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    problem_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'problems',
        key: 'id'
      }
    },
    code: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    language_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'languages',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'PENDING',
      validate: {
        isIn: [['PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'ERROR', 'TIMEOUT']]
      }
    },
    passed_tests: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    total_tests: {
      type: DataTypes.INTEGER
    },
    execution_time_ms: {
      type: DataTypes.INTEGER
    },
    memory_used_mb: {
      type: DataTypes.INTEGER
    },
    error_message: {
      type: DataTypes.TEXT
    },
    stdout_output: {
      type: DataTypes.TEXT
    },
    stderr_output: {
      type: DataTypes.TEXT
    },
    is_accepted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    started_at: {
      type: DataTypes.DATE
    },
    completed_at: {
      type: DataTypes.DATE
    },
    execution_details: {
      type: DataTypes.JSONB
    }
  }, {
    tableName: 'submissions',
    timestamps: true,
    createdAt: 'submitted_at',
    updatedAt: 'updated_at'
  });

  Submission.associate = (models) => {
    Submission.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });

    Submission.belongsTo(models.Problem, {
      foreignKey: 'problem_id',
      as: 'problem'
    });

    Submission.belongsTo(models.Language, {
      foreignKey: 'language_id',
      as: 'language'
    });
  };

  return Submission;
};
