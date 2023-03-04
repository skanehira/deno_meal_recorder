import { Application } from "./deps.ts";
import { router } from "./router.ts";
import { NotFoundMealError } from "./error.ts";

const app = new Application();

app.use(async (ctx, next) => {
  try {
    await next();
    ctx.response.headers.set("Content-Type", "application/json; charset=UTF-8");
  } catch (e) {
    if (e instanceof NotFoundMealError) {
      ctx.response.status = 404;
    } else {
      ctx.response.status = 500;
    }
    ctx.response.body = JSON.stringify({ message: e.message });
  }
});

app.use(router.routes());

export { app };
