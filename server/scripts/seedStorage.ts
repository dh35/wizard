import { sequelize, Storage } from '../models';

const storageData = [
  // SSDs (2.5" SFF)
  {
    model: 'Enterprise SSD',
    type: 'SSD',
    formFactor: 'SFF',
    capacity: 480,
    interface: 'SATA',
    price: 30,
    readSpeed: 550,
    writeSpeed: 520
  },
  {
    model: 'Enterprise SSD',
    type: 'SSD',
    formFactor: 'SFF',
    capacity: 960,
    interface: 'SATA',
    price: 60,
    readSpeed: 550,
    writeSpeed: 520
  },
  {
    model: 'Enterprise SSD',
    type: 'SSD',
    formFactor: 'SFF',
    capacity: 1920,
    interface: 'SATA',
    price: 120,
    readSpeed: 550,
    writeSpeed: 520
  },
  {
    model: 'Enterprise SSD',
    type: 'SSD',
    formFactor: 'SFF',
    capacity: 3840,
    interface: 'SATA',
    price: 240,
    readSpeed: 550,
    writeSpeed: 520
  },

  // NVMe U.2 (2.5" SFF)
  {
    model: 'Enterprise NVMe U.2',
    type: 'NVMe',
    formFactor: 'SFF',
    capacity: 960,
    interface: 'U.2',
    price: 60,
    readSpeed: 3200,
    writeSpeed: 2000
  },
  {
    model: 'Enterprise NVMe U.2',
    type: 'NVMe',
    formFactor: 'SFF',
    capacity: 1920,
    interface: 'U.2',
    price: 120,
    readSpeed: 3200,
    writeSpeed: 2000
  },
  {
    model: 'Enterprise NVMe U.2',
    type: 'NVMe',
    formFactor: 'SFF',
    capacity: 3840,
    interface: 'U.2',
    price: 240,
    readSpeed: 3200,
    writeSpeed: 2000
  },

  // SFF HDD (2.5")
  {
    model: 'Enterprise SFF HDD',
    type: 'HDD',
    formFactor: 'SFF',
    capacity: 5000,
    interface: 'SATA',
    price: 100,
    readSpeed: 180,
    writeSpeed: 180,
    rpm: 5400
  },

  // LFF HDDs (3.5")
  {
    model: 'Enterprise LFF HDD',
    type: 'HDD',
    formFactor: 'LFF',
    capacity: 12000,
    interface: 'SATA',
    price: 90,
    readSpeed: 180,
    writeSpeed: 180,
    rpm: 7200
  },
  {
    model: 'Enterprise LFF HDD',
    type: 'HDD',
    formFactor: 'LFF',
    capacity: 14000,
    interface: 'SATA',
    price: 105,
    readSpeed: 180,
    writeSpeed: 180,
    rpm: 7200
  }
];

async function seedStorage() {
  try {
    // Clear existing storage data
    await Storage.destroy({ where: {} });
    console.log('Existing storage data cleared.');

    // Insert new data
    await Storage.bulkCreate(storageData);
    console.log('Storage database seeded successfully!');
  } catch (error) {
    console.error('Error seeding storage database:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the seeder if this file is executed directly
if (require.main === module) {
  seedStorage();
}

export default seedStorage; 