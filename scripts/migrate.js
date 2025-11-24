const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function runSchema() {
  try {
    const schemaPath = path.join(__dirname, '../server/db/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Connecting to DB...');
    const client = await pool.connect();
    console.log('Connected. Applying schema...');

    await client.query(schemaSql);

    console.log('Schema applied successfully!');
    client.release();
    pool.end();
  } catch (err) {
    console.error('Error applying schema:', err);
    process.exit(1);
  }
}

runSchema();
