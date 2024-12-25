import express from 'express';
import { Chassis } from '../models';
import { Op } from 'sequelize';

const router = express.Router();

// Get all chassis with optional filters
router.get('/', async (req, res) => {
  try {
    const {
      manufacturer,
      formFactor,
      minTDP,
      minGPULength,
      minDriveBays,
      maxPrice
    } = req.query;

    console.log('Received chassis request with query:', req.query);

    const filters: any = {};

    if (manufacturer) {
      filters.manufacturer = manufacturer;
    }
    if (formFactor) {
      filters.formFactor = formFactor;
    }
    if (minTDP) {
      filters.maxTDP = { [Op.gte]: parseInt(minTDP as string) };
    }
    if (minGPULength) {
      filters.maxGPULength = { [Op.gte]: parseInt(minGPULength as string) };
    }
    if (minDriveBays) {
      filters.driveBays = { [Op.gte]: parseInt(minDriveBays as string) };
    }
    if (maxPrice) {
      filters.price = { [Op.lte]: parseFloat(maxPrice as string) };
    }

    console.log('Applied filters:', filters);

    const chassis = await Chassis.findAll({
      where: filters,
      order: [['price', 'ASC']]
    });

    console.log('Found chassis:', chassis.length);
    console.log('First chassis:', chassis[0]);

    res.json(chassis);
  } catch (error) {
    console.error('Error fetching chassis:', error);
    res.status(500).json({ error: 'Failed to fetch chassis' });
  }
});

// Get a specific chassis by ID
router.get('/:id', async (req, res) => {
  try {
    const chassis = await Chassis.findByPk(req.params.id);
    if (!chassis) {
      return res.status(404).json({ error: 'Chassis not found' });
    }
    res.json(chassis);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chassis' });
  }
});

// Create a new chassis
router.post('/', async (req, res) => {
  try {
    const chassis = await Chassis.create(req.body);
    res.status(201).json(chassis);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create chassis' });
  }
});

// Update a chassis
router.put('/:id', async (req, res) => {
  try {
    const chassis = await Chassis.findByPk(req.params.id);
    if (!chassis) {
      return res.status(404).json({ error: 'Chassis not found' });
    }
    await chassis.update(req.body);
    res.json(chassis);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update chassis' });
  }
});

// Delete a chassis
router.delete('/:id', async (req, res) => {
  try {
    const chassis = await Chassis.findByPk(req.params.id);
    if (!chassis) {
      return res.status(404).json({ error: 'Chassis not found' });
    }
    await chassis.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete chassis' });
  }
});

export default router; 