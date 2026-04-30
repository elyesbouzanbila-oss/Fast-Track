const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      // Required for PostGIS geometry types to be returned as strings
      // so we can parse them manually
      typeCast: true,
    },
  }
);

/**
 * Initialize the database connection and enable PostGIS extension.
 *
 * FIX: postgis_tiger_geocoder is not available in all PostGIS builds and caused
 * a hard crash at startup. Each optional extension is now in its own try/catch
 * so a missing extension only logs a warning instead of killing the process.
 */
async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connection established.');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }

  // Core PostGIS — required
  await sequelize.query('CREATE EXTENSION IF NOT EXISTS postgis;');
  console.log('✅ PostGIS enabled.');

  // Optional extensions — log a warning if unavailable instead of crashing
  const optional = ['postgis_topology', 'fuzzystrmatch', 'postgis_tiger_geocoder'];
  for (const ext of optional) {
    try {
      await sequelize.query(`CREATE EXTENSION IF NOT EXISTS ${ext};`);
    } catch (err) {
      console.warn(`⚠️  Optional extension "${ext}" could not be enabled: ${err.message}`);
    }
  }
}

module.exports = { sequelize, initDatabase };
