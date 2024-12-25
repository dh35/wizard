import express from 'express';
import { CPU } from '../models';
import { Op } from 'sequelize';

const router = express.Router();

// Get all CPUs with optional filters
router.get('/', async (req, res) => {
  try {
    const {
      manufacturer,
      minCores,
      maxTDP,
      minThreads,
      maxPrice
    } = req.query;

    console.log('Received query params:', req.query);

    const filters: any = {};

    if (manufacturer) {
      filters.manufacturer = manufacturer;
    }
    if (minCores) {
      filters.cores = { [Op.gte]: parseInt(minCores as string) };
    }
    if (maxTDP) {
      filters.tdp = { [Op.lte]: parseInt(maxTDP as string) };
    }
    if (minThreads) {
      filters.threads = { [Op.gte]: parseInt(minThreads as string) };
    }
    if (maxPrice) {
      filters.price = { [Op.lte]: parseFloat(maxPrice as string) };
    }

    console.log('Applied filters:', filters);

    const cpus = await CPU.findAll({
      where: filters,
      order: [['price', 'ASC']]
    });

    console.log('Found CPUs:', cpus.length);

    res.json(cpus);
  } catch (error) {
    console.error('Error fetching CPUs:', error);
    res.status(500).json({ error: 'Failed to fetch CPUs' });
  }
});

// Get a specific CPU by ID
router.get('/:id', async (req, res) => {
  try {
    const cpu = await CPU.findByPk(req.params.id);
    if (!cpu) {
      return res.status(404).json({ error: 'CPU not found' });
    }
    res.json(cpu);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch CPU' });
  }
});

// Create a new CPU
router.post('/', async (req, res) => {
  try {
    const cpu = await CPU.create(req.body);
    res.status(201).json(cpu);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create CPU' });
  }
});

// Update a CPU
router.put('/:id', async (req, res) => {
  try {
    const cpu = await CPU.findByPk(req.params.id);
    if (!cpu) {
      return res.status(404).json({ error: 'CPU not found' });
    }
    await cpu.update(req.body);
    res.json(cpu);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update CPU' });
  }
});

// Delete a CPU
router.delete('/:id', async (req, res) => {
  try {
    const cpu = await CPU.findByPk(req.params.id);
    if (!cpu) {
      return res.status(404).json({ error: 'CPU not found' });
    }
    await cpu.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete CPU' });
  }
});

export default router; 