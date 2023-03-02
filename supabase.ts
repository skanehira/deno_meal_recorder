import { createClient } from "./deps.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_KEY")!,
);

export function query() {
  return supabase.from("meals");
}
