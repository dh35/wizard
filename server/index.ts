import express from 'express';
import cors from 'cors';
import path from 'path';
import { sequelize } from './config/database';
import chassisRoutes from './routes/chassis';
import quotesRoutes from './routes/quotes';

const app = express();
const PORT = 3000;

// Basic middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/chassis', chassisRoutes);
app.use('/api/quotes', quotesRoutes);

// In production, serve static files and handle client routing
if (process.env.NODE_ENV === 'production') {
  // Serve static files
  const clientBuildPath = path.resolve(__dirname, '../../../client/build');
  app.use(express.static(clientBuildPath));
  
  // Handle client routing - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    }
  });
}

// Simple error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).send('Server Error');
});

// Start server
sequelize.sync()
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('Static files served from:', path.resolve(__dirname, '../../../client/build'));
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });

export default app; 