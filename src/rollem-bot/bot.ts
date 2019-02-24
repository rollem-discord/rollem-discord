require("module-alias/register")
import "reflect-metadata";
import { Logger } from "./logger";

import { Config } from "./config";
import { RollemParser } from "@language/rollem";
import { Client } from "discord.js";
import { DieOnDisconnectBehavior } from "./behaviors/die-on-disconnect.behavior";
import { DieOnErrorBehavior } from "./behaviors/die-on-error.behavior";
import { ChangeLog } from "./changelog";
import { BehaviorBase } from "./behaviors/behavior-base";
import assert = require("assert");
import { ReflectiveInjector } from "injection-js";
import { HeartbeatBehavior } from "./behaviors/heartbeat.behavior";
import { HelpBehavior } from "./behaviors/help.behavior";
import { PingPongBehavior } from "./behaviors/ping-pong.behavior";
import { ParseHardBehavior } from "./behaviors/parse-hard.behavior";
import { ParseSoftBehavior } from "./behaviors/parse-soft.behavior";

console.log("Setting up top-level DI");
const topLevelInjector =
  ReflectiveInjector.resolveAndCreate([
    Logger,
    Config,
    ChangeLog,
    RollemParser,
  ]);

const logger = topLevelInjector.get(Logger) as Logger;
const config = topLevelInjector.get(Config) as Config;
const changelog = topLevelInjector.get(ChangeLog) as ChangeLog;
const parser = topLevelInjector.get(RollemParser) as RollemParser;
assert(!!logger, "DI failed to resolve logger");
assert(!!config, "DI failed to resolve config");
assert(!!changelog, "DI failed to resolve changelog");
assert(!!parser, "DI failed to resolve parser");

console.log("Shard ID: " + config.ShardId)
console.log("Shard Count: " + config.ShardCount)
console.log("Logging in using token: " + config.Token);

changelog.initialize();

logger.trackEvent("Constructing client...");
let client = new Client({
  shardCount: config.ShardCount,
  shardId: config.ShardId,
});
logger.client = client;

/** The behaviors in the order in which they will be loaded. */
const ORDERED_BEHAVIORS = [
  DieOnDisconnectBehavior,
  DieOnErrorBehavior,
  HeartbeatBehavior,
  HelpBehavior,
  PingPongBehavior,
  ParseHardBehavior,
  ParseSoftBehavior,
];

/// In to the next level of DI
logger.trackError("Setting up client-scoped DI");
const clientLevelInjector = topLevelInjector.resolveAndCreateChild([
  {
    provide: Client,
    useValue: client,
  },
  ...ORDERED_BEHAVIORS,
]);

logger.trackEvent("Constructing behaviors...");
const constructedBehaviors = ORDERED_BEHAVIORS.map(ctor => clientLevelInjector.get(ctor) as BehaviorBase);

logger.trackEvent("Applying behaviors...");
constructedBehaviors.forEach(b => b.apply());

logger.trackEvent("Ready to start. Logging in...");
client.login(config.Token);
logger.trackEvent("Script end.");