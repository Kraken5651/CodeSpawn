'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const description = await queryInterface.describeTable('difficulty_levels');
    if (!description.description) {
      await queryInterface.addColumn('difficulty_levels', 'description', { type: Sequelize.TEXT });
    }
  },

  down: async (queryInterface) => {
    const description = await queryInterface.describeTable('difficulty_levels');
    if (description.description) {
      await queryInterface.removeColumn('difficulty_levels', 'description');
    }
  }
};
