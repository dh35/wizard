import { Chassis } from '../models';

async function addChassis(chassisData: {
  model: string;
  manufacturer: string;
  formFactor: string;
  driveBays: number;
  maxGPUSlots: number;
  maxPowerSupply: number;
  maxTDP: number;
  maxGPULength: number;
  price: number;
  multiNode?: boolean;
  compatibleCPUs?: string[];
  compatibleGPUs?: string[];
  maxNvmeDrives?: number;
  maxSffDrives?: number;
  maxLffDrives?: number;
  isLtoCompatible?: boolean;
}) {
  try {
    const chassis = await Chassis.create(chassisData);
    console.log('Successfully added chassis:', chassis.get('model'));
    return chassis;
  } catch (error) {
    console.error('Error adding chassis:', error);
    throw error;
  }
}

// Example usage (uncomment and modify to add a chassis):
/*
addChassis({
  model: "R6625",
  manufacturer: "Dell",
  formFactor: "2U",
  driveBays: 12,
  maxGPUSlots: 2,
  maxPowerSupply: 2400,
  maxTDP: 400,
  maxGPULength: 300,
  price: 2500,
  multiNode: true,
  compatibleCPUs: ["AMD EPYC 9004"],
  compatibleGPUs: ["NVIDIA A100", "NVIDIA L40"],
  maxNvmeDrives: 12,
  maxSffDrives: 0,
  maxLffDrives: 0,
  isLtoCompatible: false
}).then(() => process.exit(0))
  .catch(() => process.exit(1));
*/

// Export for use in other scripts if needed
export { addChassis }; 