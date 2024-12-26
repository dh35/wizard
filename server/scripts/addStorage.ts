import { Storage } from '../models';

async function addStorage(storageData: {
  model: string;
  type: string;
  formFactor: string;
  capacity: number;
  interface: string;
  price: number;
  readSpeed: number;
  writeSpeed: number;
  rpm?: number;
}) {
  try {
    const storage = await Storage.create(storageData);
    console.log('Successfully added storage:', `${storage.get('model')} ${storage.get('capacity')}GB ${storage.get('type')}`);
    return storage;
  } catch (error) {
    console.error('Error adding storage:', error);
    throw error;
  }
}

// Example usage:
/*
addStorage({
  model: "PM9A3",
  type: "NVMe SSD",
  formFactor: "M.2",
  capacity: 1920,
  interface: "PCIe 4.0 x4",
  price: 200,
  readSpeed: 7000,
  writeSpeed: 5200
}).then(() => process.exit(0))
  .catch(() => process.exit(1));

// For HDDs:
addStorage({
  model: "Ultrastar DC HC550",
  type: "HDD",
  formFactor: "3.5\"",
  capacity: 18000,
  interface: "SATA",
  price: 350,
  readSpeed: 270,
  writeSpeed: 270,
  rpm: 7200
}).then(() => process.exit(0))
  .catch(() => process.exit(1));
*/

export { addStorage }; 