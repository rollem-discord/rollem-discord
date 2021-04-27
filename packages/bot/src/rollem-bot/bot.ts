// these must be the first imported items
import "reflect-metadata";
global.fetch = require("node-fetch");
import { Newable } from "./lib/utility-types";
import { BehaviorBase } from "./behaviors/behavior-base";
import { DeadmanSwitchBehavior } from "./behaviors/deadman-switch";
import { DieOnDisconnectBehavior } from "./behaviors/die-on-disconnect.behavior";
import { DieOnErrorBehavior } from "./behaviors/die-on-error.behavior";
import { HeartbeatBehavior } from "./behaviors/heartbeat.behavior";
import { HelpBehavior } from "./behaviors/help.behavior";
import { PingPongBehavior } from "./behaviors/ping-pong.behavior";
import { ParseSoftBehavior } from "./behaviors/parse-soft.behavior";
import { Bootstrapper } from "./bootstrap";
import { ParseBracketedBehavior } from "./behaviors/parse-bracketed.behavior";
import { ParseNamePrefixedBehavior } from "./behaviors/parse-name-prefixed.behavior";
import { ParseShortPrefixBehavior } from "./behaviors/parse-short-prefixed.behavior";
import { StorageBehavior } from "./behaviors/storage.behavior";

/** The behaviors in the order in which they will be loaded. */
const ORDERED_BEHAVIORS: Newable<BehaviorBase>[] = [
  DieOnDisconnectBehavior,
  DieOnErrorBehavior,
  HeartbeatBehavior,
  HelpBehavior,
  PingPongBehavior,
  ParseBracketedBehavior,
  ParseNamePrefixedBehavior,
  ParseShortPrefixBehavior,
  ParseSoftBehavior,
  DeadmanSwitchBehavior,
  StorageBehavior,
];

async function bootstrap() {
  const topLevelInjector    = Bootstrapper.buildTopLevelProviders();
                              await Bootstrapper.prepareStorage(topLevelInjector);
                              Bootstrapper.prepareChangelog(topLevelInjector);
  const client              = Bootstrapper.prepareClient(topLevelInjector);
  const clientLevelInjector = Bootstrapper.createClientContext(topLevelInjector, client, ORDERED_BEHAVIORS);
                              await Bootstrapper.attachBehaviorsToClient(clientLevelInjector, ORDERED_BEHAVIORS);
                              Bootstrapper.startClient(clientLevelInjector);
}

bootstrap();
