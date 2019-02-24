// enable application insights if we have an instrumentation key set up
import * as appInsights from "applicationinsights";
if (process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
  // TODO: This reads all log messages from console. We can probably do better by logging via winston/bunyan.
  appInsights.setup()
      .setAutoDependencyCorrelation(true)
      .setAutoCollectRequests(true)
      .setAutoCollectPerformance(true)
      .setAutoCollectExceptions(true)
      .setAutoCollectDependencies(true)
      .setAutoCollectConsole(true, true)
      .setUseDiskRetryCaching(true)
      .start();
}

import { ShardingManager } from "discord.js";

// TODO: Can't debug this in VSCode due to the way discord.js has chosen to implement this currently
const manager = new ShardingManager(`${__dirname}/bot.js`, { totalShards: 3 });

manager.spawn();
manager.on('launch', shard => console.log(`Successfully launched shard ${shard.id}`));
