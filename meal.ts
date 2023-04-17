import { TABLE_NAME, withConnection } from "./db.ts";

export type Meal = {
  id: number;
  name: string;
  protein: number;
  fat: number;
  carbo: number;
  calorie: number;
  created_at: string;
};

export type MealEntry = Omit<Meal, "id" | "created_at">;

export async function record(meal: MealEntry): Promise<void> {
  await withConnection(async (conn) => {
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
