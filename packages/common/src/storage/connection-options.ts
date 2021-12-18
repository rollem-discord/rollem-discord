import { User, UserFlags, UserSiteData } from ".";
import dotenv from "dotenv";
import { ConnectionOptions } from "typeorm";

/** The default connection optionst. Partially configured by environment. */
export const connectionOptions: ConnectionOptions = {
  type: "postgres",
  url: process.env.DB_CONNECTION_STRING,
  ssl: process.env.DB_DISABLE_SSL ? false : { rejectUnauthorized: false },
  synchronize: false,
  logging: true,
  entities: [User, UserFlags, UserSiteData],
  migrations: ["src/storage/migrations/**/*.ts"],
  subscribers: ["src/storage/subscriber/**/*.ts"],
  
  cli: {
    migrationsDir: "src/storage/migrations",
  },
};