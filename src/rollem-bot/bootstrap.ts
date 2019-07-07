import { Logger } from "./logger";

import { Config } from "./config";
import { RollemParser } from "@language/rollem";
import { Client } from "discord.js";
import { ChangeLog } from "./changelog";
import { BehaviorBase } from "./behaviors/behavior-base";
import assert = require("assert");
import { InjectorWrapper } from "./lib/injector-wrapper";
import { Newable } from "./lib/utility-types";

export namespace Bootstrapper {
  /** Constructs the upper-most DI context for the bot. */
  export function buildTopLevelProviders() {
    console.log("Setting up top-level DI");
    const topLevelInjector =
      InjectorWrapper.createTopLevelContext(
        [
          Logger,
          Config,
          ChangeLog,
          RollemParser,
        ]);

    const logger = topLevelInjector.get(Logger);
    const config = topLevelInjector.get(Config);
    const changelog = topLevelInjector.get(ChangeLog);
    const parser = topLevelInjector.get(RollemParser);
    assert(!!logger, "DI failed to resolve logger");
    assert(!!config, "DI failed to resolve config");
    assert(!!changelog, "DI failed to resolve changelog");
    assert(!!parser, "DI failed to resolve parser");

    return topLevelInjector;
  }

  /** Starts reading the changelog and updates logger with it. */
  export function prepareChangelog(topLevelInjector: InjectorWrapper) {
    const logger = topLevelInjector.get(Logger);
    topLevelInjector.get(ChangeLog)
      .initialize()
      .then(changelog => {
        logger.changelog = changelog;
        logger.trackEvent(
          `Got changelog ${changelog.changelog}`,
          {
            version: changelog.version,
          })
        });
  }

  /** Creates the client and hooks it up to the logger. */
  export function prepareClient(topLevelInjector: InjectorWrapper) {
    const logger = topLevelInjector.get(Logger);
    const config = topLevelInjector.get(Config);

    
    logger.trackEvent("Constructing client...");
    logger.trackEvent("Shard ID: " + config.ShardId)
    logger.trackEvent("Shard Count: " + config.ShardCount)
    logger.trackEvent("Logging in using token: " + config.Token);

    const clientOptions =
      config.HasShardInfo
      ? {
        shardCount: config.ShardCount,
        shardId: config.ShardId }
      : undefined;

    const client = new Client(clientOptions);
    logger.client = client;

    return client;
  }

  /** Creates the DI context in which the client and its behaviors live. */
  export function createClientContext(topLevelInjector: InjectorWrapper, client: Client, orderedBehaviors: Newable<BehaviorBase>[]) {
    topLevelInjector.get(Logger).trackEvent("Setting up client-scoped DI");
    return topLevelInjector.createChildContext([
      { provide: Client, useValue: client, },
      ...orderedBehaviors,
    ]);
  }

  /** Attaches the known behaviors to the client. */
  export function attachBehaviorsToClient(clientLevelInjector: InjectorWrapper, orderedBehaviors: Newable<BehaviorBase>[]) {
    const logger = clientLevelInjector.get(Logger);
    logger.trackEvent("Constructing behaviors...");
    const constructedBehaviors = orderedBehaviors.map(ctor => clientLevelInjector.get(ctor) as BehaviorBase);

    logger.trackEvent("Applying behaviors...");
    constructedBehaviors.forEach(b => b.apply());
  }

  /** Starts the client. */
  export function startClient(clientLevelInjector: InjectorWrapper) {
    const logger = clientLevelInjector.get(Logger);
    const client = clientLevelInjector.get(Client);
    const config = clientLevelInjector.get(Config);

    logger.trackEvent("Ready to start. Logging in...");
    client.login(config.Token);

    logger.trackEvent("Logged in.");
  }
}