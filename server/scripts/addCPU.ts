import { CPU } from '../models';

async function addCPU(cpuData: {
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
  dualCapable?: boolean;
}) {
  try {
    const cpu = await CPU.create(cpuData);
    console.log('Successfully added CPU:', cpu.get('model'));
    return cpu;
  } catch (error) {
    console.error('Error adding CPU:', error);
    throw error;
  }
}

// Example usage:
/*
addCPU({
  model: "EPYC 9654",
  manufacturer: "AMD",
  tdp: 360,
  cores: 96,
  threads: 192,
  baseSpeed: 2.4,
  boostSpeed: 3.7,
  price: 12000,
  generation: "9004",
  socket: "SP5",
  dualCapable: true
}).then(() => process.exit(0))
  .catch(() => process.exit(1));
*/

export { addCPU }; 