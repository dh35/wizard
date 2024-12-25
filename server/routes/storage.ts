import express from 'express';
import { Storage } from '../models';
import { Op } from 'sequelize';

const router = express.Router();

// Get all storage options with optional filtering
router.get('/', async (req, res) => {
  try {
    const { type, formFactor, minCapacity, interface: interfaceType } = req.query;
    
    const filters: any = {};
    
    // Filter by type (SSD, NVMe, HDD)
    if (type) {
      filters.type = type;
    }

    // Filter by form factor (SFF, LFF)
    if (formFactor) {
      filters.formFactor = formFactor;
    }

    // Filter by interface (SATA, U.2)
    if (interfaceType) {
      filters.interface = interfaceType;
    }

    // Filter by minimum capacity
    if (minCapacity) {
      filters.capacity = {
        [Op.gte]: parseInt(minCapacity as string)
      };
    }

    console.log('Received query params:', req.query);
    console.log('Applied filters:', filters);

    const storage = await Storage.findAll({
      where: filters,
      order: [
        ['type', 'ASC'],
        ['capacity', 'ASC']
      ]
    });

    console.log('Found storage options:', storage.length);
    res.json(storage);
  } catch (error) {
    console.error('Error fetching storage options:', error);
    res.status(500).json({ error: 'Failed to fetch storage options' });
  }
});

export default router; 