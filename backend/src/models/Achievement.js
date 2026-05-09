/**
 * Achievement Model
 * Badges and milestones users can unlock
 */

module.exports = (sequelize, DataTypes) => {
  const Achievement = sequelize.define('Achievement', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    icon_url: {
      type: DataTypes.TEXT
    },
    icon_emoji: {
      type: DataTypes.STRING
    },
    unlock_condition: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    xp_reward: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    rarity: {
      type: DataTypes.STRING,
      defaultValue: 'COMMON',
      validate: {
        isIn: [['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY']]
      }
    },
    difficulty: {
      type: DataTypes.STRING
    },
    category: {
      type: DataTypes.STRING
    },
    is_hidden: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'achievements',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Achievement.associate = (models) => {
    Achievement.belongsToMany(models.User, {
      through: 'user_achievements',
      foreignKey: 'achievement_id',
      as: 'users'
    });
  };

  return Achievement;
};
