const { Client } = require('pg');

async function createTestDb() {
  const connectionString = 'postgresql://postgres:shresth%4023%4019%4023@db.scgupjbmulmoyrigdxgu.supabase.co:5432/postgres';
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    // Check if test_db exists
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'test_db'");
    if (res.rowCount === 0) {
      await client.query('CREATE DATABASE test_db');
      console.log('test_db created');
    } else {
      console.log('test_db already exists');
    }
  } catch (err) {
    console.error('Failed to create test_db', err);
  } finally {
    await client.end();
  }
}

createTestDb();
