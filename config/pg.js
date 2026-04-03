import { Pool } from "pg";
import { config } from "dotenv";
config();

const { PG_USER, PG_HOST, PG_DATABASE, PG_PASSWORD, PG_PORT, SUPABASE_URL } = process.env;

let pool;

if (process.env.NODE_ENV === "production") {
  pool = new Pool({
    connectionString: SUPABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  pool = new Pool({
    user: PG_USER,
    host: PG_HOST,
    database: PG_DATABASE,
    password: PG_PASSWORD,
    port: PG_PORT,
  });
}

(async () => {
  try {
    const client = await pool.connect();
    console.log("Connected to PostgreSQL database");
    client.release();
  } catch (err) {
    console.error("Error connecting to PostgreSQL database", err);
  }
})();

export default pool;
