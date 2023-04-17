import { Application } from "./deps.ts";
import { router } from "./router.ts";

const app = new Application();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    ctx.response.status = 500;
    ctx.response.body = { message: e.message };
  }
});

app.use(router.routes());

export { app };
