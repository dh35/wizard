import { GPU } from '../models';

async function addGPU(gpuData: {
  model: string;
  manufacturer: string;
  tdp: number;
  vram: number;
  length: number;
  price: number;
  formFactor: string;
  supplementaryPower?: boolean;
}) {
  try {
    const gpu = await GPU.create(gpuData);
    console.log('Successfully added GPU:', gpu.get('model'));
    return gpu;
  } catch (error) {
    console.error('Error adding GPU:', error);
    throw error;
  }
}

// Example usage:
/*
addGPU({
  model: "A100",
  manufacturer: "NVIDIA",
  tdp: 400,
  vram: 80,
  length: 267,
  price: 10000,
  formFactor: "PCIe",
  supplementaryPower: true
}).then(() => process.exit(0))
  .catch(() => process.exit(1));
*/

export { addGPU }; 