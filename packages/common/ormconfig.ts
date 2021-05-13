import { User, UserFlags } from "./src";
import dotenv from "dotenv";
dotenv.config({path: "../../secrets/vscode.env"})

module.exports = {
   "type": "postgres",
   "url": process.env.DB_CONNECTION_STRING,
   "ssl": { rejectUnauthorized: false },
   "synchronize": true,
   "logging": false,
   "entities": [
      User, UserFlags, 
   ],
   "migrations": [
      "src/storage/migration/**/*.ts"
   ],
   "subscribers": [
      "src/storage/subscriber/**/*.ts"
   ],
}