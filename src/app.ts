import Koa from "koa";
import cors from "koa2-cors";
import logger from "koa-logger";
import chackStatus from "./routes/checkStatus"

require("dotenv").config();

const PORT = process.env.SERVER_PORT || 3001;
const SERVER_HOST = process.env.LOCAL_HOST;

const app = new Koa();

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