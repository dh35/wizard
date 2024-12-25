import cron from 'node-cron';
import dataIngestionService from '../services/dataIngestion';
import { sequelize } from '../models';
import dotenv from 'dotenv';

dotenv.config();

// Schedule data ingestion to run daily at 2 AM
cron.schedule('0 2 * * *', async () => {
  console.log('Starting scheduled data ingestion...');
  
  try {
    // Clear old data
    await sequelize.transaction(async (t) => {
      await Promise.all([
        sequelize.models.CPU.destroy({ truncate: true, transaction: t }),
        sequelize.models.GPU.destroy({ truncate: true, transaction: t }),
        sequelize.models.Chassis.destroy({ truncate: true, transaction: t })
      ]);
    });

    // Run new data ingestion
    await dataIngestionService.scrapeAndParse();
    
    console.log('Scheduled data ingestion completed successfully');
  } catch (error) {
    console.error('Scheduled data ingestion failed:', error);
    
    // Send notification to admin (implement your notification service here)
    // notificationService.notify('Data ingestion failed', error);
  }
});

// Optional: Run initial data ingestion when the server starts
if (process.env.RUN_INITIAL_INGESTION === 'true') {
  console.log('Running initial data ingestion...');
  dataIngestionService.scrapeAndParse()
    .then(() => console.log('Initial data ingestion completed'))
    .catch(error => console.error('Initial data ingestion failed:', error));
}

export default cron; 