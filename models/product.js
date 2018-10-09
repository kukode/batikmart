'use strict';
module.exports = (sequelize, DataTypes) => {
  const product = sequelize.define('product', {
    name: DataTypes.STRING,
    size: DataTypes.STRING,
    color: DataTypes.STRING,
    material: DataTypes.STRING,
    weight: DataTypes.STRING,
    description: DataTypes.STRING,
    flPhoto: DataTypes.STRING,
    stok: DataTypes.INTEGER,
    tag: DataTypes.STRING,
    price: DataTypes.STRING,
    discount: DataTypes.STRING,
    categoryName: DataTypes.STRING
  }, {});
  product.associate = function(models) {
    // associations can be defined here
    
  };
  return product;
};