export interface CPU {
  id: number;
  model: string;
  manufacturer: string;
  cores: number;
  threads: number;
  baseSpeed: number;
  boostSpeed: number;
  tdp: number;
  price: number;
  generation: string;
  socket: string;
  dualCapable: boolean;
} 