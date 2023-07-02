'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Game extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  }
  Game.init({
    turno: DataTypes.INTEGER,
    gameFinalizado: DataTypes.BOOLEAN,
    gameComenzado: DataTypes.BOOLEAN,
    creadoPor: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Game',
  });
  return Game;
};