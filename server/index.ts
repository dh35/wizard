import express from 'express';
import cors from 'cors';
import { sequelize } from './models';
import dotenv from 'dotenv';

// Routes
import cpuRoutes from './routes/cpu';
import gpuRoutes from './routes/gpu';
import chassisRoutes from './routes/chassis';
import ramRoutes from './routes/ram';
import storageRoutes from './routes/storage';
import quotesRouter from './routes/quotes';

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/cpu', cpuRoutes);
app.use('/api/gpu', gpuRoutes);
app.use('/api/chassis', chassisRoutes);
app.use('/api/ram', ramRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api', quotesRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Database connection and server start
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    await sequelize.sync();
    console.log('Database models synchronized.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer(); 