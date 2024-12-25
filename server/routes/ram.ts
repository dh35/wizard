import express from 'express';
import { RAM } from '../models';
import { Op } from 'sequelize';

const router = express.Router();

// Get all RAM options with optional filtering
router.get('/', async (req, res) => {
  try {
    const { cpuGeneration, minCapacity } = req.query;
    
    const filters: any = {};
    
    // Filter by CPU generation compatibility
    if (cpuGeneration) {
      filters.compatibleWith = {
        [Op.contains]: [cpuGeneration]
      };
    }

    // Filter by minimum capacity
    if (minCapacity) {
      filters.capacity = {
        [Op.gte]: parseInt(minCapacity as string)
      };
    }

    console.log('Received query params:', req.query);
    console.log('Applied filters:', filters);

    const rams = await RAM.findAll({
      where: filters,
      order: [
        ['capacity', 'ASC'],
        ['price', 'ASC']
      ]
    });

    console.log('Found RAM options:', rams.length);
    res.json(rams);
  } catch (error) {
    console.error('Error fetching RAM options:', error);
    res.status(500).json({ error: 'Failed to fetch RAM options' });
  }
});

export default router; 