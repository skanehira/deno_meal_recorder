import { get, list, Meal, MealEntry, record, remove, update } from "./meal.ts";
import { newConnection, TABLE_NAME } from "./db.ts";
import { assertEquals } from "https://deno.land/std@0.178.0/testing/asserts.ts";

async function withTestSetup(test: () => Promise<void>) {
  const conn = await newConnection();
  try {
    await conn.queryObject(`DELETE FROM ${TABLE_NAME}`);
    await test();
  } finally {
    conn.release();
  }
}

function assertMeal(want: MealEntry, meal: Meal) {
  const got = (({ id: _i, createdAt: _c, ...rest }) => ({ ...rest }))(
    meal,
  );
  assertEquals(got, want);
}

const meal = {
  name: "パスタ",
  protein: 10,
  fat: 20,
  carbo: 30,
  calorie: 40,
};

Deno.test({
  name: "record meal and get meal list",
  fn: async () => {
    await withTestSetup(async () => {
      await record(meal);
      assertMeal(meal, (await list())[0]);
    });
  },
  sanitizeResources: false,
});

Deno.test({
  name: "get meal with id",
  fn: async () => {
    await withTestSetup(async () => {
      await record(meal);
      const id = (await list())[0].id;
      assertMeal(meal, await get(id));
    });
  },
  sanitizeResources: false,
});

Deno.test({
  name: "update meal",
  fn: async () => {
    await withTestSetup(async () => {
      await record(meal);
      const id = (await list())[0].id;
      await update(id, meal);
      assertMeal(meal, await get(id));
    });
  },
  sanitizeResources: false,
});

Deno.test({
  name: "delete meal",
  fn: async () => {
    await withTestSetup(async () => {
      await record(meal);
      const id = (await list())[0].id;
      await remove(id);
      assertEquals(await list(), []);
    });
  },
  sanitizeResources: false,
});