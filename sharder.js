import { ShardingManager } from "discord.js";

// TODO: Can't debug this in VSCode due to the way discord.js has chosen to implement this currently
const manager = new ShardingManager(`${__dirname}/bot.js`, { totalShards: 3 });

manager.spawn();
manager.on('launch', shard => console.log(`Successfully launched shard ${shard.id}`));
