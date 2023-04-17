import { Router } from "./deps.ts";
import { list, type MealEntry, record, remove, update } from "./meal.ts";

const mealsRouter = new Router();

mealsRouter.get("/", async (ctx) => {
  const meals = await list();
  ctx.response.body = meals;
});

mealsRouter.post("/", async (ctx) => {
  const meal = await ctx.request.body({ type: "json" }).value as MealEntry;
  await record(meal);
  ctx.response.status = 201;
});

mealsRouter.delete("/:id", async (ctx) => {
  const id = parseInt(ctx.params.id);
  await remove(id);
  ctx.response.status = 204;
});

mealsRouter.patch("/:id", async (ctx) => {
  const id = parseInt(ctx.params.id);
  const meal = await ctx.request.body({ type: "json" }).value as MealEntry;
  await update(id, meal);
  ctx.response.status = 204;
});

const router = new Router().use(
  "/meals",
  mealsRouter.routes(),
  mealsRouter.allowedMethods(),
);

export { router };
