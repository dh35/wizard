import { RAM } from '../models';

async function addRAM(ramData: {
  type: string;
  capacity: number;
  speed: number;
  price: number;
  generation: string;
  ecc?: boolean;
  compatibleWith: string[];
}) {
  try {
    const ram = await RAM.create(ramData);
    console.log('Successfully added RAM:', `${ram.get('capacity')}GB ${ram.get('type')} ${ram.get('speed')}MHz`);
    return ram;
  } catch (error) {
    console.error('Error adding RAM:', error);
    throw error;
  }
}

// Example usage:
/*
addRAM({
  type: "DDR5",
  capacity: 32,
  speed: 4800,
  price: 150,
  generation: "ECC Registered",
  ecc: true,
  compatibleWith: ["AMD EPYC 9004", "Intel Xeon 4th Gen"]
}).then(() => process.exit(0))
  .catch(() => process.exit(1));
*/

export { addRAM }; 