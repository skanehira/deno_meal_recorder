import { newConnection, TABLE_NAME } from "../db.ts";

export async function createTable() {
  const conn = await newConnection();
  try {
    await conn.queryObject(`
CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
  id SERIAL PRIMARY KEY,
  name varchar(20) NOT NULL,
  protein int NOT NULL,
  fat int NOT NULL,
  carbo int NOT NULL,
  calorie int NOT NULL,
  created_at timestamp default CURRENT_TIMESTAMP
)
`);
  } finally {
    conn.release();
  }
}

if (import.meta.main) {
  await createTable();
}
