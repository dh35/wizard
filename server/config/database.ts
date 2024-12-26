import { Sequelize } from 'sequelize';

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

console.log('Database config:', {
  ...config[env as keyof typeof config],
  password: '***'
});

let sequelize: Sequelize;

try {
  sequelize = new Sequelize(config[env as keyof typeof config]);
  console.log('Sequelize instance created');
} catch (error) {
  console.error('Failed to create Sequelize instance:', error);
  process.exit(1);
}

export { sequelize, config }; 