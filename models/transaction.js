'use strict';
module.exports = (sequelize, DataTypes) => {
  const transaction = sequelize.define('transaction', {
    order_id: DataTypes.INTEGER,
    gross_amount: DataTypes.STRING,
    transaction_status: DataTypes.STRING,
    province: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});
  transaction.associate = function(models) {
    // associations can be defined here
  };
  return transaction;
};