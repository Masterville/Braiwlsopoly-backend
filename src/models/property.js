'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Property extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {
      this.belongsTo(models.Player, {
        foreignKey: 'idPlayer'
      });
      this.belongsTo(models.Board, {
        foreignKey: 'idBoard'
      });
    }
  }
  Property.init({
    nombre: DataTypes.STRING,
    precio: DataTypes.INTEGER,
    baseAlquiler: DataTypes.INTEGER,
    nivelEstructura: DataTypes.INTEGER,
    color: DataTypes.STRING,
    hipotecado: DataTypes.BOOLEAN,
    posicionBoard: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Property',
  });
  return Property;
};