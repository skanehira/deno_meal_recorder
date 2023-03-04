import { postgres } from "./deps.ts";
import { NotFoundMealError } from "./error.ts";
import { newConnection, TABLE_NAME } from "./db.ts";

export type Meal = {
  id: number;
  name: string;
  protein: number;
  fat: number;
  carbo: number;
  calorie: number;
  createdAt: string;
};

export type MealEntry = Omit<Meal, "id" | "createdAt">;

async function withConnection<T>(
  run: (conn: postgres.PoolClient) => Promise<T>,
): Promise<T> {
  const conn = await newConnection();
  try {
    return run(conn);
  } finally {
    conn.release();
  }
}

export async function record(meal: MealEntry): Promise<void> {
  return await withConnection(async (conn) => {
    await conn.queryObject(
      `INSERT INTO ${TABLE_NAME}
      (name, protein, fat, carbo, calorie) VALUES
      ($name, $protein, $fat, $carbo, $calorie)`,
      meal,
    );
  });
}

export async function list(): Promise<Meal[]> {
  return await withConnection(async (conn) => {
    const resp = await conn.queryObject<Meal>(`SELECT * from ${TABLE_NAME}`);
    return resp.rows;
  });
}

export async function get(id: number): Promise<Meal> {
  return await withConnection(async (conn) => {
    const resp = await conn.queryObject<
      Meal
    >(`SELECT * from ${TABLE_NAME} where id = $id`, { id });
    if (resp.rows.length === 0) {
      throw new NotFoundMealError(`not found meal with id ${id}`);
    }
    return resp.rows[0] as Meal;
  });
}

export async function update(
  id: number,
  meal: Partial<MealEntry>,
): Promise<void> {
  await withConnection(async (conn) => {
    const columns = Object.keys(meal).map((k) => `${k} = $${k}`).join(
      ", ",
    );

    const data = { id, ...meal };
    await conn
      .queryObject(`UPDATE ${TABLE_NAME} SET ${columns} WHERE id = $id`, data);
  });
}

export async function remove(id: number): Promise<void> {
  await withConnection(async (conn) => {
    await conn.queryObject(`DELETE from ${TABLE_NAME} where id = $id`, { id });
  });
}
