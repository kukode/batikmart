'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      size: {
        type: Sequelize.STRING
      },
      color: {
        type: Sequelize.STRING
      },
      material: {
        type: Sequelize.STRING
      },
      weight: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      flPhoto: {
        type: Sequelize.STRING
      },
      stok: {
        type: Sequelize.INTEGER
      },
      tag: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.STRING
      },
      discount: {
        type: Sequelize.STRING
      },
      categoryId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('products');
  }
};