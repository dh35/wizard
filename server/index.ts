import dotenv from 'dotenv';
import path from 'path';

console.log('Starting server initialization...');

// Load environment variables from .env.production in production
if (process.env.NODE_ENV === 'production') {
  const envPath = path.resolve(__dirname, '../../.env.production');
  console.log('Loading environment from:', envPath);
  const result = dotenv.config({ path: envPath });
  if (result.error) {
    console.error('Error loading .env file:', result.error);
    process.exit(1);
  }
  console.log('Environment variables loaded:', process.env.DB_USER, process.env.DB_HOST);
}

import express from 'express';
import cors from 'cors';
import { sequelize } from './config/database';
import chassisRoutes from './routes/chassis';
import quotesRoutes from './routes/quotes';

const app = express();
const PORT = process.env.PORT || 3000;

// Basic middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/chassis', chassisRoutes);
app.use('/api/quotes', quotesRoutes);

// In production, serve static files and handle client routing
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.resolve(__dirname, '../../../client/build');
  console.log('Setting up static files from:', clientBuildPath);
  app.use(express.static(clientBuildPath));
  
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    }
  });
}

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Express error:', err);
  res.status(500).send('Server Error');
});

console.log('Attempting database sync...');

// Start server
sequelize.sync()
  .then(() => {
    console.log('Database synced successfully');
    return new Promise((resolve, reject) => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        resolve(true);
      }).on('error', (err) => {
        console.error('Failed to start server:', err);
        reject(err);
      });
    });
  })
  .catch((err) => {
    console.error('Server startup failed:', err);
    process.exit(1);
  });

export default app; 