/**
 * TestCase Model
 * Test cases for problems - used for validating submissions
 */

module.exports = (sequelize, DataTypes) => {
  const TestCase = sequelize.define('TestCase', {
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
    input: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    expected_output: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    explanation: {
      type: DataTypes.TEXT
    },
    is_hidden: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    display_order: {
      type: DataTypes.INTEGER
    }
  }, {
    tableName: 'test_cases',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  TestCase.associate = (models) => {
    TestCase.belongsTo(models.Problem, {
      foreignKey: 'problem_id',
      as: 'problem'
    });
  };

  return TestCase;
};
