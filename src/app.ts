import Koa from "koa";
import path from "path";
import "reflect-metadata";
import cors from "koa2-cors";
import logger from "koa-logger";
import chackStatus from "./routes/checkStatus";
import { connectionPostgres } from "./db/dbConnections/postgresConnection";
import { ApolloServer } from "apollo-server-koa";
import { buildSchema } from "type-graphql";

require("dotenv").config();

const PORT = process.env.SERVER_PORT || 4001;
const SERVER_HOST = process.env.LOCAL_HOST;

const main = async () => {
  await connectionPostgres();

  const schema = await buildSchema({
    resolvers: [path.join(__dirname, "/db/resolvers/**/*.ts")],
  });

  const apolloServer = new ApolloServer({ schema });

  const app = new Koa();

  app.use(cors()).use(logger()).use(chackStatus.routes());

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
