'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    address: DataTypes.TEXT,
    email: DataTypes.STRING,
    password: DataTypes.TEXT,
    role: DataTypes.INTEGER
  }, {});
  user.associate = function(models) {
    // associations can be defined here
    user.hasMany(models.transaction)
  };
  return user;
};