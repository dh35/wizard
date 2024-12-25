export interface Chassis {
  id: number;
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
  createdAt?: Date;
  updatedAt?: Date;
} 