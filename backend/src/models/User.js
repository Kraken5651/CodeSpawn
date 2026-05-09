/**
 * User Model
 * Represents user accounts with profiles and authentication data
 */

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      lowercase: true,
      validate: {
        isEmail: true
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 30]
      }
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING
    },
    last_name: {
      type: DataTypes.STRING
    },
    profile_picture_url: {
      type: DataTypes.TEXT
    },
    bio: {
      type: DataTypes.TEXT
    },
    location: {
      type: DataTypes.STRING
    },
    website_url: {
      type: DataTypes.STRING
    },
    social_github: {
      type: DataTypes.STRING
    },
    social_twitter: {
      type: DataTypes.STRING
    },
    preferred_language: {
      type: DataTypes.STRING,
      defaultValue: 'C#'
    },
    theme: {
      type: DataTypes.STRING,
      defaultValue: 'dark',
      validate: {
        isIn: [['light', 'dark', 'auto']]
      }
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user',
      validate: {
        isIn: [['user', 'moderator', 'admin']]
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    two_factor_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    last_login_at: {
      type: DataTypes.DATE
    },
    deleted_at: {
      type: DataTypes.DATE,
      defaultValue: null
    }
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at'
  });

  User.associate = (models) => {
    // One user has many submissions
    User.hasMany(models.Submission, {
      foreignKey: 'user_id',
      as: 'submissions'
    });

    // One user has one profile
    User.hasOne(models.UserProfile, {
      foreignKey: 'user_id',
      as: 'profile'
    });

    // Many users follow many users
    User.belongsToMany(models.User, {
      as: 'followers',
      through: 'user_followers',
      foreignKey: 'following_id',
      otherKey: 'follower_id'
    });

    User.belongsToMany(models.User, {
      as: 'following',
      through: 'user_followers',
      foreignKey: 'follower_id',
      otherKey: 'following_id'
    });

    // One user has many discussions
    User.hasMany(models.Discussion, {
      foreignKey: 'user_id',
      as: 'discussions'
    });

    // One user has many achievements
    User.belongsToMany(models.Achievement, {
      through: 'user_achievements',
      foreignKey: 'user_id',
      as: 'achievements'
    });
  };

  return User;
};
