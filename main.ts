import { app } from "./app.ts";

const port = 8080;
console.log(`Setting up the server on localhost:${port}`);

await app.listen({ port });
