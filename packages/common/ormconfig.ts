import dotenv from "dotenv";
dotenv.config({path: "../../secrets/vscode.env"})

// order is important here. the above config must occur first.
import { connectionOptions } from './src/storage/connection-options';

module.exports = connectionOptions;