'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn('JobVacancies', 'image', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      });
    } catch (error) {
      console.log('Column image already exists in JobVacancies table. Skipping...');
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.removeColumn('JobVacancies', 'image');
    } catch (error) {
      console.log('Column image not found in JobVacancies table. Skipping...');
    }
  }
};
