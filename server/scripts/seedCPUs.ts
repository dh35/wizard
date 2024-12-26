import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.production in production
if (process.env.NODE_ENV === 'production') {
  const envPath = path.resolve(__dirname, '../../.env.production');
  console.log('Loading environment from:', envPath);
  dotenv.config({ path: envPath });
}

import { sequelize, CPU } from '../models';

const cpuData = [
  // Intel Xeon Broadwell v4
  {
    model: 'Xeon E5-2667 v4',
    manufacturer: 'Intel',
    tdp: 135,
    cores: 8,
    threads: 16,
    baseSpeed: 3.2,
    boostSpeed: 3.6,
    price: 25,
    generation: 'Broadwell',
    socket: 'LGA2011-3',
    dualCapable: true
  },
  {
    model: 'Xeon E5-2680 v4',
    manufacturer: 'Intel',
    tdp: 120,
    cores: 14,
    threads: 28,
    baseSpeed: 2.4,
    boostSpeed: 3.3,
    price: 25,
    generation: 'Broadwell',
    socket: 'LGA2011-3',
    dualCapable: true
  },
  {
    model: 'Xeon E5-2683 v4',
    manufacturer: 'Intel',
    tdp: 120,
    cores: 16,
    threads: 32,
    baseSpeed: 2.1,
    boostSpeed: 3.0,
    price: 25,
    generation: 'Broadwell',
    socket: 'LGA2011-3',
    dualCapable: true
  },
  {
    model: 'Xeon E5-2690 v4',
    manufacturer: 'Intel',
    tdp: 135,
    cores: 14,
    threads: 28,
    baseSpeed: 2.6,
    boostSpeed: 3.5,
    price: 30,
    generation: 'Broadwell',
    socket: 'LGA2011-3',
    dualCapable: true
  },
  {
    model: 'Xeon E5-2699 v4',
    manufacturer: 'Intel',
    tdp: 145,
    cores: 22,
    threads: 44,
    baseSpeed: 2.2,
    boostSpeed: 3.6,
    price: 150,
    generation: 'Broadwell',
    socket: 'LGA2011-3',
    dualCapable: true
  },

  // Intel Xeon Scalable Gen 1
  {
    model: 'Xeon Gold 6146',
    manufacturer: 'Intel',
    tdp: 165,
    cores: 12,
    threads: 24,
    baseSpeed: 3.2,
    boostSpeed: 4.2,
    price: 250,
    generation: 'Skylake',
    socket: 'LGA3647',
    dualCapable: true
  },
  {
    model: 'Xeon Gold 6152',
    manufacturer: 'Intel',
    tdp: 140,
    cores: 22,
    threads: 44,
    baseSpeed: 2.1,
    boostSpeed: 3.7,
    price: 150,
    generation: 'Skylake',
    socket: 'LGA3647',
    dualCapable: true
  },
  {
    model: 'Xeon Platinum 8160',
    manufacturer: 'Intel',
    tdp: 150,
    cores: 24,
    threads: 48,
    baseSpeed: 2.1,
    boostSpeed: 3.7,
    price: 200,
    generation: 'Skylake',
    socket: 'LGA3647',
    dualCapable: true
  },

  // AMD EPYC Zen2/Rome
  {
    model: 'EPYC 7302',
    manufacturer: 'AMD',
    tdp: 155,
    cores: 16,
    threads: 32,
    baseSpeed: 3.0,
    boostSpeed: 3.3,
    price: 200,
    generation: 'Rome',
    socket: 'SP3',
    dualCapable: true
  },
  {
    model: 'EPYC 7402',
    manufacturer: 'AMD',
    tdp: 180,
    cores: 24,
    threads: 48,
    baseSpeed: 2.8,
    boostSpeed: 3.35,
    price: 300,
    generation: 'Rome',
    socket: 'SP3',
    dualCapable: true
  },
  {
    model: 'EPYC 7702',
    manufacturer: 'AMD',
    tdp: 200,
    cores: 64,
    threads: 128,
    baseSpeed: 2.0,
    boostSpeed: 3.35,
    price: 950,
    generation: 'Rome',
    socket: 'SP3',
    dualCapable: true
  },
  {
    model: 'EPYC 7B12',
    manufacturer: 'AMD',
    tdp: 155,
    cores: 64,
    threads: 128,
    baseSpeed: 2.25,
    boostSpeed: 3.35,
    price: 950,
    generation: 'Rome',
    socket: 'SP3',
    dualCapable: true
  },

  // AMD EPYC Zen3/Milan
  {
    model: 'EPYC 7313',
    manufacturer: 'AMD',
    tdp: 155,
    cores: 16,
    threads: 32,
    baseSpeed: 3.0,
    boostSpeed: 3.7,
    price: 500,
    generation: 'Milan',
    socket: 'SP3',
    dualCapable: true
  },
  {
    model: 'EPYC 7413',
    manufacturer: 'AMD',
    tdp: 180,
    cores: 24,
    threads: 48,
    baseSpeed: 2.65,
    boostSpeed: 3.6,
    price: 700,
    generation: 'Milan',
    socket: 'SP3',
    dualCapable: true
  },
  {
    model: 'EPYC 7713',
    manufacturer: 'AMD',
    tdp: 225,
    cores: 64,
    threads: 128,
    baseSpeed: 2.0,
    boostSpeed: 3.675,
    price: 1200,
    generation: 'Milan',
    socket: 'SP3',
    dualCapable: true
  },
  {
    model: 'EPYC 7B13',
    manufacturer: 'AMD',
    tdp: 225,
    cores: 64,
    threads: 128,
    baseSpeed: 2.45,
    boostSpeed: 3.675,
    price: 1200,
    generation: 'Milan',
    socket: 'SP3',
    dualCapable: true
  }
];

async function seedCPUs() {
  try {
    // Clear existing CPU data
    await CPU.destroy({ where: {} });
    console.log('Existing CPU data cleared.');

    // Insert new data
    await CPU.bulkCreate(cpuData);
    console.log('CPU database seeded successfully!');
  } catch (error) {
    console.error('Error seeding CPU database:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the seeder if this file is executed directly
if (require.main === module) {
  seedCPUs();
}

export default seedCPUs; 