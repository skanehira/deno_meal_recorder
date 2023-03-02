import { query } from "./supabase.ts";
import { NotFoundMealError } from "./error.ts";

type Meal = {
  id: string;
  name: string;
  protein: number;
  fat: number;
  carbo: number;
  calorie: number;
  createdAt: string;
};

export type MealEntry = Omit<Meal, "id" | "createdAt">;

export async function record(meal: MealEntry): Promise<void> {
  const resp = await query().insert(meal);
  if (resp.status !== 201) {
    throw new Error(`failed to record meal: ${resp.error!.message}`);
  }
}

export async function list(): Promise<Meal[]> {
  const resp = await query().select();
  if (resp.status !== 200) {
    throw new Error(`failed to find meals: ${resp.error!.message}`);
  }
  return resp.data as Meal[];
}

export async function get(id: number): Promise<Meal> {
  const resp = await query().select().eq("id", id);
  if (resp.status !== 200) {
    throw new Error(`failed to find meals: ${resp.error!.message}`);
  }
  if (!resp.data || resp.data.length === 0) {
    throw new NotFoundMealError(`not found meal with id ${id}`);
  }
  return resp.data[0] as Meal;
}

export async function remove(id: number): Promise<void> {
  const resp = await query().delete().eq("id", id);
  if (resp.status !== 204) {
    throw new Error(`failed to remove meals: ${resp.error!.message}`);
  }
}

export async function update(id: number, meal: MealEntry): Promise<void> {
  const resp = await query().update(meal).eq("id", id);
  if (resp.status !== 200) {
    throw new Error(`failed to update meals: ${resp.error!.message}`);
  }
}
