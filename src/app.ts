import Koa from "koa";
import path from "path";
import "reflect-metadata";
import cors from "koa2-cors";
import logger from "koa-logger";
import serve from "koa-static";
import render from "koa-ejs";
import chackStatus from "./routes/checkStatus";
import { connectionPostgres } from "./db/dbConnections/postgresConnection";
import { ApolloServer } from "apollo-server-koa";
import { buildSchema } from "type-graphql";
import stripeRoutes from "./routes/stripeRoutes";

require("dotenv").config();

const PORT = process.env.SERVER_PORT || 4001;
const SERVER_HOST = process.env.LOCAL_HOST;
const staticDir = path.join(__dirname, '../public');
console.log(staticDir)

const main = async () => {

  await connectionPostgres();

  const schema = await buildSchema({
    resolvers: [path.join(__dirname, "/db/resolvers/**/*.ts")],
  });

  const apolloServer = new ApolloServer({ schema });

  const app = new Koa();

  render(app, {
    root: path.resolve(__dirname, 'views'),
    layout: 'layout',
    viewExt: 'html',
    cache: false,
    debug: false
  })

  app
    .use(cors())
    .use(logger())
    .use(serve(staticDir))
    .use(chackStatus.routes())
    .use(stripeRoutes.routes())
    .use(stripeRoutes.allowedMethods())
    .use(async ctx =>{
      await ctx.render(ctx.request.path === "/" ? "index" : ctx.request.path);
    });

  apolloServer.applyMiddleware({ app });

  app
    .listen(PORT, () => {
      console.log(
        `🚀 Server running on http://${SERVER_HOST}:${PORT}/ \n` +
          `📭 typeGraphQl UI running on http://${SERVER_HOST}:${PORT}/graphql \n` +
          `📭 Apollo Studio UI running at https://studio.apollographql.com/dev`
      );
    })
    .on("error", (err) => {
      console.log(err);
    });
};

main();
