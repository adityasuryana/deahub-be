'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Engineering extends Model {
    static associate(models) {
      // define association here
    }
  }
  Engineering.init({
    startProject: DataTypes.STRING,
    customer: DataTypes.STRING,
    woNumber: DataTypes.STRING,
    projectName: DataTypes.STRING,
    item: DataTypes.STRING,
    qty: DataTypes.STRING,
    uom: {
      type: DataTypes.STRING,
      defaultValue: 'UNIT'
    },
    stages: DataTypes.JSON,
    targetFinish: DataTypes.STRING,
    finishDate: DataTypes.STRING,
    pic: DataTypes.STRING,
    priority: {
      type: DataTypes.STRING,
      defaultValue: '2 (MEDIUM / NORMAL)'
    },
    remarks: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Engineering',
    tableName: 'Engineerings'
  });
  return Engineering;
};
