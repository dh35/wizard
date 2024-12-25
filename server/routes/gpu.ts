import express from 'express';
import { GPU } from '../models';
import { Op } from 'sequelize';

const router = express.Router();

// Get all GPUs with optional filters
router.get('/', async (req, res) => {
  try {
    const {
      manufacturer,
      minVram,
      maxTDP,
      maxLength,
      maxPrice
    } = req.query;

    const filters: any = {};

    if (manufacturer) {
      filters.manufacturer = manufacturer;
    }
    if (minVram) {
      filters.vram = { [Op.gte]: parseInt(minVram as string) };
    }
    if (maxTDP) {
      filters.tdp = { [Op.lte]: parseInt(maxTDP as string) };
    }
    if (maxLength) {
      filters.length = { [Op.lte]: parseInt(maxLength as string) };
    }
    if (maxPrice) {
      filters.price = { [Op.lte]: parseFloat(maxPrice as string) };
    }

    const gpus = await GPU.findAll({
      where: filters,
      order: [['price', 'ASC']]
    });

    res.json(gpus);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch GPUs' });
  }
});

// Get a specific GPU by ID
router.get('/:id', async (req, res) => {
  try {
    const gpu = await GPU.findByPk(req.params.id);
    if (!gpu) {
      return res.status(404).json({ error: 'GPU not found' });
    }
    res.json(gpu);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch GPU' });
  }
});

// Create a new GPU
router.post('/', async (req, res) => {
  try {
    const gpu = await GPU.create(req.body);
    res.status(201).json(gpu);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create GPU' });
  }
});

// Update a GPU
router.put('/:id', async (req, res) => {
  try {
    const gpu = await GPU.findByPk(req.params.id);
    if (!gpu) {
      return res.status(404).json({ error: 'GPU not found' });
    }
    await gpu.update(req.body);
    res.json(gpu);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update GPU' });
  }
});

// Delete a GPU
router.delete('/:id', async (req, res) => {
  try {
    const gpu = await GPU.findByPk(req.params.id);
    if (!gpu) {
      return res.status(404).json({ error: 'GPU not found' });
    }
    await gpu.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete GPU' });
  }
});

export default router; 