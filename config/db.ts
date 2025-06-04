import { Pool } from "pg";
import type { Pool as PoolType } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const db: PoolType = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: Number(process.env.DB_PORT),
}) as any;

// Test the database connection
db.query("SELECT NOW()")
  .then(() => console.log("✅ DB connected"))
  .catch((err: any) => console.error("❌ DB connection error:", err));
