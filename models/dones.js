'use strict';
module.exports = function(sequelize, DataTypes) {
  var dones = sequelize.define('dones', {
    item: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return dones;
};