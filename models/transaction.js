'use strict';
module.exports = (sequelize, DataTypes) => {
  const transaction = sequelize.define('transaction', {
    order_id: DataTypes.STRING,
    gross_amount: DataTypes.STRING,
    token: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    transaction_status: DataTypes.STRING
  }, {underscored: true});
  transaction.associate = function(models) {
    // associations can be defined here
    transaction.belongsTo(models.user)
  };
  return transaction;
};