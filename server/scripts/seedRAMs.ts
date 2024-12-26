import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.production in production
if (process.env.NODE_ENV === 'production') {
  const envPath = path.resolve(__dirname, '../../.env.production');
  console.log('Loading environment from:', envPath);
  dotenv.config({ path: envPath });
}

import { sequelize, RAM } from '../models';

const ramData = [
  // DDR4 ECC for Intel Xeon Broadwell (v4)
  {
    type: 'DDR4 ECC',
    capacity: 32,  // GB
    speed: 2133,   // MHz
    price: 40,
    generation: 'DDR4',
    ecc: true,
    compatibleWith: ['Broadwell', 'Skylake']
  },
  {
    type: 'DDR4 ECC',
    capacity: 64,
    speed: 2133,
    price: 80,
    generation: 'DDR4',
    ecc: true,
    compatibleWith: ['Broadwell', 'Skylake']
  },
  {
    type: 'DDR4 ECC',
    capacity: 128,
    speed: 2133,
    price: 160,
    generation: 'DDR4',
    ecc: true,
    compatibleWith: ['Broadwell', 'Skylake']
  },
  {
    type: 'DDR4 ECC',
    capacity: 256,
    speed: 2133,
    price: 320,
    generation: 'DDR4',
    ecc: true,
    compatibleWith: ['Broadwell', 'Skylake']
  },
  {
    type: 'DDR4 ECC',
    capacity: 512,
    speed: 2133,
    price: 800,
    generation: 'DDR4',
    ecc: true,
    compatibleWith: ['Broadwell', 'Skylake']
  },
  {
    type: 'DDR4 ECC',
    capacity: 768,
    speed: 2133,
    price: 1200,
    generation: 'DDR4',
    ecc: true,
    compatibleWith: ['Broadwell', 'Skylake']
  },
  {
    type: 'DDR4 ECC',
    capacity: 1024,
    speed: 2133,
    price: 1600,
    generation: 'DDR4',
    ecc: true,
    compatibleWith: ['Broadwell', 'Skylake']
  },

  // DDR4 ECC for AMD EPYC Rome/Milan
  {
    type: 'DDR4 ECC',
    capacity: 32,
    speed: 2666,
    price: 45,
    generation: 'DDR4',
    ecc: true,
    compatibleWith: ['Rome', 'Milan']
  },
  {
    type: 'DDR4 ECC',
    capacity: 64,
    speed: 2666,
    price: 90,
    generation: 'DDR4',
    ecc: true,
    compatibleWith: ['Rome', 'Milan']
  },
  {
    type: 'DDR4 ECC',
    capacity: 128,
    speed: 2666,
    price: 180,
    generation: 'DDR4',
    ecc: true,
    compatibleWith: ['Rome', 'Milan']
  },
  {
    type: 'DDR4 ECC',
    capacity: 256,
    speed: 2666,
    price: 360,
    generation: 'DDR4',
    ecc: true,
    compatibleWith: ['Rome', 'Milan']
  },
  {
    type: 'DDR4 ECC',
    capacity: 512,
    speed: 2666,
    price: 800,
    generation: 'DDR4',
    ecc: true,
    compatibleWith: ['Rome', 'Milan']
  },
  {
    type: 'DDR4 ECC',
    capacity: 768,
    speed: 2666,
    price: 1200,
    generation: 'DDR4',
    ecc: true,
    compatibleWith: ['Rome', 'Milan']
  },
  {
    type: 'DDR4 ECC',
    capacity: 1024,
    speed: 2666,
    price: 1600,
    generation: 'DDR4',
    ecc: true,
    compatibleWith: ['Rome', 'Milan']
  }
];

async function seedRAMs() {
  try {
    // Clear existing RAM data
    await RAM.destroy({ where: {} });
    console.log('Existing RAM data cleared.');

    // Insert new data
    await RAM.bulkCreate(ramData);
    console.log('RAM database seeded successfully!');
  } catch (error) {
    console.error('Error seeding RAM database:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the seeder if this file is executed directly
if (require.main === module) {
  seedRAMs();
}

export default seedRAMs; 