import { sequelize, GPU } from '../models';

const gpuData = [
  {
    model: 'Tesla P4',
    manufacturer: 'NVIDIA',
    tdp: 75,
    vram: 8,
    length: 168,
    price: 150,
    formFactor: 'Full Height',
    supplementaryPower: false
  },
  {
    model: 'RTX A4000',
    manufacturer: 'NVIDIA',
    tdp: 140,
    vram: 16,
    length: 241,
    price: 500,
    formFactor: 'Full Height',
    supplementaryPower: true
  },
  {
    model: 'RTX 3090',
    manufacturer: 'NVIDIA',
    tdp: 350,
    vram: 24,
    length: 313,
    price: 900,
    formFactor: 'Full Height',
    supplementaryPower: true
  }
];

async function seedGPUs() {
  try {
    // Clear existing GPU data
    await GPU.destroy({ where: {} });
    console.log('Existing GPU data cleared.');

    // Insert new data
    await GPU.bulkCreate(gpuData);
    console.log('GPU database seeded successfully!');
  } catch (error) {
    console.error('Error seeding GPU database:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the seeder if this file is executed directly
if (require.main === module) {
  seedGPUs();
}

export default seedGPUs; 