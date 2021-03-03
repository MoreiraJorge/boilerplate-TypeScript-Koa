import Koa from "koa";
import cors from "koa2-cors";
import logger from "koa-logger";
import chackStatus from "./routes/checkStatus"
import "reflect-metadata";
import { ApolloServer } from "apollo-server-koa";
import { buildSchema, Resolver, Query } from "type-graphql";

require("dotenv").config();

const PORT = process.env.SERVER_PORT || 3001;
const SERVER_HOST = process.env.LOCAL_HOST;

@Resolver()
class HelloResolver {
  @Query(() => String)
  async hello(){
    return "Hello World";
  }
}

const main = async () => {

  const schema = await buildSchema({
    resolvers: [HelloResolver]
  });

  const apolloServer = new ApolloServer({schema});

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
      console.log(`Server running on http://${SERVER_HOST}:${PORT}`);
    })
    .on("error", (err) => {
      console.log(err);
    });
}

main();