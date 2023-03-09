import { Router } from "./deps.ts";
import { get, list, MealEntry, record, remove, update } from "./meal.ts";

const meals = new Router();

meals.get("/", async (ctx) => {
  const meals = await list();
  ctx.response.body = JSON.stringify(meals);
});

meals.get("/:id", async (ctx) => {
  const id = parseInt(ctx.params.id);
  const meal = await get(id);
  ctx.response.body = JSON.stringify(meal);
});

meals.post("/", async (ctx) => {
  const meal = await ctx.request.body({ type: "json" }).value as MealEntry;
  await record(meal);
  ctx.response.status = 201;
});

meals.delete("/:id", async (ctx) => {
  const id = parseInt(ctx.params.id);
  await remove(id);
  ctx.response.status = 204;
});

meals.patch("/:id", async (ctx) => {
  const id = parseInt(ctx.params.id);
  const meal = await ctx.request.body({ type: "json" }).value as MealEntry;
  await update(id, meal);
  ctx.response.status = 204;
});

const router = new Router().use(
  "/meals",
  meals.routes(),
  meals.allowedMethods(),
);

export { router };
