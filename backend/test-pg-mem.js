const { newDb } = require('pg-mem');
const fs = require('fs');
const path = require('path');

const db = newDb();
db.public.registerFunction({
  name: 'uuid_generate_v4',
  returns: 'uuid',
  implementation: () => require('crypto').randomUUID(),
});

const { Pool } = db.adapters.createPg();
const pool = new Pool();

async function testPgMem() {
  const initSql = fs.readFileSync(path.join(__dirname, 'db/migrations/001_init.sql'), 'utf-8')
    .replace(/CREATE EXTENSION IF NOT EXISTS "uuid-ossp";/g, '');
  try {
    await pool.query(initSql);
    console.log("Migrations applied to pg-mem successfully!");
  } catch (e) {
    console.log("pg-mem error:", e.message);
  }
}

testPgMem();
