import pkg from 'pg';
const { Pool } = pkg;
import "dotenv/config";

export const pool = new Pool({  // Export as 'pool'
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.connect()
  .then(() => console.log("Berhasil terhubung ke database"))
  .catch((err) => console.error("Gagal terhubung ke database", err));
