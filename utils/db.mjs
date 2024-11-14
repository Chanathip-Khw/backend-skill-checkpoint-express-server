import * as pg from "pg";
//import dotenv from "dotenv";

// dotenv.config();

const { Pool } = pg.default;

const connectionPool = new Pool({
  connectionString:
    "postgresql://postgres:%232YrEtIrE@localhost:5432/quora-mock",
});
// const connectionPool = new Pool({
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT),
//   database: process.env.DB_NAME,
// });
export default connectionPool;
