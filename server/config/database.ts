import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from root directory
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: path.join(__dirname, '../../', envFile) });

const config = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'server_config_wizard',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres' as const,
    logging: true
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres' as const,
    logging: false
  }
};

const env = process.env.NODE_ENV || 'development';

// Validate required environment variables in production
if (env === 'production') {
  const required = ['DB_USER', 'DB_PASSWORD', 'DB_NAME', 'DB_HOST'];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

const sequelize = new Sequelize(config[env as keyof typeof config]);

export { sequelize, config }; 