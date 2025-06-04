import { Pool } from "pg";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmt from "helmet";
import UsersRouters from "./routes/user.routes";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(helmt());

app.use("/api/v1/users", UsersRouters);

export const pool = new Pool({
  user: process.env.PGUSER ?? "postgres",
  host: process.env.PGHOST ?? "localhost",
  database: process.env.PGDATABASE ?? "postgres",
  password: process.env.PGPASSWORD ?? "1100",
  port: parseInt(process.env.PGPORT ?? "5432"),
});

// Initialize database connection
async function initializeDatabase() {
  try {
    const client = await pool.connect();
    console.log("Connected to PostgreSQL");
    client.release();
    return true;
  } catch (err) {
    console.error("Database connection error:", err);
    return false;
  }
}

// Start the server only after database connection is established
async function startServer() {
  const isConnected = await initializeDatabase();
  if (!isConnected) {
    console.error("Failed to connect to database. Exiting...");
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
