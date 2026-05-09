/**
 * DifficultyLevel Model
 * Problem difficulty tiers: EASY, MEDIUM, HARD, EXPERT
 */

module.exports = (sequelize, DataTypes) => {
  const DifficultyLevel = sequelize.define('DifficultyLevel', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isIn: [['EASY', 'MEDIUM', 'HARD', 'EXPERT']]
      }
    },
    level: {
      type: DataTypes.INTEGER,
      unique: true,
      validate: {
        isIn: [[1, 2, 3, 4]]
      }
    },
    xp_reward: {
      type: DataTypes.INTEGER
    },
    color: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'difficulty_levels',
    timestamps: false
  });

  DifficultyLevel.associate = (models) => {
    DifficultyLevel.hasMany(models.Problem, {
      foreignKey: 'difficulty_id',
      as: 'problems'
    });
  };

  return DifficultyLevel;
};
