import { get, list, Meal, MealEntry, record, remove, update } from "./meal.ts";
import { createTable, TABLE_NAME, withConnection } from "./db.ts";
import { assertEquals } from "https://deno.land/std@0.178.0/testing/asserts.ts";

await createTable();

async function withTestSetup(test: () => Promise<void>) {
  await withConnection(async (conn) => {
    await conn.queryObject(`DELETE FROM ${TABLE_NAME}`);
    await test();
  });
}

function assertMeal(want: MealEntry, meal: Meal) {
  // deno-lint-ignore no-unused-vars
  const got = (({ id, created_at, ...rest }) => ({ ...rest }))(
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
      const newMeal = {
        name: "トマト",
        protein: 15,
        fat: 25,
        carbo: 35,
        calorie: 45,
      };
      await update(id, newMeal);
      assertMeal(newMeal, await get(id));
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
