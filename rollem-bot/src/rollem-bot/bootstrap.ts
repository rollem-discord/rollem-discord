import { Logger } from "./logger";

import { Config } from "./config";

import { RollemParserV1 } from "@language-v1/rollem-parser";
import { RollemParserV2 } from "@language-v2/rollem-parser";
import { Parsers } from "@bot/lib/parsers";

import { Client, ClientOptions } from "discord.js";
import { ChangeLog } from "./changelog";
import { BehaviorBase } from "./behaviors/behavior-base";
import assert = require("assert");
import { InjectorWrapper } from "./lib/injector-wrapper";
import { Newable } from "./lib/utility-types";
import { RepliedMessageCache } from "./lib/replied-message-cache";
import { Storage } from "../../../rollem-common/storage/storage";

// tslint:disable-next-line: no-namespace
export namespace Bootstrapper {
  /** Constructs the upper-most DI context for the bot. */
  export function buildTopLevelProviders() {
    // tslint:disable-next-line: no-console
    console.log("Setting up top-level DI");
    const topLevelInjector =
      InjectorWrapper.createTopLevelContext(
        [
          Logger,
          Config,
          { provide: Storage, useValue: new Storage() },
          ChangeLog,
          RollemParserV1,
          RollemParserV2,
          Parsers,
          RepliedMessageCache,
        ]);

    const logger = topLevelInjector.get(Logger);
    assert(!!logger, "DI failed to resolve logger");
    const config = topLevelInjector.get(Config);
    assert(!!config, "DI failed to resolve config");
    const changelog = topLevelInjector.get(ChangeLog);
    assert(!!changelog, "DI failed to resolve changelog");
    const parserv1 = topLevelInjector.get(RollemParserV1);
    assert(!!parserv1, "DI failed to resolve parser v1");
    const parserv2 = topLevelInjector.get(RollemParserV2);
    assert(!!parserv2, "DI failed to resolve parser v2");
    const parsers = topLevelInjector.get(Parsers);
    assert(!!parsers, "DI failed to resolve parsers");
    const repliedMessageCache = topLevelInjector.get(RepliedMessageCache);
    assert(!!repliedMessageCache, "DI failed to resolve repliedMessageCache");
    const storage = topLevelInjector.get(Storage);
    assert(!!storage, "DI failed to resolve storage");

    return topLevelInjector;
  }

  /** Starts reading the changelog and updates logger with it. */
  export async function prepareStorage(topLevelInjector: InjectorWrapper) {
    const logger = topLevelInjector.get(Logger);
    await topLevelInjector.get(Storage).initialize();
    logger.trackSimpleEvent(`Connected to postgres`);
  }

  /** Starts reading the changelog and updates logger with it. */
  export function prepareChangelog(topLevelInjector: InjectorWrapper) {
    const logger = topLevelInjector.get(Logger);
    topLevelInjector.get(ChangeLog)
      .initialize()
      .then(changelog => {
        logger.changelog = changelog;
        logger.trackSimpleEvent(
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

    logger.trackSimpleEvent("Constructing client...");
    logger.trackSimpleEvent("Shard ID: " + config.ShardId)
    logger.trackSimpleEvent("Shard Count: " + config.ShardCount)
    logger.trackSimpleEvent("Logging in using token: " + config.Token);

    const clientOptions: ClientOptions|undefined =
      config.HasShardInfo
      ? {
        shardCount: config.ShardCount,
        shards: config.ShardId }
      : undefined;

    const client = new Client(clientOptions);
    logger.client = client;

    return client;
  }

  /** Creates the DI context in which the client and its behaviors live. */
  export function createClientContext(topLevelInjector: InjectorWrapper, client: Client, orderedBehaviors: Newable<BehaviorBase>[]) {
    topLevelInjector.get(Logger).trackSimpleEvent("Setting up client-scoped DI");
    return topLevelInjector.createChildContext([
      { provide: Client, useValue: client, },
      ...orderedBehaviors,
    ]);
  }

  /** Attaches the known behaviors to the client. */
  export async function attachBehaviorsToClient(clientLevelInjector: InjectorWrapper, orderedBehaviors: Newable<BehaviorBase>[]) {
    const logger = clientLevelInjector.get(Logger);
    logger.trackSimpleEvent("Constructing behaviors...");
    const constructedBehaviors = orderedBehaviors.map(ctor => clientLevelInjector.get(ctor) as BehaviorBase);

    logger.trackSimpleEvent("Applying behaviors...");
    await Promise.all(constructedBehaviors.map(async b => await b.apply()));
  }

  /** Starts the client. */
  export function startClient(clientLevelInjector: InjectorWrapper) {
    const logger = clientLevelInjector.get(Logger);
    const client = clientLevelInjector.get(Client);
    const config = clientLevelInjector.get(Config);

    logger.trackSimpleEvent("Ready to start. Logging in...");
    client.login(config.Token);

    logger.trackSimpleEvent("Logged in.");
  }
}