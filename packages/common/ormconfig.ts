import { User } from "./src/storage/entity/User";

require("dotenv").config({path: "../../secrets/vscode.env"});

module.exports = {
   "type": "postgres",
   "url": process.env.DB_CONNECTION_STRING,
   "ssl": { rejectUnauthorized: false },
   "synchronize": true,
   "logging": false,
   "entities": [
      User
   ],
   "migrations": [
      "src/storage/migration/**/*.ts"
   ],
   "subscribers": [
      "src/storage/subscriber/**/*.ts"
   ],
}