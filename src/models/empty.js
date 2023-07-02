'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Empty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Board, {
        foreignKey: 'idBoard'
      });
    }
  }
  Empty.init({
    nombre: DataTypes.STRING,
    posicionBoard: DataTypes.INTEGER,
    idBoard: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Empty',
  });
  return Empty;
};