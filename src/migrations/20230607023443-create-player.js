'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Players', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING
      },
      dinero: {
        type: Sequelize.INTEGER
      },
      bancarrota: {
        type: Sequelize.BOOLEAN
      },
      squareActual: {
        type: Sequelize.INTEGER
      },
      numTurno: {
        type: Sequelize.INTEGER,
      },
      isMovBoard: {
        type: Sequelize.BOOLEAN
      },
      seccionActual: {
        type: Sequelize.STRING
      },
      idGame: {
        type: Sequelize.INTEGER,
        references: { model: 'Games', key: 'id' },
      },
      idUser: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
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
    await queryInterface.dropTable('Players');
  }
};