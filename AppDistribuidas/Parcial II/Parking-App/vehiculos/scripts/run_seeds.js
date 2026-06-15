const fs = require('fs');
const { Client } = require('pg');

async function main() {
  const sql = fs.readFileSync('seeds/insert_vehiculos.sql', 'utf8');

  const client = new Client({
    host: process.env.DB_HOST || process.env.PGHOST || 'localhost',
    port: parseInt(process.env.DB_PORT || process.env.PGPORT, 10) || 5432,
    user: process.env.DB_USUARIO || process.env.PGUSER || 'postgres',
    password: process.env.DB_CONTRASENA || process.env.POSTGRES_PASSWORD || process.env.PGPASSWORD || 'postgres',
    database: process.env.DB_NOMBRE || process.env.PGDATABASE || 'gestion_vehiculos',
  });

  await client.connect();
  try {
    // Split statements and execute sequentially
    const stmts = sql
      .split(/;\s*\n/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const s of stmts) {
      try {
        await client.query(s);
      } catch (err) {
        // Ignore duplicate key errors and continue
        if (err.code === '23505') {
          console.warn('Ignored duplicate key error for statement:', s.split('\n')[0]);
          continue;
        }
        throw err;
      }
    }

    const res = await client.query("SELECT id, placa, marca, tipo, clasificacion FROM vehiculo ORDER BY placa;");
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error('Error running seeds:', err.message || err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();
