import Koa from "koa";
import cors from "koa2-cors";
import logger from "koa-logger";
import chackStatus from "./routes/checkStatus";
import { connectionPostgres } from "./db/dbConnections/postgresConnection";
import { ApolloServer } from "apollo-server-koa";
import { buildSchema } from "type-graphql";
import { CheckStatusResolver } from "./db/resolvers/ServerStatus/CheckStatusResolver";
import { RegisterResolver } from "./db/resolvers/User/RegisterResolver";

require("dotenv").config();

const PORT = process.env.SERVER_PORT || 3001;
const SERVER_HOST = process.env.LOCAL_HOST;

const main = async () => {

  await connectionPostgres()
    .then(() => {
      console.log("Connected to Postgres!");
    })
    .catch((err) => {
      console.log(err);
    });

  const schema = await buildSchema({
    resolvers: [CheckStatusResolver, 
      RegisterResolver]
  });

  const apolloServer = new ApolloServer({ schema });

  const app = new Koa();

  apolloServer.applyMiddleware({ app });

  app
    .use(
      cors({
        origin: "*",
      })
    )
    .use(logger())
    .use(chackStatus.routes());

  app
    .listen(PORT, () => {
      console.log(` 🚀 Server running on http://${SERVER_HOST}:${PORT}/`);
      console.log(
        `📭 typeGraphQl UI running on http://${SERVER_HOST}:${PORT}/graphql`
      );
      console.log(
        `📭 Apollo Studio UI running at https://studio.apollographql.com/dev`
      );
    })
    .on("error", (err) => {
      console.log(err);
    });
};

main();
