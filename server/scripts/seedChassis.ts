import { Chassis } from '../models/chassis';

export async function seedChassis() {
  console.log('Starting chassis seeding...');
  await Chassis.destroy({ where: {} }); // Clear existing data
  console.log('Cleared existing chassis data');

  const chassisData = [
    {
      model: 'Quanta QuantaGrid D51PC-1U',
      manufacturer: 'Quanta',
      formFactor: '1U',
      driveBays: 4,
      maxNvmeDrives: 0,
      maxSffDrives: 0,
      maxLffDrives: 4,
      maxGPUSlots: 0,
      maxPowerSupply: 750,
      maxTDP: 1000,
      maxGPULength: 300,
      price: 300,
      multiNode: false,
      compatibleCPUs: ['Xeon E5'],
      compatibleGPUs: [],
      isLtoCompatible: true
    },
    {
      model: 'Quanta QuantaGrid D51B-1U',
      manufacturer: 'Quanta',
      formFactor: '1U',
      driveBays: 10,
      maxNvmeDrives: 0,
      maxSffDrives: 10,
      maxLffDrives: 0,
      maxGPUSlots: 0,
      maxPowerSupply: 750,
      maxTDP: 1000,
      maxGPULength: 300,
      price: 300,
      multiNode: false,
      compatibleCPUs: ['Xeon E5'],
      compatibleGPUs: [],
      isLtoCompatible: true
    },
    {
      model: 'Quanta QuantaGrid D51PH-1ULH',
      manufacturer: 'Quanta',
      formFactor: '1U',
      driveBays: 16,
      maxNvmeDrives: 0,
      maxSffDrives: 4,
      maxLffDrives: 12,
      maxGPUSlots: 0,
      maxPowerSupply: 1200,
      maxTDP: 1000,
      maxGPULength: 300,
      price: 400,
      multiNode: false,
      compatibleCPUs: ['Xeon E5'],
      compatibleGPUs: [],
      isLtoCompatible: true
    },
    {
      model: 'Supermicro SuperServer 1028U-TRT+',
      manufacturer: 'Supermicro',
      formFactor: '1U',
      driveBays: 10,
      maxNvmeDrives: 0,
      maxSffDrives: 10,
      maxLffDrives: 0,
      maxGPUSlots: 1,
      maxPowerSupply: 1000,
      maxTDP: 1000,
      maxGPULength: 300,
      price: 300,
      multiNode: false,
      compatibleCPUs: ['Xeon E5'],
      compatibleGPUs: ['Tesla P4'],
      isLtoCompatible: true
    },
    {
      model: 'Supermicro SYS-1028GR-TR',
      manufacturer: 'Supermicro',
      formFactor: '1U',
      driveBays: 4,
      maxNvmeDrives: 0,
      maxSffDrives: 4,
      maxLffDrives: 0,
      maxGPUSlots: 3,
      maxPowerSupply: 2000,
      maxTDP: 1000,
      maxGPULength: 300,
      price: 300,
      multiNode: false,
      compatibleCPUs: ['Xeon E5'],
      compatibleGPUs: ['Tesla P4', 'RTX A4000'],
      isLtoCompatible: true
    },
    {
      model: 'Supermicro CSE-826BE1C-R920LPB',
      manufacturer: 'Supermicro',
      formFactor: '2U',
      driveBays: 12,
      maxNvmeDrives: 0,
      maxSffDrives: 0,
      maxLffDrives: 12,
      maxGPUSlots: 1,
      maxPowerSupply: 920,
      maxTDP: 1000,
      maxGPULength: 300,
      price: 400,
      multiNode: false,
      compatibleCPUs: ['Xeon Gold', 'EPYC 7002', 'EPYC 7003'],
      compatibleGPUs: ['Tesla P4'],
      isLtoCompatible: true
    },
    {
      model: 'Supermicro CSE-847BE1C-R1K28LPB',
      manufacturer: 'Supermicro',
      formFactor: '4U',
      driveBays: 38,
      maxNvmeDrives: 0,
      maxSffDrives: 2,
      maxLffDrives: 36,
      maxGPUSlots: 1,
      maxPowerSupply: 1280,
      maxTDP: 1000,
      maxGPULength: 300,
      price: 500,
      multiNode: false,
      compatibleCPUs: ['Xeon Gold', 'EPYC 7002', 'EPYC 7003'],
      compatibleGPUs: ['Tesla P4'],
      isLtoCompatible: true
    },
    {
      model: 'Supermicro CSE-815',
      manufacturer: 'Supermicro',
      formFactor: '1U',
      driveBays: 4,
      maxNvmeDrives: 0,
      maxSffDrives: 0,
      maxLffDrives: 4,
      maxGPUSlots: 0,
      maxPowerSupply: 500,
      maxTDP: 1000,
      maxGPULength: 300,
      price: 200,
      multiNode: false,
      compatibleCPUs: ['Xeon Gold', 'EPYC 7002', 'EPYC 7003'],
      compatibleGPUs: [],
      isLtoCompatible: true
    },
    {
      model: 'Dell C6400 Quad Node',
      manufacturer: 'Dell',
      formFactor: '2U',
      driveBays: 6,
      maxNvmeDrives: 2,
      maxSffDrives: 4,
      maxLffDrives: 0,
      maxGPUSlots: 0,
      maxPowerSupply: 1600,
      maxTDP: 1000,
      maxGPULength: 300,
      price: 400,
      multiNode: true,
      compatibleCPUs: ['Xeon Gold'],
      compatibleGPUs: [],
      isLtoCompatible: false
    },
    {
      model: 'Dell C6525 Quad Node',
      manufacturer: 'Dell',
      formFactor: '2U',
      driveBays: 6,
      maxNvmeDrives: 2,
      maxSffDrives: 4,
      maxLffDrives: 0,
      maxGPUSlots: 0,
      maxPowerSupply: 2000,
      maxTDP: 1000,
      maxGPULength: 300,
      price: 600,
      multiNode: true,
      compatibleCPUs: ['EPYC 7002', 'EPYC 7003'],
      compatibleGPUs: [],
      isLtoCompatible: false
    },
    {
      model: 'ESC4000 G3',
      manufacturer: 'ASUS',
      formFactor: '2U',
      driveBays: 8,
      maxNvmeDrives: 0,
      maxSffDrives: 0,
      maxLffDrives: 8,
      maxGPUSlots: 8,
      maxPowerSupply: 1620,
      maxTDP: 145,
      maxGPULength: 300,
      price: 500,
      multiNode: false,
      compatibleCPUs: ['Xeon E5'],
      compatibleGPUs: ['Tesla P4', 'RTX A4000'],
      isLtoCompatible: true
    },
    {
      model: 'X412 4U GPU',
      manufacturer: 'ZhenLoong',
      formFactor: '4U',
      driveBays: 20,
      maxNvmeDrives: 8,
      maxSffDrives: 0,
      maxLffDrives: 12,
      maxGPUSlots: 10,
      maxPowerSupply: 2000,
      maxTDP: 280,
      maxGPULength: 400,
      price: 800,
      multiNode: false,
      compatibleCPUs: ['EPYC 7002', 'EPYC 7003', 'Xeon Gold'],
      compatibleGPUs: ['RTX A4000', 'RTX 3090'],
      isLtoCompatible: true
    }
  ];

  // Validate drive bay counts
  chassisData.forEach(chassis => {
    const totalDrives = chassis.maxNvmeDrives + chassis.maxSffDrives + chassis.maxLffDrives;
    if (totalDrives !== chassis.driveBays) {
      console.warn(`Warning: Chassis ${chassis.model} has mismatched drive bay counts:
        Total bays: ${chassis.driveBays}
        Sum of drive types: ${totalDrives} (NVMe: ${chassis.maxNvmeDrives}, SFF: ${chassis.maxSffDrives}, LFF: ${chassis.maxLffDrives})`);
    }
  });

  console.log('Seeding chassis data:', JSON.stringify(chassisData, null, 2));
  await Chassis.bulkCreate(chassisData);
  console.log('Chassis seeding completed');
}

// Call the function if this script is run directly
if (require.main === module) {
  seedChassis().catch(console.error);
} 