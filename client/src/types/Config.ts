import { CPU } from './CPU';
import { GPUQuantity } from './GPU';
import { RAM } from './RAM';
import { Storage } from './Storage';
import { Chassis } from './Chassis';

export interface Config {
  cpu: CPU | null;
  gpu: GPUQuantity[];
  ram: RAM | null;
  storage: Storage[];
  chassis: Chassis | null;
  isDualCPU: boolean;
} 