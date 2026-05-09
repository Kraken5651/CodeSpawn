/**
 * Discussion Model
 * Community discussions for each problem
 */

module.exports = (sequelize, DataTypes) => {
  const Discussion = sequelize.define('Discussion', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    problem_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'problems',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      validate: {
        isIn: [['solution', 'question', 'bug', 'optimization']]
      }
    },
    is_pinned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_closed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    views_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    replies_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    likes_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    deleted_at: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'discussions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true
  });

  Discussion.associate = (models) => {
    Discussion.belongsTo(models.Problem, {
      foreignKey: 'problem_id',
      as: 'problem'
    });

    Discussion.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return Discussion;
};
