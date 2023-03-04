import { postgres } from "./deps.ts";

const config: postgres.ClientOptions = {
  password: Deno.env.get("PASSWORD"),
  port: Deno.env.get("PORT"),
  hostname: Deno.env.get("HOST_NAME"),
  user: Deno.env.get("DB_USER"),
  database: Deno.env.get("DATABASE"),
  tls: {
    caCertificates: [
      Deno.env.get("CA")!,
    ],
  },
};

const pool = new postgres.Pool(config, 2, true);
export async function newConnection(): Promise<postgres.PoolClient> {
  return await pool.connect();
}
export const TABLE_NAME = Deno.env.get("TABLE_NAME");
