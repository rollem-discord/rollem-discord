require("module-alias/register")
import "reflect-metadata";
import { Logger } from "./logger";
import { Config } from "./config";
import { RollemParser } from "@language/rollem";
import { Client } from "discord.js";
import { DieOnDisconnectBehavior } from "./behaviors/die-on-disconnect.behavior";
import { DieOnErrorBehavior } from "./behaviors/die-on-error.behavior";
import { Container, interfaces } from "inversify";
import { ChangeLog } from "./changelog";
import { BehaviorBase } from "./behaviors/behavior-base";

const config = new Config();
const logger = new Logger(config);

console.log("Shard ID: " + config.ShardId)
console.log("Shard Count: " + config.ShardCount)
console.log("Logging in using token: " + config.Token);

logger.trackEvent("Setting up DI");
var container = new Container();
container.bind<Logger>(Logger).toConstantValue(logger);
container.bind<Config>(Config).toConstantValue(config);
container.bind<ChangeLog>(ChangeLog).to(ChangeLog);
container.bind<RollemParser>(RollemParser).to(RollemParser);

logger.trackEvent("Constructing client...");
let client = new Client({
  shardCount: config.ShardCount,
  shardId: config.ShardId,
});

container.bind<Client>(Client).toConstantValue(client);
logger.client = client;

/** The behaviors in the order in which they will be loaded. */
const ORDERED_BEHAVIORS: interfaces.Newable<BehaviorBase>[] = [
  DieOnDisconnectBehavior,
  DieOnErrorBehavior,
];

logger.trackEvent("Constructing behaviors...");
const constructedBehaviors = ORDERED_BEHAVIORS.map(ctor => container.resolve(ctor));

logger.trackEvent("Applying behaviors...");
constructedBehaviors.forEach(b => b.apply());

logger.trackEvent("Ready to start. Logging in...");
client.login(config.Token);
logger.trackEvent("Script end.");