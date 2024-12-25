'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Chasses', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      model: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      manufacturer: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      formFactor: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      driveBays: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      maxGPUSlots: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      maxPowerSupply: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      maxTDP: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      maxGPULength: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      multiNode: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      compatibleCPUs: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
      },
      compatibleGPUs: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
      },
      maxNvmeDrives: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      maxSffDrives: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      maxLffDrives: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      isLtoCompatible: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Chasses');
  }
}; 