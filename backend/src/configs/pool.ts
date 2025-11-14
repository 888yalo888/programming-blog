import { Pool } from "pg";

export const pool = new Pool({
  user: process.env.POSTGRESQL_USER || "postgres",
  host: process.env.POSTGRESQL_HOST || "127.0.0.1",
  database: process.env.POSTGRESQL_DATABASE || "blog",
  password: process.env.POSTGRESQL_POOL_PASSWORD!,
  port: parseInt(process.env.POSTGRESQL_PORT || "5432"),
});
