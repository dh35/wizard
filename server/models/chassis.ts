import { Model, DataTypes } from 'sequelize';
import { sequelize } from '.';

export class Chassis extends Model {
  declare id: number;
  declare model: string;
  declare manufacturer: string;
  declare formFactor: string;
  declare driveBays: number;
  declare maxGPUSlots: number;
  declare maxPowerSupply: number;
  declare maxTDP: number;
  declare maxGPULength: number;
  declare price: number;
  declare multiNode: boolean;
  declare compatibleCPUs: string[];
  declare compatibleGPUs: string[];
  declare maxNvmeDrives: number;
  declare maxSffDrives: number;
  declare maxLffDrives: number;
  declare isLtoCompatible: boolean;
}

Chassis.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    manufacturer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    formFactor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    driveBays: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    maxGPUSlots: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    maxPowerSupply: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    maxTDP: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    maxGPULength: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    multiNode: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    compatibleCPUs: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    compatibleGPUs: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    maxNvmeDrives: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    maxSffDrives: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    maxLffDrives: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isLtoCompatible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Chassis',
    tableName: 'Chasses',
  }
); 