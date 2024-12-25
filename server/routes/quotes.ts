import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

router.post('/save-quote', async (req, res) => {
  try {
    const { filename, customerInfo, config, costs, quote } = req.body;
    
    // Create quotes directory if it doesn't exist
    const quotesDir = path.join(__dirname, '../quotes');
    if (!fs.existsSync(quotesDir)) {
      fs.mkdirSync(quotesDir, { recursive: true });
    }

    // Save the full configuration
    const configData = {
      customerInfo,
      config,
      costs,
      quote,
      timestamp: new Date().toISOString()
    };

    fs.writeFileSync(
      path.join(quotesDir, `${filename}.json`),
      JSON.stringify(configData, null, 2)
    );

    res.json({ success: true, filename });
  } catch (error) {
    console.error('Error saving quote:', error);
    res.status(500).json({ error: 'Failed to save quote' });
  }
});

export default router; 