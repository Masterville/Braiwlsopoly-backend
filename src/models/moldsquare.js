'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MoldSquare extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MoldSquare.init({
    nombre: DataTypes.STRING,
    precio: DataTypes.INTEGER,
    baseAlquiler: DataTypes.INTEGER,
    color: DataTypes.STRING,
    tipo: DataTypes.STRING,
    posicionBoard: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'MoldSquare',
  });
  return MoldSquare;
};