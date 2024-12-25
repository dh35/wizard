import { Sequelize, DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'server_wizard',
  username: 'postgres',
  password: 'em121402EM$$',
  logging: false
});

// CPU Model
interface CPUModel extends Model<InferAttributes<CPUModel>, InferCreationAttributes<CPUModel>> {
  id: CreationOptional<number>;
  model: string;
  manufacturer: string;
  tdp: number;
  cores: number;
  threads: number;
  baseSpeed: number;
  boostSpeed: number;
  price: number;
  generation: string;
  socket: string;
  dualCapable: boolean;
}

const CPU = sequelize.define<CPUModel>('CPU', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  manufacturer: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tdp: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cores: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  threads: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  baseSpeed: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  boostSpeed: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  generation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  socket: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dualCapable: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  }
});

// GPU Model
interface GPUModel extends Model<InferAttributes<GPUModel>, InferCreationAttributes<GPUModel>> {
  id: CreationOptional<number>;
  model: string;
  manufacturer: string;
  tdp: number;
  vram: number;
  length: number;
  price: number;
  formFactor: string;
  supplementaryPower: boolean;
}

const GPU = sequelize.define<GPUModel>('GPU', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  manufacturer: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tdp: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  vram: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  length: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  formFactor: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  supplementaryPower: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
});

// Chassis Model
interface ChassisModel extends Model<InferAttributes<ChassisModel>, InferCreationAttributes<ChassisModel>> {
  id: CreationOptional<number>;
  model: string;
  manufacturer: string;
  formFactor: string;
  driveBays: number;
  maxGPUSlots: number;
  maxPowerSupply: number;
  maxTDP: number;
  maxGPULength: number;
  price: number;
  multiNode: boolean;
  compatibleCPUs: string[];
  compatibleGPUs: string[];
  maxNvmeDrives: number;
  maxSffDrives: number;
  maxLffDrives: number;
  isLtoCompatible: boolean;
}

const Chassis = sequelize.define('Chassis', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  manufacturer: {
    type: DataTypes.STRING,
    allowNull: false
  },
  formFactor: {
    type: DataTypes.STRING,
    allowNull: false
  },
  driveBays: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  maxGPUSlots: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  maxPowerSupply: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  maxTDP: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1000
  },
  maxGPULength: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 300
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  multiNode: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  compatibleCPUs: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    defaultValue: []
  },
  compatibleGPUs: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    defaultValue: []
  },
  maxNvmeDrives: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  maxSffDrives: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  maxLffDrives: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  isLtoCompatible: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
});

// RAM Model
interface RAMModel extends Model<InferAttributes<RAMModel>, InferCreationAttributes<RAMModel>> {
  id: CreationOptional<number>;
  type: string;
  capacity: number;
  speed: number;
  price: number;
  generation: string;
  ecc: boolean;
  compatibleWith: string[];
}

const RAM = sequelize.define<RAMModel>('RAM', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  speed: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  generation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ecc: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  compatibleWith: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  }
});

// Storage Model
interface StorageModel extends Model<InferAttributes<StorageModel>, InferCreationAttributes<StorageModel>> {
  id: CreationOptional<number>;
  model: string;
  type: string;
  formFactor: string;
  capacity: number;
  interface: string;
  price: number;
  readSpeed: number;
  writeSpeed: number;
  rpm?: number;
}

const Storage = sequelize.define<StorageModel>('Storage', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  formFactor: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  interface: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  readSpeed: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  writeSpeed: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rpm: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
});

export { sequelize, CPU, GPU, Chassis, RAM, Storage, CPUModel, GPUModel, ChassisModel, RAMModel, StorageModel }; 