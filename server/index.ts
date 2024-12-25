import express from 'express';
import cors from 'cors';
import path from 'path';
import { sequelize } from './models';
import chassisRoutes from './routes/chassis';
import quotesRoutes from './routes/quotes';

const app = express();
const PORT = process.env.PORT || 3000;

// Basic middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// API routes
app.use('/api/chassis', chassisRoutes);
app.use('/api/quotes', quotesRoutes);

// Simple error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).send('Server Error');
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Start server
sequelize.sync()
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });

export default app; 