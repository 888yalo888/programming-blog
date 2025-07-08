import { Pool } from "pg";

export const pool = new Pool({
  user: "postgres",
  host: "127.0.0.1",
  database: "blog",
  password: process.env.POSTGRESQL_POOL_PASSWORD!,
  port: 5432,
});
