'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Properties', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING
      },
      precio: {
        type: Sequelize.INTEGER
      },
      baseAlquiler: {
        type: Sequelize.INTEGER
      },
      nivelEstructura: {
        type: Sequelize.INTEGER
      },
      color: {
        type: Sequelize.STRING
      },
      hipotecado: {
        type: Sequelize.BOOLEAN
      },
      posicionBoard: {
        type: Sequelize.INTEGER
      },
      idPlayer: {
        type: Sequelize.INTEGER,
        references: { model: 'Players', key: 'id' },
      },
      idBoard: {
        type: Sequelize.INTEGER,
        references: { model: 'Boards', key: 'id' },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Properties');
  }
};