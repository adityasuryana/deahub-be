'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn('JobVacancies', 'createdBy', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      });
    } catch (error) {
      console.log('Column createdBy already exists in JobVacancies table. Skipping...');
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.removeColumn('JobVacancies', 'createdBy');
    } catch (error) {
      console.log('Column createdBy not found in JobVacancies table. Skipping...');
    }
  }
};
