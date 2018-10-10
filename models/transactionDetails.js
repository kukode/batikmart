'use strict';
module.exports = (sequelize, DataTypes) => {
  const transactionDetails = sequelize.define('transactionDetails', {
    // transId: DataTypes.INTEGER,
    price: DataTypes.STRING,
    quantity: DataTypes.STRING,
    name: DataTypes.STRING
  }, {});
  transactionDetails.associate = function(models) {
    // associations can be defined here
  };
  return transactionDetails;
};