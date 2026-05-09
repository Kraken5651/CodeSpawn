/**
 * Language Model
 * Supported programming languages (C#, Python, JavaScript, C++, etc.)
 */

module.exports = (sequelize, DataTypes) => {
  const Language = sequelize.define('Language', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    icon_url: {
      type: DataTypes.TEXT
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'languages',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Language.associate = (models) => {
    Language.hasMany(models.Problem, {
      foreignKey: 'language_id',
      as: 'problems'
    });

    Language.hasMany(models.Submission, {
      foreignKey: 'language_id',
      as: 'submissions'
    });
  };

  return Language;
};
