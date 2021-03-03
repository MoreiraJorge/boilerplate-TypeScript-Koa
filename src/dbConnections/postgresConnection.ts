import {createConnection} from "typeorm";
require("dotenv").config();

const SERVER_HOST = process.env.LOCAL_HOST;
const POSTGRES_PORT = process.env.POSTGRES_PORT;
const POSTGRES_USER = process.env.POSTGRES_USER;
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
const POSTGRES_DB = process.env.POSTGRES_DB;

export const connectionPostgres = async () => {
    await createConnection({
        type: "postgres",
        host: SERVER_HOST,
        port: Number(String(POSTGRES_PORT)),
        username: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
        database: POSTGRES_DB,
        synchronize: true,
        logging: true,
        entities:["src/entities/*.*"]
    });
};

