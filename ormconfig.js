require("dotenv").config({path: "secrets/vscode.env"});

module.exports = {
   "type": "postgres",
   "url": process.env.DB_CONNECTION_STRING,
   "ssl": { rejectUnauthorized: false },
   "synchronize": true,
   "logging": false,
   "entities": [
      "src/entity/**/*.ts"
   ],
   "migrations": [
      "src/storage/migration/**/*.ts"
   ],
   "subscribers": [
      "src/storage/subscriber/**/*.ts"
   ],
   "cli": {
      "entitiesDir": "src/storage/entity",
      "migrationsDir": "src/storage/migration",
      "subscribersDir": "src/storage/subscriber"
   }
}