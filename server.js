import app from "./app.js";
import { config } from "dotenv";
config();
import pool from "./config/pg.js";

const { PORT, HOST } = process.env;

const server = app.listen(PORT, HOST, () => {
  console.log(`Report Server is running on http://${HOST}:${PORT}`);
});

export default app;
