# Server Configuration Wizard

A web-based tool for sales agents to configure servers with real-time compatibility checking and AI-powered hardware database.

## Features

- Step-by-step server configuration wizard
- Real-time power and compatibility calculations
- AI-powered hardware specification database
- Daily updates of hardware specifications
- Modern, responsive UI
- Future WHMCS integration capability

## Tech Stack

- **Frontend:**
  - React with TypeScript
  - Material-UI components
  - Formik for form handling
  - Axios for API requests

- **Backend:**
  - Node.js with Express
  - PostgreSQL with Sequelize ORM
  - OpenAI GPT-4 for spec parsing
  - Node-cron for scheduled tasks

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- OpenAI API key
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/server-config-wizard.git
   cd server-config-wizard
   ```

2. Install dependencies:
   ```bash
   # Install server dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Copy example environment file
   cp .env.example .env
   
   # Edit .env with your configuration
   nano .env
   ```

4. Set up the database:
   ```bash
   # Create PostgreSQL database
   createdb server_wizard
   
   # Run migrations
   npm run migrate
   ```

## Development

1. Start the development server:
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start separately:
   npm run server  # Backend only
   npm run client  # Frontend only
   ```

2. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Data Ingestion

The application includes an AI-powered data ingestion system that:
- Scrapes hardware specifications from manufacturer websites
- Uses GPT-4 to parse and structure the data
- Updates the database daily at 2 AM
- Can be triggered manually through the API

To run data ingestion manually:
```bash
curl -X POST http://localhost:3001/api/admin/trigger-ingestion
```

## API Endpoints

### Components
- `GET /api/cpu` - List CPUs with optional filters
- `GET /api/gpu` - List GPUs with optional filters
- `GET /api/chassis` - List chassis with optional filters

### Configuration
- `POST /api/config/validate` - Validate component compatibility
- `POST /api/config/save` - Save configuration
- `GET /api/config/:id` - Get saved configuration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for GPT-4 API
- Material-UI for React components
- All hardware manufacturers for specifications 