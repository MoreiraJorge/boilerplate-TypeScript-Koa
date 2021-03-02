import Koa from "koa";

const app = new Koa();

app.use(async (ctx) => {
  ctx.body = "It works!";
});

app.listen(3000);
