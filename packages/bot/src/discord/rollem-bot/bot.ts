// these must be the first imported items
import "reflect-metadata";
import nodeFetch from 'node-fetch';
global.fetch = nodeFetch as any;

import { Newable } from "./lib/utility-types";
import { DiscordBehaviorBase } from "./behaviors/discord-behavior-base";
import { DeadmanSwitchBehavior } from "./behaviors/deadman-switch";
import { DieOnDisconnectBehavior } from "./behaviors/die-on-disconnect.behavior";
import { DieOnErrorBehavior } from "./behaviors/die-on-error.behavior";
import { HeartbeatBehavior } from "./behaviors/heartbeat.behavior";
import { ParseSoftBehavior } from "./behaviors/parse-soft.behavior";
import { Bootstrapper } from "./bootstrap";
import { ParseBracketedBehavior } from "./behaviors/parse-bracketed.behavior";
import { ParseNamePrefixedBehavior } from "./behaviors/parse-name-prefixed.behavior";
import { ParseShortPrefixBehavior } from "./behaviors/parse-short-prefixed.behavior";
import { StorageBehavior } from "./behaviors/storage.behavior";
import { StandardAdapter } from "./behaviors/standard-adapter";
import { BehaviorBase } from "@common/behavior.base";
import { PingPongBehavior } from "@common/behaviors/ping-pong.behavior";
import { StatsBehavior } from "@common/behaviors/stats.behavior";
import { ChangelogBehavior } from "@common/behaviors/changelog.behavior";

const ORDERED_STANDARD_BEHAVIORS: Newable<BehaviorBase>[] = [
  PingPongBehavior,
  StatsBehavior,
  ChangelogBehavior,
];

/** The behaviors in the order in which they will be loaded. */
const ORDERED_DISCORD_BEHAVIORS: Newable<DiscordBehaviorBase>[] = [
  DieOnDisconnectBehavior,
  DieOnErrorBehavior,
  HeartbeatBehavior,
  ParseBracketedBehavior,
  ParseNamePrefixedBehavior,
  ParseShortPrefixBehavior,
  ParseSoftBehavior,
  DeadmanSwitchBehavior,
  StorageBehavior,
  StandardAdapter,
];

async function bootstrap() {
  const topLevelInjector    = Bootstrapper.buildTopLevelProviders();
                              await Bootstrapper.prepareStorage(topLevelInjector);
                              Bootstrapper.prepareChangelog(topLevelInjector);
  const client              = Bootstrapper.prepareClient(topLevelInjector);
  const clientLevelInjector = Bootstrapper.createClientContext(topLevelInjector, client, ORDERED_STANDARD_BEHAVIORS, ORDERED_DISCORD_BEHAVIORS);
                              await Bootstrapper.attachBehaviorsToClient(clientLevelInjector, ORDERED_DISCORD_BEHAVIORS);
                              Bootstrapper.startClient(clientLevelInjector);
}

bootstrap();
