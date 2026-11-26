'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn('Users', 'department', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      });
    } catch (error) {
      console.log('Column department already exists in Users table. Skipping...');
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.removeColumn('Users', 'department');
    } catch (error) {
      console.log('Column department not found in Users table. Skipping...');
    }
  }
};
