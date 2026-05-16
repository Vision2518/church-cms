import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Fail fast so missing env vars don't become "''@localhost"
const required = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];
const missing = required.filter((k) => !process.env[k] || String(process.env[k]).trim() === "");

if (missing.length) {
  // Throwing here makes the backend crash immediately with a clear message
  throw new Error(
    `Missing required DB env vars: ${missing.join(
      ", ",
    )}. Ensure a .env file exists and contains DB_HOST, DB_USER, DB_PASSWORD, DB_NAME (and optionally DB_PORT).`,
  );
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10, // Allows up to 10 people to query at once
  queueLimit: 0,
});

export default pool;
